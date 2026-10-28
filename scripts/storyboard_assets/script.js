(function () {
  var copy = document.getElementById('rt-copy');
  var bare = document.getElementById('rt-bare');
  var raw = document.getElementById('rt-raw');
  copy.addEventListener('click', function () {
    var text = raw.textContent;
    var done = function () { copy.textContent = 'Copied';
      setTimeout(function () { copy.textContent = 'Copy script'; }, 1600); };
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(done, fallback);
    } else { fallback(); }
    function fallback() {
      // file:// in some browsers refuses the async clipboard; select instead
      var sel = window.getSelection(), range = document.createRange();
      raw.style.position = 'static'; raw.style.left = '0';
      range.selectNodeContents(raw); sel.removeAllRanges(); sel.addRange(range);
      try { document.execCommand('copy'); done(); } catch (e) {
        copy.textContent = 'Press Cmd+C'; }
      raw.style.position = 'absolute'; raw.style.left = '-9999px';
    }
  });
  bare.addEventListener('click', function () {
    var on = document.body.classList.toggle('bare');
    bare.textContent = on ? 'Show markers' : 'Hide markers';
  });
})();
(function () {
  function save(img, name) {
    var a = document.createElement('a');
    a.href = img.src;                 // the processed, redacted PNG, already inlined
    a.download = name;
    document.body.appendChild(a); a.click(); a.remove();
  }
  document.addEventListener('click', function (e) {
    var btn = e.target.closest && e.target.closest('.dl');
    if (!btn) return;
    var img = btn.closest('.beat').querySelector('img');
    if (img) save(img, btn.dataset.name);
  });
  var all = document.querySelector('.dlall');
  if (all) all.addEventListener('click', function () {
    var btns = [].slice.call(document.querySelectorAll('.dl'));
    if (!btns.length) return;
    all.disabled = true;
    btns.forEach(function (btn, i) {
      // Browsers throttle a burst of downloads, so stagger them.
      setTimeout(function () {
        var img = btn.closest('.beat').querySelector('img');
        if (img) save(img, btn.dataset.name);
        if (i === btns.length - 1) {
          all.disabled = false;
          all.lastChild.textContent = 'Downloaded ' + btns.length;
          setTimeout(function () {
            all.lastChild.textContent = 'Download all screenshots';
          }, 2200);
        }
      }, i * 180);
    });
  });
})();
