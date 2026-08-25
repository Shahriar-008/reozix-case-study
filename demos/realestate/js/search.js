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

  // Pre-fill from the homepage search bar and apply the filters on load.
  prefillFromUrl();
  filterProperties();
});
