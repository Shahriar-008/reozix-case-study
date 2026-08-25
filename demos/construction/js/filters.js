// filters.js — Construction portfolio filtering.
// Type-tab filtering for the portfolio page. The 18 project cards are
// hardcoded in portfolio.html with a data-type attribute; this script
// shows/hides them instantly when a filter tab is clicked and keeps the
// visible-project count (and no-results state) in sync.

function filterProjects(type) {
  document.querySelectorAll('.filter-tab').forEach(function(t) {
    var active = t.dataset.type === type;
    t.classList.toggle('active', active);
    // Announce the selected tab to assistive tech
    t.setAttribute('aria-pressed', String(active));
  });
  document.querySelectorAll('.project-card').forEach(function(card) {
    card.style.display = (type === 'all' || card.dataset.type === type) ? '' : 'none';
  });
}

// Show "Showing X of 18 projects" and reveal the no-results message when
// a filter matches no cards. Cards with no inline display set are visible
// via the stylesheet, so an empty string counts as shown.
function updateActiveCount() {
  var visible = 0;
  document.querySelectorAll('.project-card').forEach(function(card) {
    if (card.style.display !== 'none') visible++;
  });
  var count = document.getElementById('result-count');
  if (count) count.textContent = visible;
  var empty = document.getElementById('no-results');
  if (empty) empty.classList.toggle('show', visible === 0);
}

// Wire every filter tab to filterProjects() and refresh the count.
function initFilterTabs() {
  document.querySelectorAll('.filter-tab').forEach(function(tab) {
    tab.addEventListener('click', function() {
      filterProjects(tab.dataset.type);
      updateActiveCount();
    });
  });
}

document.addEventListener('DOMContentLoaded', function() {
  initFilterTabs();
  updateActiveCount();
});
