// search.js — instant client-side filtering for the Real Estate search page.
// Extends the base filterProperties() sketch to work with checkbox filters,
// a price range, sorting, dynamic filter counts, a no-results state, and
// pre-fill from the homepage query string (?suburb=&type=&min_price=&max_price=).

function getCheckedValues(filter) {
  var values = [];
  document.querySelectorAll('input[data-filter="' + filter + '"]').forEach(function(cb) {
    if (cb.checked) values.push(cb.value);
  });
  return values;
}

function filterProperties() {
  var typeFilters = getCheckedValues('type');
  var suburbFilters = getCheckedValues('suburb');
  var minBeds = parseInt(document.getElementById('filter-beds').value) || 0;
  var minPrice = parseInt(document.getElementById('filter-min-price').value) || 0;
  var maxPrice = parseInt(document.getElementById('filter-max-price').value) || 0;

  var cards = document.querySelectorAll('.property-card');
  var visible = 0;
  cards.forEach(function(card) {
    var type = card.dataset.type;
    var suburb = card.dataset.suburb;
    var beds = parseInt(card.dataset.beds);
    var price = parseInt(card.dataset.price);
    var match = true;
    if (typeFilters.length && typeFilters.indexOf(type) === -1) match = false;
    if (suburbFilters.length && suburbFilters.indexOf(suburb) === -1) match = false;
    if (beds < minBeds) match = false;
    if (minPrice && price < minPrice) match = false;
    if (maxPrice && price > maxPrice) match = false;
    // '' restores the card's stylesheet display:flex; 'none' hides it.
    card.style.display = match ? '' : 'none';
    if (match) visible++;
    card.setAttribute('data-visible', match ? '1' : '0');
  });

  applySort();

  var count = document.getElementById('result-count');
  if (count) count.textContent = visible;

  var empty = document.getElementById('no-results');
  if (empty) empty.classList.toggle('show', visible === 0);

  updateFilterCounts();
  updateMap();
}

/* Sorting — reorders visible cards inside the results grid. */
function applySort() {
  var grid = document.querySelector('.results-grid') || document.querySelector('.property-grid');
  if (!grid) return;
  var sort = document.getElementById('sort-by');
  if (!sort) return;
  var cards = Array.prototype.slice.call(grid.querySelectorAll('.property-card'));
  var mode = sort.value;
  cards.sort(function(a, b) {
    var pa = parseInt(a.dataset.price), pb = parseInt(b.dataset.price);
    var ba = parseInt(a.dataset.beds), bb = parseInt(b.dataset.beds);
    if (mode === 'price-asc') return pa - pb;
    if (mode === 'price-desc') return pb - pa;
    if (mode === 'beds-desc') return bb - ba || pb - pa;
    return 0; // featured = DOM order
  });
  cards.forEach(function(card) { grid.appendChild(card); });
}

/* Dynamic filter counts — recomputed from the visible dataset on every change. */
function updateFilterCounts() {
  var cards = Array.prototype.slice.call(document.querySelectorAll('.property-card'));
  document.querySelectorAll('.filter-group[data-filter-group]').forEach(function(group) {
    var filter = group.getAttribute('data-filter-group');
    group.querySelectorAll('input[data-filter]').forEach(function(cb) {
      var n = cards.filter(function(card) {
        if (card.getAttribute('data-visible') === '0') return false;
        return (card.dataset[filter] || '') === cb.value;
      }).length;
      var label = cb.parentNode;
      var base = label.dataset.base || (label.dataset.base = label.textContent.replace(/\s*\(\d+\)\s*$/, '').trim());
      label.textContent = base + (n !== undefined ? ' (' + n + ')' : '');
      label.insertBefore(cb, label.firstChild);
    });
  });
}

/* Check a checkbox for a filter value, adding one on the fly if the value
   isn't already in the sidebar (e.g. a suburb outside the top 8). */
function ensureFilterChecked(filter, value) {
  if (!value) return;
  var cbs = document.querySelectorAll('input[data-filter="' + filter + '"]');
  var found = false;
  cbs.forEach(function(cb) {
    if (cb.value === value) { cb.checked = true; found = true; }
  });
  if (found) return;
  var group = document.querySelector('.filter-group[data-filter-group="' + filter + '"]');
  if (!group) return;
  var label = document.createElement('label');
  var cb = document.createElement('input');
  cb.type = 'checkbox';
  cb.className = 'filter-input';
  cb.setAttribute('data-filter', filter);
  cb.value = value;
  cb.checked = true;
  cb.addEventListener('change', filterProperties);
  label.appendChild(cb);
  label.appendChild(document.createTextNode(' ' + value));
  group.appendChild(label);
}

function prefillFromUrl() {
  var params = new URLSearchParams(window.location.search);
  var suburb = params.get('suburb');
  var type = params.get('type');
  var minPrice = params.get('min_price');
  var maxPrice = params.get('max_price');

  if (type) ensureFilterChecked('type', type);
  if (suburb) ensureFilterChecked('suburb', suburb);
  if (minPrice) document.getElementById('filter-min-price').value = minPrice;
  if (maxPrice) document.getElementById('filter-max-price').value = maxPrice;
}

