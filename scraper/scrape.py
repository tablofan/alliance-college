"""Alliance College — aXcelerate scraper.

Logs into an aXcelerate learner portal, navigates to the learner dashboard,
opens a course you specify by name fragment, and saves rendered HTML +
full-page screenshots for each page so the Alliance College static site
can be tuned to match the real thing.

Reads credentials from `.env` at the project root (one level above this file).
Defaults to a headed browser so you can complete MFA / 2FA prompts manually;
the script will keep waiting up to 5 minutes for the dashboard URL to appear.

Usage:
    python -m venv .venv && source .venv/bin/activate
    pip install -r requirements.txt
    playwright install chromium
    python scrape.py
"""

from __future__ import annotations

import asyncio
import os
import sys
from datetime import datetime
from pathlib import Path

from dotenv import load_dotenv
from playwright.async_api import (
    Page,
    Playwright,
    TimeoutError as PWTimeoutError,
    async_playwright,
)

PROJECT_ROOT = Path(__file__).resolve().parent.parent
SCRAPER_DIR = Path(__file__).resolve().parent
OUTPUT_DIR = SCRAPER_DIR / "output"
STATE_FILE = SCRAPER_DIR / ".storage_state.json"  # session cache (gitignored)

load_dotenv(PROJECT_ROOT / ".env")

LOGIN_URL = os.getenv("AX_LOGIN_URL", "https://app.axcelerate.com/learner/").strip()
EMAIL = (os.getenv("AX_EMAIL") or "").strip()
PASSWORD = os.getenv("AX_PASSWORD") or ""
COURSE_MATCH = (os.getenv("AX_COURSE_MATCH") or "Land Agent").strip()
HEADLESS = os.getenv("AX_HEADLESS", "0").strip() in ("1", "true", "yes", "on")

# Generous waits — aXcelerate's SPA can be slow and users may need
# to complete MFA manually in the headed browser window.
MFA_WAIT_MS = 5 * 60 * 1000   # 5 minutes
PAGE_RENDER_MS = 60 * 1000    # 60 seconds for the SPA to populate after nav
RENDER_SETTLE_S = 3            # extra grace for React to finish painting


def stamp() -> str:
    return datetime.now().strftime("%H:%M:%S")


def log(msg: str) -> None:
    print(f"[{stamp()}] {msg}", flush=True)


async def capture(page: Page, name: str) -> None:
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    html_path = OUTPUT_DIR / f"{name}.html"
    png_path = OUTPUT_DIR / f"{name}.png"
    html = await page.content()
    html_path.write_text(html, encoding="utf-8")
    await page.screenshot(path=str(png_path), full_page=True)
    log(f"saved {html_path.name} + {png_path.name}")


async def try_fill(page: Page, selectors: list[str], value: str, label: str) -> bool:
    for sel in selectors:
        loc = page.locator(sel).first
        try:
            await loc.wait_for(state="visible", timeout=4000)
            await loc.fill(value)
            log(f"filled {label} via `{sel}`")
            return True
        except PWTimeoutError:
            continue
    return False


async def try_click(page: Page, selectors: list[str], label: str) -> bool:
    for sel in selectors:
        loc = page.locator(sel).first
        try:
            await loc.wait_for(state="visible", timeout=4000)
            await loc.click()
            log(f"clicked {label} via `{sel}`")
            return True
        except PWTimeoutError:
            continue
    return False


async def perform_login(page: Page) -> None:
    log(f"navigating to {LOGIN_URL}")
    await page.goto(LOGIN_URL, wait_until="domcontentloaded")
    # Give the SPA time to render the form.
    try:
        await page.wait_for_load_state("networkidle", timeout=PAGE_RENDER_MS)
    except PWTimeoutError:
        log("networkidle not reached on login page — continuing anyway")
    await asyncio.sleep(RENDER_SETTLE_S)
    await capture(page, "01-login")

    # Already logged in (session restored)?
    if "/learner" in page.url and "login" not in page.url.lower():
        log("session appears already authenticated, skipping login form")
        return

    filled_email = await try_fill(
        page,
        [
            'input[type="email"]',
            'input[name="email"]',
            'input[autocomplete="username"]',
            'input[name="username"]',
            'input[id*="email" i]',
            'input[id*="username" i]',
        ],
        EMAIL,
        "email",
    )
    if not filled_email:
        log("WARN: could not find an email/username input — paste it manually in the browser, then press <Enter> here")
        input()

    filled_pw = await try_fill(
        page,
        [
            'input[type="password"]',
            'input[name="password"]',
            'input[autocomplete="current-password"]',
        ],
        PASSWORD,
        "password",
    )
    if not filled_pw:
        log("WARN: could not find a password input — paste it manually, then press <Enter>")
        input()

    submitted = await try_click(
        page,
        [
            'button[type="submit"]',
            'button:has-text("Sign in")',
            'button:has-text("Log in")',
            'button:has-text("Login")',
            'input[type="submit"]',
        ],
        "submit",
    )
    if not submitted:
        log("WARN: could not click submit — press the button in the browser, then press <Enter>")
        input()


