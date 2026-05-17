# aXcelerate scraper

Captures rendered HTML + full-page screenshots of three aXcelerate learner
pages (login → dashboard → activity overview) so the static recreation in
`../` can be tuned to match.

## One-time setup

From the project root (`alliance-college/`):

```bash
# 1. Fill in your credentials
cp .env.example .env       # already created for you; just edit it
$EDITOR .env               # set AX_EMAIL and AX_PASSWORD

# 2. Create a virtualenv and install Playwright
cd scraper
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
playwright install chromium
```

If `playwright install chromium` complains about system libraries, run:

```bash
sudo playwright install-deps chromium    # Linux only
```

## Run

```bash
# from scraper/, with .venv active
python scrape.py
```

A Chromium window opens. The script will:

1. Navigate to `AX_LOGIN_URL` and snapshot it → `output/01-login.{html,png}`
2. Fill in your email/password and submit.
3. **Wait up to 5 minutes** for the dashboard URL to appear — if MFA is
   prompted, complete it in the browser window and the script picks up.
4. Snapshot the dashboard → `output/02-dashboard.{html,png}`
5. Find a course tile whose text contains `AX_COURSE_MATCH` (default
   `Land Agent`) and click it.
6. Snapshot the activity overview → `output/03-activity-overview.{html,png}`
7. Save the session cookies to `.storage_state.json` so subsequent runs
   can skip the login form.

If anything goes wrong, an `error.png` is written and the exception is
printed to stderr.

## Tuning

| Env var          | What it does                                                 |
|------------------|--------------------------------------------------------------|
| `AX_LOGIN_URL`   | Where to start. Replace with your tenant's actual URL.       |
| `AX_EMAIL`       | Your learner email.                                          |
| `AX_PASSWORD`    | Your learner password.                                       |
| `AX_COURSE_MATCH`| Substring used to find the course tile (case-insensitive).   |
| `AX_HEADLESS`    | `1` to hide the browser. Leave `0` for MFA-friendly runs.    |

## What ends up in `output/`

```
01-login.html   01-login.png
02-dashboard.html   02-dashboard.png
03-activity-overview.html   03-activity-overview.png
```

These are gitignored — they may contain personal info (your name, course
enrolments, trainer emails, etc.).

## Caveats

- **Terms of service.** aXcelerate's ToS likely prohibits automated
  access. You are running this against your own account. Run it sparingly
  (once or twice), don't loop it, and don't share the captured HTML
  publicly.
- **MFA / 2FA.** Complete the prompt manually in the headed browser. The
  script will wait.
- **Selectors may drift.** If aXcelerate changes their UI, the email /
  password / submit selectors in `scrape.py` may need updating. The script
  prints which selector worked.
- **Single-page captures only.** This script is intentionally scoped to
  the three pages we care about. Don't extend it to crawl wider — that's
  where ToS issues bite.
