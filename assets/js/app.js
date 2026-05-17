// Alliance College — shared client behavior
// Login → dashboard redirect, password show/hide, user menu, tab/pill toggles.

(function () {
  'use strict';

  // ---------- Footer year ----------
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  // ---------- Login form ----------
  var loginForm = document.getElementById('loginForm');
  if (loginForm) {
    loginForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var email = document.getElementById('email');
      var password = document.getElementById('password');
      if (!email.value || !password.value) {
        if (!email.value) email.focus();
        else password.focus();
        return;
      }
      // No real auth — go straight to the learner dashboard.
      window.location.href = 'dashboard.html';
    });
  }

  var togglePwd = document.getElementById('togglePassword');
  if (togglePwd) {
    var doToggle = function () {
      var pwd = document.getElementById('password');
      if (!pwd) return;
      var hidden = pwd.type === 'password';
      pwd.type = hidden ? 'text' : 'password';
      togglePwd.textContent = hidden ? 'HIDE' : 'SHOW';
      togglePwd.setAttribute('aria-label', hidden ? 'Hide password' : 'Show password');
    };
    togglePwd.addEventListener('click', doToggle);
    togglePwd.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        doToggle();
      }
    });
  }

  // ---------- User menu dropdown ----------
  var userMenu = document.getElementById('userMenu');
  var userDropdown = document.getElementById('userDropdown');
  if (userMenu && userDropdown) {
    var open = function () {
      userDropdown.classList.add('open');
      userMenu.setAttribute('aria-expanded', 'true');
    };
    var close = function () {
      userDropdown.classList.remove('open');
      userMenu.setAttribute('aria-expanded', 'false');
    };
    userMenu.addEventListener('click', function (e) {
      e.stopPropagation();
      if (userDropdown.classList.contains('open')) close(); else open();
    });
    userMenu.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        if (userDropdown.classList.contains('open')) close(); else open();
      }
      if (e.key === 'Escape') close();
    });
    document.addEventListener('click', function (e) {
      if (!userMenu.contains(e.target)) close();
    });
  }

  var logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', function () {
      window.location.href = 'index.html';
    });
  }

  // ---------- Tab strips & filter pills (simple visual toggle) ----------
  function wireToggleGroup(selector) {
    document.querySelectorAll(selector).forEach(function (group) {
      var buttons = group.querySelectorAll('button');
      buttons.forEach(function (btn) {
        btn.addEventListener('click', function () {
          buttons.forEach(function (b) {
            b.classList.remove('active');
            if (b.getAttribute('role') === 'tab') b.setAttribute('aria-selected', 'false');
          });
          btn.classList.add('active');
          if (btn.getAttribute('role') === 'tab') btn.setAttribute('aria-selected', 'true');
        });
      });
    });
  }
  wireToggleGroup('.tabs');
  wireToggleGroup('.filter-pills');

  // ---------- Activity rows: stop bubbling on link-look-alike spans ----------
  document.querySelectorAll('.activity-row[href="#"], .act-row[href="#"]').forEach(function (row) {
    row.addEventListener('click', function (e) {
      e.preventDefault();
    });
  });

  // ---------- Module group collapse / expand ----------
  document.querySelectorAll('[data-module] [data-toggle]').forEach(function (head) {
    head.addEventListener('click', function () {
      var group = head.closest('[data-module]');
      if (group) group.classList.toggle('collapsed');
    });
  });
})();
