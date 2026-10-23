(function () {
  'use strict';

  var $ = function (id) { return document.getElementById(id); };

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  function load(path) {
    return fetch(path, { cache: 'no-cache' }).then(function (r) {
      if (!r.ok) throw new Error('could not load ' + path);
      return r.json();
    });
  }

  function pad(n) { return (n < 10 ? '0' : '') + n; }

  function localDate(d) {
    return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate());
  }

  function prettyDate(iso) {
    var parts = String(iso).split('-');
    if (parts.length !== 3) return iso;
    var d = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
    return d.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' }).toLowerCase();
  }

  function stars(n) {
    var v = Math.max(0, Math.min(5, Number(n) || 0));
    return '\u2605'.repeat(v) + '\u2606'.repeat(5 - v);
  }

  function productCard(item) {
    var media = item.image
      ? '<img src="' + esc(item.image) + '" alt="' + esc(item.name) + '" draggable="false" loading="lazy">'
      : '<div class="ph" aria-hidden="true">' + esc(item.emoji || '\uD83C\uDF80') + '</div>';
    var buy = item.affiliate_url
      ? '<a class="buy" href="' + esc(item.affiliate_url) + '" target="_blank" rel="sponsored noopener">' + esc(item.button_text || 'shop it') + '</a>'
      : '<span class="buy soon">buy link coming soon</span>';
    var cat = item.category ? '<span class="cat">' + esc(item.category) + '</span>' : '';
    return '<article class="card">' +
      '<div class="media">' + media + '</div>' +
      '<div class="body">' + cat +
      '<h3>' + esc(item.name) + '</h3>' +
      '<p class="blurb">' + esc(item.blurb) + '</p>' +
      '<div class="score" aria-label="cute score ' + esc(item.cute_score) + ' out of 5"><span>cute score</span> <b>' + stars(item.cute_score) + '</b></div>' +
      buy +
      '</div></article>';
  }

  function downloadCard(item, site, sessionTag) {
    var mark = (site.name || 'Koolkute') + ' \u00B7 ' + (site.copyright_short || 'all rights reserved') + '\n' + sessionTag;
    var img = item.preview
      ? '<img src="' + esc(item.preview) + '" alt="" draggable="false">'
      : '<div class="ph" aria-hidden="true">' + esc(item.emoji || '\uD83C\uDF38') + '</div>';
    var get = item.file_url
      ? '<a class="buy" href="' + esc(item.file_url) + '" download>get it</a>'
      : '<span class="buy soon">coming soon</span>';
    return '<figure class="dl locked">' +
      '<div class="wm" data-wm="' + esc(mark) + '">' + img + '</div>' +
      '<figcaption><b>' + esc(item.name) + '</b><span>' + esc(item.blurb) + '</span>' + get + '</figcaption>' +
      '</figure>';
  }

  function sessionTag() {
    var key = 'cutie-drop-tag';
    var tag = null;
    try { tag = sessionStorage.getItem(key); } catch (e) { /* storage blocked */ }
    if (!tag) {
      tag = 'for you \u00B7 ' + Math.random().toString(36).slice(2, 8);
      try { sessionStorage.setItem(key, tag); } catch (e) { /* storage blocked */ }
    }
    return tag;
  }

  function protectDownloads() {
    // deterrents only: a browser cannot truly block screenshots
    document.addEventListener('contextmenu', function (e) {
      if (e.target.closest && e.target.closest('.locked')) e.preventDefault();
    });
    document.addEventListener('dragstart', function (e) {
      if (e.target.closest && e.target.closest('.locked')) e.preventDefault();
    });
    document.addEventListener('copy', function (e) {
      var sel = window.getSelection && window.getSelection();
      if (sel && sel.anchorNode && sel.anchorNode.parentElement && sel.anchorNode.parentElement.closest('.locked')) {
        e.preventDefault();
      }
    });
  }

  async function init() {
    var site, items, downloads;
    try {
      var results = await Promise.all([load('data/site.json'), load('data/items.json'), load('data/downloads.json')]);
      site = results[0];
      items = results[1];
      downloads = results[2];
    } catch (err) {
      $('dropGrid').innerHTML = '<p class="empty">couldn\'t load the drop. if you opened this file straight from your computer, it needs to be viewed through a web host (see the README).</p>';
      return;
    }

    // site text
    document.title = site.name || 'Koolkute';
    $('siteName').textContent = site.name || 'Koolkute';
    $('heroName').textContent = site.name || 'Koolkute';
    $('tagline').textContent = site.tagline || '';
    $('aboutText').textContent = site.about || '';
    $('disclosure').textContent = site.affiliate_disclosure || '';
    $('legal').textContent = site.copyright_line || '';
    $('copy').textContent = site.copyright_line || '';

    var now = new Date();
    var today = localDate(now);
    $('todayLabel').textContent = prettyDate(today);

    // only show items whose drop date has arrived (future items stay hidden until their day)
    var live = (items || []).filter(function (it) { return it.drop_date && it.drop_date <= today; });
    live.sort(function (a, b) { return a.drop_date < b.drop_date ? 1 : a.drop_date > b.drop_date ? -1 : 0; });

    if (live.length) {
      var latest = live[0].drop_date;
      var todays = live.filter(function (it) { return it.drop_date === latest; });
      var past = live.filter(function (it) { return it.drop_date !== latest; });
      $('dropDate').textContent = prettyDate(latest);
      $('dropGrid').innerHTML = todays.map(productCard).join('');
      if (past.length) {
        $('pastGrid').innerHTML = past.map(productCard).join('');
        $('pastBlock').hidden = false;
      }
    } else {
      $('dropGrid').innerHTML = '<p class="empty">the next drop lands soon. check back!</p>';
    }

    // exclusive downloads
    var tag = sessionTag();
    var dl = downloads || [];
    $('dlGrid').innerHTML = dl.length
      ? dl.map(function (d) { return downloadCard(d, site, tag); }).join('')
      : '<p class="empty">first freebies are on their way.</p>';

    protectDownloads();
  }

  init();
})();
