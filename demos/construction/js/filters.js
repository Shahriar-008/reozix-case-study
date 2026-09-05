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

function renderDynamicProjects() {
  if (!window.CONSTRUCTION_DATA || !window.CONSTRUCTION_DATA.projects) return;
  var grid = document.querySelector('.ct-portfolio-grid');
  if (!grid) return;

  var existingCards = grid.querySelectorAll('.project-card');
  var existingIds = [];
  existingCards.forEach(function(c) {
    var a = c.querySelector('a[href*="id="]');
    if (a) {
      var m = a.getAttribute('href').match(/id=([^&]+)/);
      if (m) existingIds.push(m[1]);
    }
  });

  var projects = window.CONSTRUCTION_DATA.projects;
  var mismatch = projects.some(function(p) { return existingIds.indexOf(p.id) === -1; }) || existingCards.length !== projects.length;

  if (mismatch && projects.length > 0) {
    grid.innerHTML = projects.map(function(p) {
      var img = p.imgUrl || 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=60';
      var budgetFmt = p.budget ? '$' + p.budget.toLocaleString('en-AU') : '—';
      return [
        '<article class="project-card" data-type="' + (p.type || 'Commercial Fit-Out') + '">',
        '  <a href="project-detail.html?id=' + p.id + '" class="ct-project-photo" aria-label="View ' + p.title + '">',
        '    <img src="' + img + '" alt="' + p.title + '" loading="lazy">',
        '    <span class="project-badge">' + (p.type || 'Commercial') + '</span>',
        '  </a>',
        '  <div class="ct-project-body">',
        '    <h3 class="ct-project-title"><a href="project-detail.html?id=' + p.id + '">' + p.title + '</a></h3>',
        '    <p class="ct-project-location">' + (p.suburb || 'Brisbane') + '</p>',
        '    <p class="ct-project-desc">' + (p.description || '') + '</p>',
        '    <div class="ct-project-meta">',
        '      <div class="meta-item"><span class="meta-label">Budget</span><span class="meta-val">' + budgetFmt + '</span></div>',
        '      <div class="meta-item"><span class="meta-label">Duration</span><span class="meta-val">' + (p.duration || '—') + '</span></div>',
        '    </div>',
        '  </div>',
        '</article>'
      ].join('');
    }).join('');
  }
}

document.addEventListener('DOMContentLoaded', function() {
  renderDynamicProjects();
  initFilterTabs();
  updateActiveCount();
});
