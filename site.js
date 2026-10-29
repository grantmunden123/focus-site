/* Focus website: theme switcher. Runs in <head> so the saved theme paints with no flash. */
(function () {
  var SKINS = ['default', 'glass', 'bento', 'brutal', 'mono', 'cyber'];
  var NAMES = { default: 'Default', glass: 'Glass', bento: 'Bento', brutal: 'Neobrutalism', mono: 'Monochrome', cyber: 'Cyberpunk' };
  var MODES = ['auto', 'light', 'dark'];
  var root = document.documentElement;
  var mq = window.matchMedia ? window.matchMedia('(prefers-color-scheme: dark)') : { matches: false };

  function read(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
  function write(k, v) { try { localStorage.setItem(k, v); } catch (e) { /* storage blocked: still works for this visit */ } }

  var skin = read('focus-skin'); if (SKINS.indexOf(skin) < 0) skin = 'default';
  var mode = read('focus-mode'); if (MODES.indexOf(mode) < 0) mode = 'auto';

  function apply() {
    var resolved = mode === 'auto' ? (mq.matches ? 'dark' : 'light') : mode;
    if (skin === 'cyber') resolved = 'dark'; // Cyberpunk is dark-only
    root.setAttribute('data-skin', skin);
    root.setAttribute('data-theme', resolved);

    var btns = document.querySelectorAll('.theme');
    for (var i = 0; i < btns.length; i++) {
      var on = btns[i].getAttribute('data-skin') === skin;
      btns[i].classList.toggle('active', on);
      btns[i].setAttribute('aria-pressed', on ? 'true' : 'false');
    }
    var mb = document.getElementById('modeBtn');
    if (mb) {
      var label = skin === 'cyber' ? 'Dark' : mode.charAt(0).toUpperCase() + mode.slice(1);
      mb.textContent = label;
      mb.disabled = skin === 'cyber';
      mb.setAttribute('aria-label', skin === 'cyber' ? 'Appearance: always dark in Cyberpunk' : 'Appearance: ' + label + '. Click to change.');
    }
    var st = document.getElementById('themeStatus');
    if (st) st.textContent = 'Theme: ' + NAMES[skin];

    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) {
      var bg = getComputedStyle(root).getPropertyValue('--bg').trim();
      if (bg) meta.setAttribute('content', bg);
    }
  }

  function setSkin(s) { skin = s; write('focus-skin', s); apply(); }
  function cycleMode() { mode = MODES[(MODES.indexOf(mode) + 1) % MODES.length]; write('focus-mode', mode); apply(); }

  apply();
  document.addEventListener('DOMContentLoaded', function () {
    apply();
    var btns = document.querySelectorAll('.theme');
    for (var i = 0; i < btns.length; i++) {
      btns[i].addEventListener('click', function () { setSkin(this.getAttribute('data-skin')); });
    }
    var mb = document.getElementById('modeBtn');
    if (mb) mb.addEventListener('click', cycleMode);
  });
  if (mq.addEventListener) mq.addEventListener('change', function () { if (mode === 'auto') apply(); });
})();
