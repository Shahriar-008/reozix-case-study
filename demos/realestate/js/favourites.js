// favourites.js - saved listings for the Real Estate demo.
// Persists per-browser via localStorage ('re-favs'); wrapped in try/catch so
// private-browsing users just get a non-persistent session instead of errors.
//
// - Injects a heart button into every .property-card whose link points at
//   property-detail.html?id=… (cards are static HTML; the id comes from the href).
// - On the property detail page, adds a heart beside the listing price.
// - Stores a snapshot (address/price/suburb/photo) at save-time so the saved
//   drawer can render without loading the full dataset.
// - Renders a "Saved" nav link with a live count badge and a slide-over drawer
//   (Esc / backdrop close, focus return) listing saved properties.

(function() {
  window.RZFav = {
    KEY: 're-favs',
    all: function() {
      try { return JSON.parse(localStorage.getItem(this.KEY)) || []; }
      catch (e) { return []; }
    },
    ids: function() { return this.all().map(function(x) { return typeof x === 'string' ? x : x.id; }); },
    has: function(id) { return this.ids().indexOf(id) !== -1; },
    get: function(id) {
      return this.all().filter(function(x) { return (typeof x === 'string' ? x : x.id) === id; })[0] || null;
    },
    toggle: function(id, snapshot) {
      var favs = this.all();
      var i = this.ids().indexOf(id);
      if (i === -1) favs.push(snapshot || id); else favs.splice(i, 1);
      try { localStorage.setItem(this.KEY, JSON.stringify(favs)); } catch (e) { /* non-persistent */ }
      return i === -1; // true → now saved
    }
  };

  function heartSvg() {
    var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox', '0 0 24 24');
    svg.setAttribute('width', '20');
    svg.setAttribute('height', '20');
    svg.innerHTML = '<path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>';
    return svg;
  }

  function snapshotFromCard(card, id) {
    var img = card.querySelector('.property-photo img');
    var price = card.querySelector('.property-price');
    var title = card.querySelector('.property-title, h3');
    var suburbEl = card.querySelector('.property-suburb, .property-location');
    var suburb = suburbEl ? suburbEl.textContent.trim() : (title && title.textContent.split(',').pop() || '');
    return {
      id: id,
      address: title ? title.textContent.trim() : id,
      price: price ? price.textContent.trim() : '',
      suburb: suburb.replace(/^,\s*/, ''),
      img: img ? img.src : ''
    };
  }

  function makeBtn(id, card) {
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'fav-btn' + (RZFav.has(id) ? ' saved' : '');
    btn.setAttribute('aria-pressed', String(RZFav.has(id)));
    btn.setAttribute('aria-label', RZFav.has(id) ? 'Remove from saved properties' : 'Save this property');
    btn.appendChild(heartSvg());
    btn.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      var saved = RZFav.toggle(id, card ? snapshotFromCard(card, id) : buildSnapshotFromDetail(id));
      btn.classList.toggle('saved', saved);
      btn.setAttribute('aria-pressed', String(saved));
      btn.setAttribute('aria-label', saved ? 'Remove from saved properties' : 'Save this property');
      updateBadge();
      renderDrawer();
    });
    return btn;
  }

  function buildSnapshotFromDetail(id) {
    var snap = { id: id, address: id, price: '', suburb: '', img: '' };
    var addr = document.getElementById('prop-address') || document.querySelector('.property-detail h1, .detail-content h1');
    var price = document.getElementById('prop-price');
    var img = document.querySelector('.gallery-main img, .property-gallery img');
    if (addr) snap.address = addr.textContent.trim();
    if (price) snap.price = price.textContent.trim().split('\n')[0];
    if (img) snap.img = img.src;
    return snap;
  }

  function propIdFromLink(href) {
    try { return new URL(href, window.location.href).searchParams.get('id'); }
    catch (e) { return null; }
  }

  /* ---- Nav "Saved" link + badge ---- */
  function updateBadge() {
    var badge = document.querySelector('.saved-count');
    if (!badge) return;
    var n = RZFav.ids().length;
    badge.textContent = String(n);
    badge.style.display = n ? 'inline-flex' : 'none';
  }

  function injectNav() {
    var links = document.querySelector('.nav-links');
    if (!links || document.getElementById('saved-nav-link')) return;
    var a = document.createElement('a');
    a.href = '#saved-drawer';
    a.id = 'saved-nav-link';
    a.className = 'saved-nav-link';
    a.innerHTML = 'Saved <span class="saved-count" style="display:none;">0</span>';
    a.addEventListener('click', function(e) {
      e.preventDefault();
      openDrawer();
    });
    links.insertBefore(a, links.querySelector('.book-btn, a:last-child'));
    updateBadge();
  }

  /* ---- Drawer ---- */
  var drawer = null, backdrop = null, lastFocus = null;

  function ensureDrawer() {
    if (drawer) return;
    backdrop = document.createElement('div');
    backdrop.className = 'drawer-backdrop';
    backdrop.addEventListener('click', closeDrawer);
    drawer = document.createElement('aside');
    drawer.className = 'saved-drawer';
    drawer.id = 'saved-drawer';
    drawer.setAttribute('role', 'dialog');
    drawer.setAttribute('aria-modal', 'true');
    drawer.setAttribute('aria-label', 'Saved properties');
    drawer.innerHTML =
      '<div class="drawer-head">' +
      '  <h2>Saved properties</h2>' +
      '  <button type="button" class="drawer-close" aria-label="Close saved properties">✕</button>' +
      '</div>' +
      '<div class="drawer-body" id="drawer-body"></div>';
    document.body.appendChild(backdrop);
    document.body.appendChild(drawer);
    drawer.querySelector('.drawer-close').addEventListener('click', closeDrawer);
    document.addEventListener('keydown', function(e) {
      if (!drawer.classList.contains('open')) return;
      if (e.key === 'Escape') closeDrawer();
      if (e.key === 'Tab') {
        var f = Array.prototype.filter.call(drawer.querySelectorAll('a, button'), function(el) { return el.offsetParent !== null; });
        if (!f.length) return;
        var first = f[0], last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    });
  }

  function renderDrawer() {
    if (!drawer) return;
    var body = drawer.querySelector('#drawer-body');
    var favs = RZFav.all().filter(function(x) { return typeof x === 'object'; });
    if (!favs.length) {
      body.innerHTML =
        '<div class="drawer-empty">' +
        '<p>No saved properties yet.</p>' +
        '<p class="drawer-empty-sub">Tap the heart on any listing to keep it here.</p>' +
        '<a href="search.html" class="drawer-cta">Browse properties</a>' +
        '</div>';
      return;
    }
    body.innerHTML = favs.map(function(s) {
      return '<div class="drawer-item">' +
        '<a href="property-detail.html?id=' + encodeURIComponent(s.id) + '" class="drawer-item-link">' +
        (s.img ? '<img src="' + s.img + '" alt="">' : '') +
        '<div class="drawer-item-info">' +
        '<strong>' + s.address + '</strong>' +
        (s.price ? '<span class="drawer-item-price">' + s.price + '</span>' : '') +
        (s.suburb ? '<span class="drawer-item-suburb">' + s.suburb + '</span>' : '') +
        '</div></a>' +
        '<button type="button" class="drawer-remove" aria-label="Remove ' + s.address + ' from saved" data-remove="' + s.id + '">✕</button>' +
        '</div>';
    }).join('');
    body.querySelectorAll('[data-remove]').forEach(function(btn) {
      btn.addEventListener('click', function() {
        RZFav.toggle(btn.getAttribute('data-remove'));
        renderDrawer();
        updateBadge();
      });
    });
  }

  function openDrawer() {
    ensureDrawer();
    renderDrawer();
    lastFocus = document.activeElement;
    drawer.classList.add('open');
    backdrop.classList.add('open');
    document.body.style.overflow = 'hidden';
    drawer.querySelector('.drawer-close').focus();
  }

  function closeDrawer() {
    if (!drawer) return;
    drawer.classList.remove('open');
    backdrop.classList.remove('open');
    document.body.style.overflow = '';
    if (lastFocus) lastFocus.focus();
  }

  document.addEventListener('DOMContentLoaded', function() {
    injectNav();

    // Listing cards (index + search)
    document.querySelectorAll('.property-card').forEach(function(card) {
      if (card.querySelector('.fav-btn')) return;
      var link = card.querySelector('a[href*="property-detail.html?id="]');
      var id = link && propIdFromLink(link.href);
      if (!id) return;
      // Anchor to the photo block when present so absolute positioning tracks it
      var mount = card.querySelector('.property-photo') || card;
      mount.style.position = getComputedStyle(mount).position === 'static' ? 'relative' : mount.style.position;
      mount.appendChild(makeBtn(id, card));
    });

    // Property detail page - heart beside the price
    var price = document.getElementById('prop-price');
    var head = document.getElementById('detail-content');
    if (price && head) {
      var params = new URLSearchParams(window.location.search);
      var id = params.get('id');
      if (id) {
        var btn = makeBtn(id);
        btn.classList.add('fav-btn--inline');
        price.insertAdjacentElement('afterend', btn);
      }
    }
  });
})();