document.addEventListener('DOMContentLoaded', function() {
  // Wire instant filtering to every filter control.
  document.querySelectorAll('.filter-input').forEach(function(input) {
    input.addEventListener('change', filterProperties);
  });
  document.getElementById('filter-beds').addEventListener('change', filterProperties);
  document.getElementById('filter-min-price').addEventListener('input', filterProperties);
  document.getElementById('filter-max-price').addEventListener('input', filterProperties);

  var sort = document.getElementById('sort-by');
  if (sort) sort.addEventListener('change', filterProperties);

  // Clear Filters button — reset every filter and show all properties.
  document.getElementById('clear-filters').addEventListener('click', function() {
    document.querySelectorAll('.filter-input').forEach(function(cb) { cb.checked = false; });
    document.getElementById('filter-beds').value = '';
    document.getElementById('filter-min-price').value = '';
    document.getElementById('filter-max-price').value = '';
    filterProperties();
  });

  // Mobile: collapsible filter panel
  var toggle = document.getElementById('filter-toggle');
  var sidebar = document.querySelector('.filter-sidebar');
  if (toggle && sidebar) {
    toggle.addEventListener('click', function() {
      var open = sidebar.classList.toggle('filters-open');
      toggle.setAttribute('aria-expanded', String(open));
      toggle.textContent = open ? 'Hide filters' : 'Show filters';
    });
  }

function renderDynamicProperties() {
  if (!window.RE_DATA || !window.RE_DATA.properties) return;
  var grid = document.querySelector('.property-grid');
  if (!grid) return;

  var existingCards = grid.querySelectorAll('.property-card');
  var existingIds = [];
  existingCards.forEach(function(c) {
    var a = c.querySelector('a[href*="id="]');
    if (a) {
      var m = a.getAttribute('href').match(/id=([^&]+)/);
      if (m) existingIds.push(m[1]);
    }
  });

  var props = window.RE_DATA.properties;
  var mismatch = props.some(function(p) { return existingIds.indexOf(p.id) === -1; }) || existingCards.length !== props.length;

  if (mismatch && props.length > 0) {
    grid.innerHTML = props.map(function(p) {
      var img = p.imgUrl || 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600&q=80';
      var priceFmt = p.price ? '$' + p.price.toLocaleString('en-AU') : 'Contact Agent';
      return [
        '<div class="property-card" data-type="' + (p.type || 'Apartment') + '" data-suburb="' + (p.suburb || '') + '" data-beds="' + (p.beds || 0) + '" data-baths="' + (p.baths || 0) + '" data-price="' + (p.price || 0) + '">',
        '  <a href="property-detail.html?id=' + p.id + '" class="property-photo-wrap" aria-label="View ' + p.address + '">',
        '    <div class="property-photo">',
        '      <img src="' + img + '" alt="Property photo" loading="lazy" class="cover-img">',
        '      <span class="price-badge">' + priceFmt + '</span>',
        '      <span class="type-badge">' + (p.type || 'Property') + '</span>',
        '      <span class="photo-count">' + (p.photos || 5) + ' photos</span>',
        '    </div>',
        '  </a>',
        '  <div class="card-body">',
        '    <a href="property-detail.html?id=' + p.id + '" class="prop-address">' + p.address + '</a>',
        '    <p class="prop-suburb">' + p.suburb + '</p>',
        '    <div class="prop-stats">',
        '      <span class="stat"><span class="stat-icon" aria-hidden="true"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 4v16"/><path d="M2 8h20"/><path d="M2 16h20"/><path d="M22 4v16"/><path d="M6 8v4"/><path d="M18 8v4"/></svg></span> ' + (p.beds || 0) + '</span>',
        '      <span class="stat"><span class="stat-icon" aria-hidden="true"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12h16a1 1 0 0 1 1 1v3a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4v-3a1 1 0 0 1 1-1z"/><path d="M6 12V5a2 2 0 0 1 2-2h3v2.25"/><path d="M4 21l1-1.5"/><path d="M20 21l-1-1.5"/></svg></span> ' + (p.baths || 0) + '</span>',
        '      <span class="stat"><span class="stat-icon" aria-hidden="true"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="7" rx="1"/><circle cx="6.5" cy="18.5" r="1.5"/><circle cx="17.5" cy="18.5" r="1.5"/><path d="M5 13l1.5-5h11l1.5 5"/></svg></span> ' + (p.cars || 0) + '</span>',
        '    </div>',
        '    <div class="prop-features">',
        (p.features || []).slice(0, 3).map(function(f) { return '<span class="feature">' + f + '</span>'; }).join(''),
        '    </div>',
        '    <div class="prop-inspection">' + (p.inspection || 'By Appointment') + '</div>',
        '  </div>',
        '</div>'
      ].join('');
    }).join('');
  }
}

  // Pre-fill from the homepage search bar and apply the filters on load.
  renderDynamicProperties();
  prefillFromUrl();
  filterProperties();
});