async def wait_for_dashboard(page: Page) -> None:
    log("waiting for dashboard URL (5min window — complete MFA in the browser if prompted)...")
    try:
        await page.wait_for_url("**/learner/**", timeout=MFA_WAIT_MS)
    except PWTimeoutError:
        log("did not reach a /learner/ URL — current URL: " + page.url)
        log("if you're on the right page already, press <Enter> to continue anyway")
        input()
    try:
        await page.wait_for_load_state("networkidle", timeout=PAGE_RENDER_MS)
    except PWTimeoutError:
        pass
    await asyncio.sleep(RENDER_SETTLE_S)


async def dismiss_welcome_modal(page: Page) -> None:
    """Entry Education shows a welcome modal on first dashboard visit each
    session. Click whichever 'dismiss' control is present — Get Started,
    Close, OK, etc. — so the underlying course cards become clickable."""
    candidates = [
        page.get_by_role("button", name="Get Started"),
        page.get_by_role("button", name="Get started"),
        page.get_by_role("button", name="Close"),
        page.get_by_role("button", name="OK"),
        page.get_by_role("button", name="Dismiss"),
        page.locator('[aria-label="Close"]'),
    ]
    for cand in candidates:
        try:
            await cand.first.wait_for(state="visible", timeout=2500)
            await cand.first.click()
            log(f"dismissed modal via `{cand}`")
            await asyncio.sleep(1)
            return
        except PWTimeoutError:
            continue
    # Hit Escape as a final fallback (covers generic dialogs).
    await page.keyboard.press("Escape")


async def open_course(page: Page) -> None:
    log(f"searching for course matching '{COURSE_MATCH}'...")

    # aXcelerate wraps each course tile in a div with role="button". Locate
    # the card by its visible text and prefer the inner "Learning Plan"
    # button when present — it's a real <button> and always actionable.
    card = page.locator('[role="button"]').filter(has_text=COURSE_MATCH).first

    try:
        await card.wait_for(state="visible", timeout=15000)
    except PWTimeoutError:
        log(f"could not find a course tile matching '{COURSE_MATCH}'.")
        return

    await card.scroll_into_view_if_needed()

    # Prefer the "Learning Plan" inner button — that's the direct entry to
    # the activity overview for a self-paced enrolment.
    learning_plan = card.get_by_role("button", name="Learning Plan")
    clicked_via = None
    try:
        if await learning_plan.count() > 0:
            await learning_plan.first.click(timeout=10000)
            clicked_via = "Learning Plan button"
    except PWTimeoutError:
        pass

    if clicked_via is None:
        # Fall back to clicking the card itself (force, in case an overlay
        # is still settling but no longer blocking pointer events).
        try:
            await card.click(timeout=10000)
            clicked_via = "card click"
        except PWTimeoutError:
            await card.click(force=True)
            clicked_via = "card click (forced)"

    log(f"opened course via {clicked_via}, waiting for activity overview...")
    try:
        await page.wait_for_load_state("networkidle", timeout=PAGE_RENDER_MS)
    except PWTimeoutError:
        pass
    await asyncio.sleep(RENDER_SETTLE_S)


async def run(pw: Playwright) -> None:
    log(f"launching chromium (headless={HEADLESS})")
    browser = await pw.chromium.launch(headless=HEADLESS, slow_mo=150)

    storage_state = str(STATE_FILE) if STATE_FILE.exists() else None
    ctx = await browser.new_context(
        viewport={"width": 1440, "height": 900},
        storage_state=storage_state,
    )
    page = await ctx.new_page()

    try:
        await perform_login(page)
        await wait_for_dashboard(page)
        await dismiss_welcome_modal(page)
        await capture(page, "02-dashboard")

        # Save session right after a successful login so re-runs skip auth
        # even if a later step fails.
        await ctx.storage_state(path=str(STATE_FILE))
        log(f"session saved to {STATE_FILE.name}")

        await open_course(page)
        await capture(page, "03-activity-overview")

        # Refresh session cookies that may have rolled since.
        await ctx.storage_state(path=str(STATE_FILE))

        log("")
        log(f"done. outputs in {OUTPUT_DIR}")
    except Exception as e:
        log(f"ERROR: {e}")
        try:
            await capture(page, "error")
        except Exception:
            pass
        raise
    finally:
        # Small pause so the user can see the final state in the headed window
        if not HEADLESS:
            log("closing in 3s...")
            await asyncio.sleep(3)
        await ctx.close()
        await browser.close()


async def main() -> int:
    if not EMAIL or not PASSWORD:
        print(
            "ERROR: AX_EMAIL and AX_PASSWORD must be set in .env (project root).\n"
            f"       expected at: {PROJECT_ROOT / '.env'}",
            file=sys.stderr,
        )
        return 2

    async with async_playwright() as pw:
        await run(pw)
    return 0


if __name__ == "__main__":
    raise SystemExit(asyncio.run(main()))
