// =====================================================================
// Reozix Standalone Demos — Admin Dashboard Application Controller
// Handles vertical switching, live customization, inventory management,
// CRM leads tracking, and system backups.
// =====================================================================

(function(window, document) {
  'use strict';

  var AdminApp = {
    currentVertical: 'hotel',
    currentTab: 'overview',
    currentSubtab: 'rooms',
    editingItem: null,
    editingCollection: null,

    init: function() {
      // 1. Read URL param ?vertical=
      var params = new URLSearchParams(window.location.search);
      var vert = params.get('vertical');
      if (vert && ['hotel', 'realestate', 'construction'].indexOf(vert) !== -1) {
        this.currentVertical = vert;
      }

      // 2. Read admin theme
      var savedSettings = window.SiteStore ? window.SiteStore.getSettings() : { theme: 'dark' };
      if (savedSettings.theme === 'light') {
        document.documentElement.setAttribute('data-theme', 'light');
      }

      // 3. Bind UI Events
      this.bindEvents();

      // 4. Set Initial Vertical & Tab
      this.switchVertical(this.currentVertical);
      this.switchTab('overview');

      // 5. Listen to cross-tab store changes
      var self = this;
      window.addEventListener('reozix:data-change', function() {
        self.renderCurrentView();
      });
    },

    bindEvents: function() {
      var self = this;

      // Vertical Switcher
      document.querySelectorAll('.vert-btn').forEach(function(btn) {
        btn.addEventListener('click', function() {
          self.switchVertical(btn.getAttribute('data-vertical'));
        });
      });

      // Tab Navigation
      document.querySelectorAll('.nav-tab-btn[data-tab]').forEach(function(btn) {
        btn.addEventListener('click', function() {
          self.switchTab(btn.getAttribute('data-tab'));
        });
      });

      // Mobile Sidebar Toggle
      var toggleBtn = document.getElementById('sidebar-toggle-btn');
      var sidebar = document.getElementById('admin-sidebar');
      if (toggleBtn && sidebar) {
        toggleBtn.addEventListener('click', function() {
          sidebar.classList.toggle('is-open');
        });
      }

      // Theme Toggle
      var themeBtn = document.getElementById('theme-toggle-btn');
      if (themeBtn) {
        themeBtn.addEventListener('click', function() {
          var isDark = document.documentElement.getAttribute('data-theme') !== 'light';
          var newTheme = isDark ? 'light' : 'dark';
          document.documentElement.setAttribute('data-theme', newTheme);
          if (window.SiteStore) window.SiteStore.saveSettings({ theme: newTheme });
          self.toast('Theme set to ' + newTheme + ' mode', 'info');
        });
      }

      // Website Details Form Submit
      var detailsForm = document.getElementById('site-details-form');
      var saveDetailsBtn = document.getElementById('save-site-details-btn');
      if (saveDetailsBtn) {
        saveDetailsBtn.addEventListener('click', function(e) {
          e.preventDefault();
          self.saveWebsiteDetails();
        });
      }
      if (detailsForm) {
        detailsForm.addEventListener('submit', function(e) {
          e.preventDefault();
          self.saveWebsiteDetails();
        });
      }

      // Color picker sync
      var colorInput = document.getElementById('detail-accent-color');
      var hexInput = document.getElementById('detail-accent-hex');
      if (colorInput && hexInput) {
        colorInput.addEventListener('input', function() {
          hexInput.value = colorInput.value;
          self.applyAccentPreview(colorInput.value);
        });
        hexInput.addEventListener('input', function() {
          if (/^#[0-9A-Fa-f]{6}$/.test(hexInput.value)) {
            colorInput.value = hexInput.value;
            self.applyAccentPreview(hexInput.value);
          }
        });
      }

      // Preset color chips
      document.querySelectorAll('.preset-chip').forEach(function(chip) {
        chip.addEventListener('click', function() {
          var c = chip.getAttribute('data-color');
          if (colorInput) colorInput.value = c;
          if (hexInput) hexInput.value = c;
          self.applyAccentPreview(c);
        });
      });

      // Item Modal Form Submit
      var itemForm = document.getElementById('item-modal-form');
      if (itemForm) {
        itemForm.addEventListener('submit', function(e) {
          e.preventDefault();
          self.saveModalItem();
        });
      }

      // Add Item Button in Inventory
      var addItemBtn = document.getElementById('add-item-btn');
      if (addItemBtn) {
        addItemBtn.addEventListener('click', function() {
          self.openItemModal(self.currentSubtab, null);
        });
      }

      // Add Review Button
      var addReviewBtn = document.getElementById('add-review-btn');
      if (addReviewBtn) {
        addReviewBtn.addEventListener('click', function() {
          self.openItemModal('reviews', null);
        });
      }

      // Add FAQ Button
      var addFaqBtn = document.getElementById('add-faq-btn');
      if (addFaqBtn) {
        addFaqBtn.addEventListener('click', function() {
          self.openItemModal('faq', null);
        });
      }

      // Leads Filters
      var leadsSearch = document.getElementById('leads-search-input');
      var leadsStatus = document.getElementById('leads-filter-status');
      var leadsVert = document.getElementById('leads-filter-vertical');
      [leadsSearch, leadsStatus, leadsVert].forEach(function(el) {
        if (el) {
          el.addEventListener('input', function() { self.renderLeadsTable(); });
          el.addEventListener('change', function() { self.renderLeadsTable(); });
        }
      });

      // Export Leads CSV
      var exportCsvBtn = document.getElementById('export-leads-csv-btn');
      if (exportCsvBtn) {
        exportCsvBtn.addEventListener('click', function() { self.exportLeadsCsv(); });
      }

      // Populate Sample Lead
      var sampleLeadBtn = document.getElementById('populate-sample-leads-btn');
      if (sampleLeadBtn) {
        sampleLeadBtn.addEventListener('click', function() { self.addSampleLead(); });
      }

      // Backup Export JSON
      var exportJsonBtn = document.getElementById('export-json-backup-btn');
      if (exportJsonBtn) {
        exportJsonBtn.addEventListener('click', function() { self.exportJsonBackup(); });
      }

      // Backup Import JSON
      var importFileInput = document.getElementById('import-json-file');
      if (importFileInput) {
        importFileInput.addEventListener('change', function(e) { self.importJsonBackup(e); });
      }

      // Reset Buttons
      var resetVertBtn = document.getElementById('reset-current-vertical-btn');
      if (resetVertBtn) {
        resetVertBtn.addEventListener('click', function() { self.confirmReset(self.currentVertical); });
      }
      var resetAllBtn = document.getElementById('reset-all-verticals-btn');
      if (resetAllBtn) {
        resetAllBtn.addEventListener('click', function() { self.confirmReset('all'); });
      }
    },

    // Switch active vertical
    switchVertical: function(vert) {
      this.currentVertical = vert;

      // Update vertical switcher buttons
      document.querySelectorAll('.vert-btn').forEach(function(btn) {
        btn.classList.toggle('is-active', btn.getAttribute('data-vertical') === vert);
      });

      // Update live site link
      var liveLink = document.getElementById('live-site-link');
      if (liveLink) {
        liveLink.href = '../' + vert + '/index.html';
      }

      // Update brand accent styling
      var data = window.SiteStore ? window.SiteStore.get(vert) : null;
      var accent = (data && data.details && data.details.accentColor) ? data.details.accentColor :
        (vert === 'hotel' ? '#d4a853' : vert === 'realestate' ? '#4a90d9' : '#e8752a');
      this.applyAccentPreview(accent);

      // Update sidebar branding badge and labels
      var avatar = document.getElementById('sidebar-user-avatar');
      var name = document.getElementById('sidebar-user-name');
      var invLabel = document.getElementById('nav-inventory-label');
      var licenceGroup = document.getElementById('group-licence');

      if (vert === 'hotel') {
        if (avatar) avatar.textContent = 'RH';
        if (name) name.textContent = data ? data.details.name : 'Reozix Hotel';
        if (invLabel) invLabel.textContent = 'Rooms & Catalog';
        if (licenceGroup) licenceGroup.style.display = 'none';
        this.currentSubtab = 'rooms';
      } else if (vert === 'realestate') {
        if (avatar) avatar.textContent = 'RE';
        if (name) name.textContent = data ? data.details.name : 'Reozix Real Estate';
        if (invLabel) invLabel.textContent = 'Properties & Agents';
        if (licenceGroup) licenceGroup.style.display = 'none';
        this.currentSubtab = 'properties';
      } else if (vert === 'construction') {
        if (avatar) avatar.textContent = 'RC';
        if (name) name.textContent = data ? data.details.name : 'Reozix Construction';
        if (invLabel) invLabel.textContent = 'Projects & Services';
        if (licenceGroup) licenceGroup.style.display = '';
        this.currentSubtab = 'projects';
      }

      // Re-render current view
      this.renderCurrentView();
    },

    // Switch main nav tab
    switchTab: function(tabId) {
      this.currentTab = tabId;

      document.querySelectorAll('.nav-tab-btn[data-tab]').forEach(function(btn) {
        btn.classList.toggle('is-active', btn.getAttribute('data-tab') === tabId);
      });

      document.querySelectorAll('.tab-pane').forEach(function(pane) {
        pane.classList.toggle('is-active', pane.id === 'pane-' + tabId);
      });

      // Close mobile sidebar if open
      var sidebar = document.getElementById('admin-sidebar');
      if (sidebar) sidebar.classList.remove('is-open');

      this.renderCurrentView();
    },

    // Render whatever view is currently active
    renderCurrentView: function() {
      this.updateUnreadCounter();

      if (this.currentTab === 'overview') {
        this.renderOverview();
      } else if (this.currentTab === 'website-details') {
        this.renderWebsiteDetails();
      } else if (this.currentTab === 'inventory') {
        this.renderInventory();
      } else if (this.currentTab === 'testimonials') {
        this.renderTestimonials();
      } else if (this.currentTab === 'leads') {
        this.renderLeadsTable();
      }
    },

    applyAccentPreview: function(color) {
      document.documentElement.style.setProperty('--accent', color);
      document.documentElement.style.setProperty('--accent-glow', color + '40');
    },

    updateUnreadCounter: function() {
      if (!window.SiteStore) return;
      var unread = window.SiteStore.getLeads(this.currentVertical).filter(function(l) { return l.status === 'new'; }).length;
      var counter = document.getElementById('sidebar-leads-count');
      if (counter) {
        if (unread > 0) {
          counter.style.display = 'inline-block';
          counter.textContent = unread;
        } else {
          counter.style.display = 'none';
        }
      }
    },

    // -----------------------------------------------------------------
    // TAB 1: OVERVIEW
    // -----------------------------------------------------------------
    renderOverview: function() {
      if (!window.SiteStore) return;
      var data = window.SiteStore.get(this.currentVertical);
      if (!data) return;
      var d = data.details;

      document.getElementById('overview-welcome').textContent = d.name + ' Overview';

      // KPI metrics calculation
      var leads = window.SiteStore.getLeads(this.currentVertical);
      var newLeadsCount = leads.filter(function(l) { return l.status === 'new'; }).length;

      document.getElementById('kpi-leads-val').textContent = leads.length;
      document.getElementById('kpi-new-leads-sub').textContent = newLeadsCount + ' New';
      document.getElementById('kpi-score-val').textContent = d.heroScore || '4.95';

      if (this.currentVertical === 'hotel') {
        document.getElementById('kpi-inv-label').textContent = 'Active Rooms';
        document.getElementById('kpi-inv-val').textContent = (data.rooms || []).length;
        document.getElementById('kpi-vol-label').textContent = 'Booking Value';
        var totalAmount = leads.reduce(function(sum, l) { return sum + (l.amount || 0); }, 0);
        document.getElementById('kpi-vol-val').textContent = '$' + totalAmount.toLocaleString('en-AU');
      } else if (this.currentVertical === 'realestate') {
        document.getElementById('kpi-inv-label').textContent = 'Properties Listed';
        document.getElementById('kpi-inv-val').textContent = (data.properties || []).length;
        document.getElementById('kpi-vol-label').textContent = 'Appraisal Leads';
        document.getElementById('kpi-vol-val').textContent = leads.length;
      } else if (this.currentVertical === 'construction') {
        document.getElementById('kpi-inv-label').textContent = 'Delivered Projects';
        document.getElementById('kpi-inv-val').textContent = (data.projects || []).length;
        document.getElementById('kpi-vol-label').textContent = 'Quote Pipeline';
        var quoteSum = leads.reduce(function(sum, l) { return sum + (l.amount || 0); }, 0);
        document.getElementById('kpi-vol-val').textContent = '$' + (quoteSum > 0 ? (quoteSum / 1000).toFixed(0) + 'k' : 'Active');
      }

      // Recent inquiries table
      var tbody = document.getElementById('overview-recent-tbody');
      if (tbody) {
        if (leads.length === 0) {
          tbody.innerHTML = '<tr><td colspan="6" style="text-align:center; padding:32px; color:var(--text-faint);">No customer inquiries recorded yet.</td></tr>';
          return;
        }
        var recent = leads.slice(0, 5);
        tbody.innerHTML = recent.map(function(l) {
          var dateStr = new Date(l.date).toLocaleDateString('en-AU', { month: 'short', day: 'numeric' });
          return [
            '<tr>',
            '  <td><span class="status-badge status-' + (l.status || 'new') + '">' + (l.type || 'lead') + '</span></td>',
            '  <td><strong>' + (l.name || 'Anonymous') + '</strong><br><small style="color:var(--text-muted);">' + (l.email || l.phone || '—') + '</small></td>',
            '  <td>' + (l.title || 'General Inquiry') + '</td>',
            '  <td>' + dateStr + '</td>',
            '  <td><span class="status-badge status-' + (l.status || 'new') + '">' + (l.status || 'new') + '</span></td>',
            '  <td><button class="btn-secondary" style="padding:4px 10px; font-size:0.75rem;" onclick="AdminApp.viewLead(\'' + l.id + '\')">Inspect</button></td>',
            '</tr>'
          ].join('');
        }).join('');
      }
    },

    // -----------------------------------------------------------------
    // TAB 2: WEBSITE DETAILS
    // -----------------------------------------------------------------
    renderWebsiteDetails: function() {
      if (!window.SiteStore) return;
      var data = window.SiteStore.get(this.currentVertical);
      if (!data || !data.details) return;
      var d = data.details;

      document.getElementById('detail-name').value = d.name || '';
      document.getElementById('detail-tagline').value = d.tagline || '';
      document.getElementById('detail-phone').value = d.phone || '';
      document.getElementById('detail-email').value = d.email || '';
      document.getElementById('detail-location').value = d.location || '';
      document.getElementById('detail-address').value = d.address || '';
      document.getElementById('detail-hours').value = d.hours || '';
      if (document.getElementById('detail-licence')) {
        document.getElementById('detail-licence').value = d.licence || '';
      }

      var accent = d.accentColor || '#d4a853';
      document.getElementById('detail-accent-color').value = accent;
      document.getElementById('detail-accent-hex').value = accent;

      document.getElementById('detail-hero-kicker').value = d.heroKicker || '';
      document.getElementById('detail-hero-title').value = d.heroTitle || '';
      document.getElementById('detail-hero-subtitle').value = d.heroSubtitle || '';
      document.getElementById('detail-hero-score').value = d.heroScore || '';

      var ann = d.announcement || {};
      document.getElementById('detail-announce-enabled').checked = !!ann.enabled;
      document.getElementById('detail-announce-badge').value = ann.badge || 'Special Offer';
      document.getElementById('detail-announce-text').value = ann.text || '';
      document.getElementById('detail-announce-link').value = ann.link || '';
    },

    saveWebsiteDetails: function() {
      if (!window.SiteStore) return;

      var updates = {
        name: document.getElementById('detail-name').value.trim(),
        tagline: document.getElementById('detail-tagline').value.trim(),
        phone: document.getElementById('detail-phone').value.trim(),
        email: document.getElementById('detail-email').value.trim(),
        location: document.getElementById('detail-location').value.trim(),
        address: document.getElementById('detail-address').value.trim(),
        hours: document.getElementById('detail-hours').value.trim(),
        accentColor: document.getElementById('detail-accent-color').value,
        heroKicker: document.getElementById('detail-hero-kicker').value.trim(),
        heroTitle: document.getElementById('detail-hero-title').value.trim(),
        heroSubtitle: document.getElementById('detail-hero-subtitle').value.trim(),
        heroScore: document.getElementById('detail-hero-score').value.trim(),
        announcement: {
          enabled: document.getElementById('detail-announce-enabled').checked,
          badge: document.getElementById('detail-announce-badge').value.trim(),
          text: document.getElementById('detail-announce-text').value.trim(),
          link: document.getElementById('detail-announce-link').value.trim()
        }
      };

      if (document.getElementById('detail-licence')) {
        updates.licence = document.getElementById('detail-licence').value.trim();
      }

      window.SiteStore.updateDetails(this.currentVertical, updates);
      this.toast('Website details saved and synchronized live!', 'success');
      this.renderCurrentView();
    },

    // -----------------------------------------------------------------
    // TAB 3: INVENTORY & CATALOG
    // -----------------------------------------------------------------
    renderInventory: function() {
      if (!window.SiteStore) return;
      var data = window.SiteStore.get(this.currentVertical);
      if (!data) return;

      var subtabsBar = document.getElementById('inventory-subtabs');
      var titleEl = document.getElementById('inventory-pane-title');
      var self = this;

      // Define subtabs based on vertical
      var subtabs = [];
      if (this.currentVertical === 'hotel') {
        titleEl.textContent = 'Rooms, Rate Plans & Extras';
        subtabs = [
          { id: 'rooms', label: '🛏️ Rooms & Suites' },
          { id: 'ratePlans', label: '🏷️ Rate Plans' },
          { id: 'extras', label: '✨ Stay Extras' }
        ];
      } else if (this.currentVertical === 'realestate') {
        titleEl.textContent = 'Properties & Agent Roster';
        subtabs = [
          { id: 'properties', label: '🏡 Property Listings' },
          { id: 'agents', label: '👔 Real Estate Agents' }
        ];
      } else if (this.currentVertical === 'construction') {
        titleEl.textContent = 'Projects, Services & Team';
        subtabs = [
          { id: 'projects', label: '🏗️ Delivered Projects' },
          { id: 'services', label: '🛠️ Builder Services' },
          { id: 'team', label: '👷 Management Team' }
        ];
      }

      // Render Subtab Buttons
      subtabsBar.innerHTML = subtabs.map(function(st) {
        var active = st.id === self.currentSubtab ? ' is-active' : '';
        return '<button class="subtab-btn' + active + '" data-subtab="' + st.id + '">' + st.label + '</button>';
      }).join('');

      subtabsBar.querySelectorAll('.subtab-btn').forEach(function(btn) {
        btn.addEventListener('click', function() {
          self.currentSubtab = btn.getAttribute('data-subtab');
          self.renderInventory();
        });
      });

      // Render Table Columns and Rows
      var thead = document.getElementById('inventory-table-head');
      var tbody = document.getElementById('inventory-table-body');
      var items = data[this.currentSubtab] || [];

      if (this.currentSubtab === 'rooms') {
        thead.innerHTML = '<tr><th>Room Name</th><th>Nightly Rate</th><th>Max Guests</th><th>View</th><th>Amenities</th><th>Actions</th></tr>';
        tbody.innerHTML = items.map(function(r) {
          var img = r.imgId ? 'https://images.unsplash.com/photo-' + r.imgId + '?w=120&q=80' : (r.imgUrl || '');
          return [
            '<tr>',
            '  <td><div class="cell-flex"><img src="' + img + '" class="table-thumb" alt=""><div><strong>' + r.name + '</strong><br><small style="color:var(--text-muted);">' + (r.description || '').substring(0, 45) + '...</small></div></div></td>',
            '  <td><strong>$' + r.rate + ' AUD</strong></td>',
            '  <td>' + r.maxGuests + ' Guests</td>',
            '  <td>' + (r.view || 'Standard') + '</td>',
            '  <td><small>' + (r.amenities ? r.amenities.slice(0, 3).join(', ') + '...' : '—') + '</small></td>',
            '  <td>',
            '    <button class="btn-secondary" style="padding:4px 8px;" onclick="AdminApp.openItemModal(\'rooms\', \'' + r.id + '\')">Edit</button> ',
            '    <button class="btn-danger" style="padding:4px 8px;" onclick="AdminApp.deleteItem(\'rooms\', \'' + r.id + '\')">Delete</button>',
            '  </td>',
            '</tr>'
          ].join('');
        }).join('');
      } else if (this.currentSubtab === 'properties') {
        thead.innerHTML = '<tr><th>Property</th><th>Type</th><th>Price</th><th>Beds/Baths</th><th>Inspection</th><th>Actions</th></tr>';
        tbody.innerHTML = items.map(function(p) {
          var img = p.imgUrl || 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=120&q=80';
          return [
            '<tr>',
            '  <td><div class="cell-flex"><img src="' + img + '" class="table-thumb" alt=""><div><strong>' + p.address + '</strong><br><small style="color:var(--text-muted);">' + p.suburb + '</small></div></div></td>',
            '  <td><span class="status-badge status-in-progress">' + p.type + '</span></td>',
            '  <td><strong>$' + (p.price ? p.price.toLocaleString('en-AU') : 'Contact') + '</strong></td>',
            '  <td>' + (p.beds || 0) + ' beds · ' + (p.baths || 0) + ' baths</td>',
            '  <td><small>' + (p.inspection || 'By Appointment') + '</small></td>',
            '  <td>',
            '    <button class="btn-secondary" style="padding:4px 8px;" onclick="AdminApp.openItemModal(\'properties\', \'' + p.id + '\')">Edit</button> ',
            '    <button class="btn-danger" style="padding:4px 8px;" onclick="AdminApp.deleteItem(\'properties\', \'' + p.id + '\')">Delete</button>',
            '  </td>',
            '</tr>'
          ].join('');
        }).join('');
      } else if (this.currentSubtab === 'projects') {
        thead.innerHTML = '<tr><th>Project Title</th><th>Type</th><th>Budget</th><th>Duration</th><th>Completed</th><th>Actions</th></tr>';
        tbody.innerHTML = items.map(function(pj) {
          var img = pj.imgUrl || 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=120&q=80';
          return [
            '<tr>',
            '  <td><div class="cell-flex"><img src="' + img + '" class="table-thumb" alt=""><div><strong>' + pj.title + '</strong><br><small style="color:var(--text-muted);">' + pj.suburb + '</small></div></div></td>',
            '  <td><span class="status-badge status-in-progress">' + pj.type + '</span></td>',
            '  <td><strong>$' + (pj.budget ? pj.budget.toLocaleString('en-AU') : '—') + '</strong></td>',
            '  <td>' + (pj.duration || '—') + '</td>',
            '  <td>' + (pj.completed || '—') + '</td>',
            '  <td>',
            '    <button class="btn-secondary" style="padding:4px 8px;" onclick="AdminApp.openItemModal(\'projects\', \'' + pj.id + '\')">Edit</button> ',
            '    <button class="btn-danger" style="padding:4px 8px;" onclick="AdminApp.deleteItem(\'projects\', \'' + pj.id + '\')">Delete</button>',
            '  </td>',
            '</tr>'
          ].join('');
        }).join('');
      } else if (this.currentSubtab === 'agents') {
        thead.innerHTML = '<tr><th>Agent</th><th>Role</th><th>Phone</th><th>Email</th><th>Actions</th></tr>';
        tbody.innerHTML = items.map(function(ag) {
          var img = ag.imgUrl || 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=120&q=80';
          return [
            '<tr>',
            '  <td><div class="cell-flex"><img src="' + img + '" class="table-thumb" alt="" style="border-radius:50%;"><div><strong>' + ag.name + '</strong></div></div></td>',
            '  <td>' + ag.role + '</td>',
            '  <td>' + ag.phone + '</td>',
            '  <td>' + ag.email + '</td>',
            '  <td>',
            '    <button class="btn-secondary" style="padding:4px 8px;" onclick="AdminApp.openItemModal(\'agents\', \'' + ag.id + '\')">Edit</button> ',
            '    <button class="btn-danger" style="padding:4px 8px;" onclick="AdminApp.deleteItem(\'agents\', \'' + ag.id + '\')">Delete</button>',
            '  </td>',
            '</tr>'
          ].join('');
        }).join('');
      } else {
        // Fallback for services, team, ratePlans, extras
        thead.innerHTML = '<tr><th>Title / Name</th><th>Summary / Rate</th><th>Actions</th></tr>';
        tbody.innerHTML = items.map(function(it) {
          return [
            '<tr>',
            '  <td><strong>' + (it.name || it.title) + '</strong></td>',
            '  <td>' + (it.summary || it.desc || it.role || (it.price ? '$' + it.price : '—')) + '</td>',
            '  <td>',
            '    <button class="btn-secondary" style="padding:4px 8px;" onclick="AdminApp.openItemModal(\'' + self.currentSubtab + '\', \'' + (it.id || it.name) + '\')">Edit</button> ',
            '    <button class="btn-danger" style="padding:4px 8px;" onclick="AdminApp.deleteItem(\'' + self.currentSubtab + '\', \'' + (it.id || it.name) + '\')">Delete</button>',
            '  </td>',
            '</tr>'
          ].join('');
        }).join('');
      }

      if (items.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" style="text-align:center; padding:32px; color:var(--text-faint);">No items in this collection yet. Click "+ Add New Item" above.</td></tr>';
      }
    },

    // -----------------------------------------------------------------
    // TAB 4: TESTIMONIALS & FAQS
    // -----------------------------------------------------------------
    renderTestimonials: function() {
      if (!window.SiteStore) return;
      var data = window.SiteStore.get(this.currentVertical);
      if (!data) return;

      var reviewsTbody = document.getElementById('reviews-table-body');
      var reviews = data.reviews || [];
      if (reviews.length === 0) {
        reviewsTbody.innerHTML = '<tr><td colspan="5" style="text-align:center; padding:24px; color:var(--text-faint);">No reviews yet.</td></tr>';
      } else {
        reviewsTbody.innerHTML = reviews.map(function(rv, i) {
          var id = rv.id || ('rev-' + i);
          return [
            '<tr>',
            '  <td><strong>' + (rv.author || 'Anonymous') + '</strong></td>',
            '  <td><span class="status-badge status-in-progress">★ ' + (rv.score || '5.0') + '</span> ' + (rv.stay || rv.suburb || '') + '</td>',
            '  <td><small style="color:var(--text-muted);">' + (rv.text || '') + '</small></td>',
            '  <td>' + (rv.date || 'Recent') + '</td>',
            '  <td>',
            '    <button class="btn-danger" style="padding:4px 8px;" onclick="AdminApp.deleteItem(\'reviews\', \'' + id + '\')">Delete</button>',
            '  </td>',
            '</tr>'
          ].join('');
        }).join('');
      }

      var faqTbody = document.getElementById('faq-table-body');
      var faqs = data.faq || [];
      if (faqs.length === 0) {
        faqTbody.innerHTML = '<tr><td colspan="3" style="text-align:center; padding:24px; color:var(--text-faint);">No FAQs yet.</td></tr>';
      } else {
        faqTbody.innerHTML = faqs.map(function(f, i) {
          var id = f.id || ('faq-' + i);
          return [
            '<tr>',
            '  <td><strong>' + f.q + '</strong></td>',
            '  <td><small style="color:var(--text-muted);">' + f.a + '</small></td>',
            '  <td>',
            '    <button class="btn-danger" style="padding:4px 8px;" onclick="AdminApp.deleteItem(\'faq\', \'' + id + '\')">Delete</button>',
            '  </td>',
            '</tr>'
          ].join('');
        }).join('');
      }
    },

    // -----------------------------------------------------------------
    // TAB 5: LEADS & INQUIRIES (CRM)
    // -----------------------------------------------------------------
    renderLeadsTable: function() {
      if (!window.SiteStore) return;
      var allLeads = window.SiteStore.getLeads();

      var searchVal = (document.getElementById('leads-search-input') ? document.getElementById('leads-search-input').value.toLowerCase().trim() : '');
      var statusVal = (document.getElementById('leads-filter-status') ? document.getElementById('leads-filter-status').value : 'all');
      var vertVal = (document.getElementById('leads-filter-vertical') ? document.getElementById('leads-filter-vertical').value : 'all');

      var filtered = allLeads.filter(function(l) {
        if (statusVal !== 'all' && l.status !== statusVal) return false;
        if (vertVal !== 'all' && l.vertical !== vertVal) return false;
        if (searchVal) {
          var haystack = (l.name + ' ' + l.email + ' ' + l.phone + ' ' + l.title + ' ' + (l.details ? JSON.stringify(l.details) : '')).toLowerCase();
          if (haystack.indexOf(searchVal) === -1) return false;
        }
        return true;
      });

      var tbody = document.getElementById('leads-table-body');
      if (!tbody) return;

      if (filtered.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" style="text-align:center; padding:40px; color:var(--text-faint);">No inquiries matching the selected filters.</td></tr>';
        return;
      }

      var self = this;
      tbody.innerHTML = filtered.map(function(l) {
        var dateStr = new Date(l.date).toLocaleDateString('en-AU', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
        var amountStr = l.amount ? '$' + l.amount.toLocaleString('en-AU') : '—';
        return [
          '<tr>',
          '  <td><span class="status-badge status-' + l.status + '">' + (l.vertical || '') + ' · ' + (l.type || 'inquiry') + '</span></td>',
          '  <td><strong>' + (l.name || 'Anonymous') + '</strong><br><small style="color:var(--text-muted);">' + (l.email || '') + ' · ' + (l.phone || '') + '</small></td>',
          '  <td>' + (l.title || 'Inquiry') + '</td>',
          '  <td>' + amountStr + '</td>',
          '  <td><small>' + dateStr + '</small></td>',
          '  <td>',
          '    <select class="form-control" style="padding:4px 8px; font-size:0.75rem; width:120px;" onchange="AdminApp.updateLeadStatus(\'' + l.id + '\', this.value)">',
          '      <option value="new"' + (l.status === 'new' ? ' selected' : '') + '>New</option>',
          '      <option value="contacted"' + (l.status === 'contacted' ? ' selected' : '') + '>Contacted</option>',
          '      <option value="in-progress"' + (l.status === 'in-progress' ? ' selected' : '') + '>In Progress</option>',
          '      <option value="closed"' + (l.status === 'closed' ? ' selected' : '') + '>Closed</option>',
          '    </select>',
          '  </td>',
          '  <td><button class="btn-secondary" style="padding:4px 10px; font-size:0.75rem;" onclick="AdminApp.viewLead(\'' + l.id + '\')">Inspect</button></td>',
          '</tr>'
        ].join('');
      }).join('');
    },

    updateLeadStatus: function(leadId, newStatus) {
      if (!window.SiteStore) return;
      window.SiteStore.updateLead(leadId, { status: newStatus });
      this.toast('Lead status updated to ' + newStatus, 'info');
      this.renderLeadsTable();
      this.updateUnreadCounter();
    },

    viewLead: function(leadId) {
      if (!window.SiteStore) return;
      var leads = window.SiteStore.getLeads();
      var lead = leads.find(function(l) { return l.id === leadId; });
      if (!lead) return;

      var modal = document.getElementById('lead-modal');
      var body = document.getElementById('lead-modal-body');
      var title = document.getElementById('lead-modal-title');
      var delBtn = document.getElementById('lead-modal-delete-btn');

      title.textContent = (lead.title || 'Inquiry Details') + ' (' + (lead.vertical || '').toUpperCase() + ')';

      var detailsHtml = '';
      if (lead.details && typeof lead.details === 'object') {
        detailsHtml = Object.keys(lead.details).map(function(k) {
          var val = lead.details[k];
          if (Array.isArray(val)) val = val.join(', ');
          return '<p><strong>' + k + ':</strong> ' + val + '</p>';
        }).join('');
      }

      body.innerHTML = [
        '<div style="margin-bottom:16px; display:flex; justify-content:space-between; align-items:center;">',
        '  <span class="status-badge status-' + lead.status + '">' + lead.status.toUpperCase() + '</span>',
        '  <span style="font-size:0.8rem; color:var(--text-faint);">' + new Date(lead.date).toLocaleString('en-AU') + '</span>',
        '</div>',
        '<div class="panel-box" style="margin-bottom:16px;">',
        '  <h4>Customer Contact</h4>',
        '  <p><strong>Name:</strong> ' + (lead.name || '—') + '</p>',
        '  <p><strong>Email:</strong> <a href="mailto:' + lead.email + '" style="color:var(--accent);">' + (lead.email || '—') + '</a></p>',
        '  <p><strong>Phone:</strong> <a href="tel:' + lead.phone + '" style="color:var(--accent);">' + (lead.phone || '—') + '</a></p>',
        '</div>',
        '<div class="panel-box">',
        '  <h4>Submission Payload</h4>',
        detailsHtml || '<p style="color:var(--text-muted);">' + (lead.notes || 'No extra payload provided.') + '</p>',
        '</div>'
      ].join('');

      var self = this;
      delBtn.onclick = function() {
        if (confirm('Delete this inquiry record?')) {
          window.SiteStore.deleteLead(lead.id);
          self.closeModal('lead-modal');
          self.toast('Lead deleted', 'info');
          self.renderLeadsTable();
        }
      };

      modal.classList.add('is-open');
    },

    exportLeadsCsv: function() {
      if (!window.SiteStore) return;
      var leads = window.SiteStore.getLeads();
      if (leads.length === 0) {
        this.toast('No leads available to export.', 'info');
        return;
      }

      var csvRows = [
        ['ID', 'Date', 'Vertical', 'Type', 'Customer Name', 'Email', 'Phone', 'Title', 'Amount', 'Status']
      ];

      leads.forEach(function(l) {
        csvRows.push([
          l.id,
          l.date,
          l.vertical,
          l.type,
          '"' + (l.name || '').replace(/"/g, '""') + '"',
          l.email || '',
          l.phone || '',
          '"' + (l.title || '').replace(/"/g, '""') + '"',
          l.amount || '',
          l.status || ''
        ]);
      });

      var csvContent = 'data:text/csv;charset=utf-8,' + csvRows.map(function(e) { return e.join(','); }).join('\n');
      var encodedUri = encodeURI(csvContent);
      var link = document.createElement('a');
      link.setAttribute('href', encodedUri);
      link.setAttribute('download', 'reozix-leads-' + new Date().toISOString().slice(0, 10) + '.csv');
      document.body.appendChild(link);
      link.click();
      link.remove();
      this.toast('CSV exported successfully', 'success');
    },

    addSampleLead: function() {
      if (!window.SiteStore) return;
      var samples = [
        {
          vertical: 'hotel',
          type: 'booking',
          title: 'Ocean King Suite · 2 Nights',
          name: 'Samantha Hayes',
          email: 's.hayes@sydney.edu.au',
          phone: '+61 419 883 412',
          amount: 640,
          details: { room: 'Ocean King', checkin: '2026-10-02', checkout: '2026-10-04', guests: 2, plan: 'Saver', payment: 'Paid online now' }
        },
        {
          vertical: 'realestate',
          type: 'appraisal',
          title: 'Appraisal: Penthouse at Broadbeach',
          name: 'Julian Montgomery',
          email: 'j.montgomery@venture.com',
          phone: '+61 408 221 905',
          amount: null,
          details: { address: 'Level 28, 44 Surf Parade, Broadbeach', beds: 3, timeline: 'Immediate' }
        },
        {
          vertical: 'construction',
          type: 'quote',
          title: 'Quote: Heritage Queenslander Extension',
          name: 'Christopher Reed',
          email: 'chris.reed@reedgroup.com.au',
          phone: '+61 412 776 532',
          amount: 320000,
          details: { projectType: 'Residential Extension', address: 'Ascot, Brisbane', budgetRange: '$300k–$400k', sqm: 220 }
        }
      ];

      var randomSample = samples[Math.floor(Math.random() * samples.length)];
      window.SiteStore.addLead(randomSample);
      this.toast('Sample inquiry added to CRM!', 'success');
      this.renderLeadsTable();
      this.updateUnreadCounter();
    },

    // -----------------------------------------------------------------
    // MODAL EDIT / ADD LOGIC
    // -----------------------------------------------------------------
    openItemModal: function(collection, itemId) {
      if (!window.SiteStore) return;
      var data = window.SiteStore.get(this.currentVertical);
      var items = data[collection] || [];
      var item = itemId ? items.find(function(x) { return (x.id || x.name || x.q) === itemId; }) : null;

      this.editingCollection = collection;
      this.editingItem = item;

      var modal = document.getElementById('item-modal');
      var title = document.getElementById('item-modal-title');
      var body = document.getElementById('item-modal-body');

      title.textContent = (item ? 'Edit ' : 'Add New ') + this.formatCollectionTitle(collection);

      body.innerHTML = this.generateItemFormFields(collection, item);
      modal.classList.add('is-open');
    },

    formatCollectionTitle: function(col) {
      if (col === 'rooms') return 'Room Suite';
      if (col === 'properties') return 'Property Listing';
      if (col === 'projects') return 'Project';
      if (col === 'agents') return 'Agent';
      if (col === 'reviews') return 'Review';
      if (col === 'faq') return 'FAQ Item';
      return 'Item';
    },

    generateItemFormFields: function(col, item) {
      item = item || {};
      if (col === 'rooms') {
        return [
          '<div class="form-group"><label>Room Suite Name</label><input type="text" id="m-room-name" class="form-control" value="' + (item.name || '') + '" required></div>',
          '<div class="form-grid-2">',
          '  <div class="form-group"><label>Nightly Rate (AUD $)</label><input type="number" id="m-room-rate" class="form-control" value="' + (item.rate || 300) + '" required></div>',
          '  <div class="form-group"><label>Max Guests</label><input type="number" id="m-room-guests" class="form-control" value="' + (item.maxGuests || 2) + '" required></div>',
          '</div>',
          '<div class="form-group"><label>View Type (e.g. vineyard, ocean, garden)</label><input type="text" id="m-room-view" class="form-control" value="' + (item.view || 'vineyard') + '"></div>',
          '<div class="form-group"><label>Description</label><textarea id="m-room-desc" class="form-control">' + (item.description || '') + '</textarea></div>',
          '<div class="form-group"><label>Amenities (Comma separated)</label><input type="text" id="m-room-amenities" class="form-control" value="' + (item.amenities ? item.amenities.join(', ') : 'King bed, Freestanding bath, Minibar') + '"></div>',
          '<div class="form-group"><label>Unsplash Photo ID or Full Image URL</label><input type="text" id="m-room-img" class="form-control" value="' + (item.imgId || item.imgUrl || '1590490360182-c33d57733427') + '"></div>'
        ].join('');
      } else if (col === 'properties') {
        return [
          '<div class="form-group"><label>Property Street Address</label><input type="text" id="m-prop-address" class="form-control" value="' + (item.address || '') + '" required></div>',
          '<div class="form-grid-2">',
          '  <div class="form-group"><label>Suburb</label><input type="text" id="m-prop-suburb" class="form-control" value="' + (item.suburb || 'Surfers Paradise') + '" required></div>',
          '  <div class="form-group"><label>Type</label><select id="m-prop-type" class="form-control"><option' + (item.type === 'Apartment' ? ' selected' : '') + '>Apartment</option><option' + (item.type === 'Penthouse' ? ' selected' : '') + '>Penthouse</option><option' + (item.type === 'House' ? ' selected' : '') + '>House</option><option' + (item.type === 'Townhouse' ? ' selected' : '') + '>Townhouse</option><option' + (item.type === 'Villa' ? ' selected' : '') + '>Villa</option></select></div>',
          '</div>',
          '<div class="form-grid-3">',
          '  <div class="form-group"><label>Price (AUD $)</label><input type="number" id="m-prop-price" class="form-control" value="' + (item.price || 1500000) + '"></div>',
          '  <div class="form-group"><label>Bedrooms</label><input type="number" id="m-prop-beds" class="form-control" value="' + (item.beds || 3) + '"></div>',
          '  <div class="form-group"><label>Bathrooms</label><input type="number" id="m-prop-baths" class="form-control" value="' + (item.baths || 2) + '"></div>',
          '</div>',
          '<div class="form-group"><label>Description</label><textarea id="m-prop-desc" class="form-control">' + (item.description || '') + '</textarea></div>',
          '<div class="form-group"><label>Photo URL</label><input type="text" id="m-prop-img" class="form-control" value="' + (item.imgUrl || 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1200&q=80') + '"></div>'
        ].join('');
      } else if (col === 'projects') {
        return [
          '<div class="form-group"><label>Project Title</label><input type="text" id="m-proj-title" class="form-control" value="' + (item.title || '') + '" required></div>',
          '<div class="form-grid-2">',
          '  <div class="form-group"><label>Type</label><select id="m-proj-type" class="form-control"><option' + (item.type === 'Commercial Fit-Out' ? ' selected' : '') + '>Commercial Fit-Out</option><option' + (item.type === 'Residential Extension' ? ' selected' : '') + '>Residential Extension</option><option' + (item.type === 'New Build' ? ' selected' : '') + '>New Build</option><option' + (item.type === 'Renovation' ? ' selected' : '') + '>Renovation</option></select></div>',
          '  <div class="form-group"><label>Suburb / Location</label><input type="text" id="m-proj-suburb" class="form-control" value="' + (item.suburb || 'Brisbane CBD') + '"></div>',
          '</div>',
          '<div class="form-grid-2">',
          '  <div class="form-group"><label>Budget (AUD $)</label><input type="number" id="m-proj-budget" class="form-control" value="' + (item.budget || 850000) + '"></div>',
          '  <div class="form-group"><label>Duration (weeks)</label><input type="text" id="m-proj-duration" class="form-control" value="' + (item.duration || '12 weeks') + '"></div>',
          '</div>',
          '<div class="form-group"><label>Description</label><textarea id="m-proj-desc" class="form-control">' + (item.description || '') + '</textarea></div>',
          '<div class="form-group"><label>Project Image URL</label><input type="text" id="m-proj-img" class="form-control" value="' + (item.imgUrl || 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&q=80') + '"></div>'
        ].join('');
      } else if (col === 'reviews') {
        return [
          '<div class="form-group"><label>Author Name & Location</label><input type="text" id="m-rev-author" class="form-control" value="' + (item.author || '') + '" required></div>',
          '<div class="form-grid-2">',
          '  <div class="form-group"><label>Rating Score (e.g. 9.8 or 5.0)</label><input type="text" id="m-rev-score" class="form-control" value="' + (item.score || '9.5') + '" required></div>',
          '  <div class="form-group"><label>Stay / Context</label><input type="text" id="m-rev-stay" class="form-control" value="' + (item.stay || item.suburb || '') + '"></div>',
          '</div>',
          '<div class="form-group"><label>Testimonial Text</label><textarea id="m-rev-text" class="form-control" required>' + (item.text || '') + '</textarea></div>'
        ].join('');
      } else if (col === 'faq') {
        return [
          '<div class="form-group"><label>Question</label><input type="text" id="m-faq-q" class="form-control" value="' + (item.q || '') + '" required></div>',
          '<div class="form-group"><label>Answer</label><textarea id="m-faq-a" class="form-control" rows="3" required>' + (item.a || '') + '</textarea></div>'
        ].join('');
      }

      return '<p>Custom configuration for ' + col + '</p>';
    },

    saveModalItem: function() {
      if (!window.SiteStore || !this.editingCollection) return;
      var col = this.editingCollection;
      var item = this.editingItem ? Object.assign({}, this.editingItem) : {};

      if (col === 'rooms') {
        item.name = document.getElementById('m-room-name').value.trim();
        item.rate = parseInt(document.getElementById('m-room-rate').value, 10) || 300;
        item.maxGuests = parseInt(document.getElementById('m-room-guests').value, 10) || 2;
        item.view = document.getElementById('m-room-view').value.trim();
        item.description = document.getElementById('m-room-desc').value.trim();
        item.amenities = document.getElementById('m-room-amenities').value.split(',').map(function(s) { return s.trim(); }).filter(Boolean);
        var imgVal = document.getElementById('m-room-img').value.trim();
        if (imgVal.indexOf('http') === 0) item.imgUrl = imgVal;
        else item.imgId = imgVal;
      } else if (col === 'properties') {
        item.address = document.getElementById('m-prop-address').value.trim();
        item.suburb = document.getElementById('m-prop-suburb').value.trim();
        item.type = document.getElementById('m-prop-type').value;
        item.price = parseInt(document.getElementById('m-prop-price').value, 10) || 1000000;
        item.beds = parseInt(document.getElementById('m-prop-beds').value, 10) || 2;
        item.baths = parseInt(document.getElementById('m-prop-baths').value, 10) || 2;
        item.description = document.getElementById('m-prop-desc').value.trim();
        item.imgUrl = document.getElementById('m-prop-img').value.trim();
      } else if (col === 'projects') {
        item.title = document.getElementById('m-proj-title').value.trim();
        item.type = document.getElementById('m-proj-type').value;
        item.suburb = document.getElementById('m-proj-suburb').value.trim();
        item.budget = parseInt(document.getElementById('m-proj-budget').value, 10) || 500000;
        item.duration = document.getElementById('m-proj-duration').value.trim();
        item.description = document.getElementById('m-proj-desc').value.trim();
        item.imgUrl = document.getElementById('m-proj-img').value.trim();
      } else if (col === 'reviews') {
        item.author = document.getElementById('m-rev-author').value.trim();
        item.score = document.getElementById('m-rev-score').value.trim();
        item.stay = document.getElementById('m-rev-stay').value.trim();
        item.text = document.getElementById('m-rev-text').value.trim();
        item.date = item.date || 'Just now';
      } else if (col === 'faq') {
        item.q = document.getElementById('m-faq-q').value.trim();
        item.a = document.getElementById('m-faq-a').value.trim();
      }

      window.SiteStore.saveItem(this.currentVertical, col, item);
      this.closeModal('item-modal');
      this.toast('Item saved successfully!', 'success');
      this.renderCurrentView();
    },

    deleteItem: function(collection, itemId) {
      if (!window.SiteStore) return;
      if (confirm('Are you sure you want to delete this item?')) {
        window.SiteStore.deleteItem(this.currentVertical, collection, itemId);
        this.toast('Item deleted.', 'info');
        this.renderCurrentView();
      }
    },

    closeModal: function(modalId) {
      var modal = document.getElementById(modalId);
      if (modal) modal.classList.remove('is-open');
    },

    // -----------------------------------------------------------------
    // TAB 6: BACKUP & DATA
    // -----------------------------------------------------------------
    exportJsonBackup: function() {
      if (!window.SiteStore) return;
      var backupStr = window.SiteStore.exportBackup();
      var blob = new Blob([backupStr], { type: 'application/json' });
      var url = URL.createObjectURL(blob);
      var a = document.createElement('a');
      a.href = url;
      a.download = 'reozix-site-backup-' + new Date().toISOString().slice(0, 10) + '.json';
      document.body.appendChild(a);
      a.click();
      a.remove();
      this.toast('Backup JSON downloaded', 'success');
    },

    importJsonBackup: function(e) {
      var file = e.target.files[0];
      if (!file) return;
      var reader = new FileReader();
      var self = this;
      reader.onload = function(evt) {
        var success = window.SiteStore.importBackup(evt.target.result);
        if (success) {
          self.toast('Site backup successfully restored!', 'success');
          self.renderCurrentView();
        } else {
          self.toast('Invalid JSON backup file.', 'error');
        }
      };
      reader.readAsText(file);
    },

    confirmReset: function(scope) {
      var msg = scope === 'all'
        ? 'WARNING: This will reset ALL 3 vertical demos (Hotel, Real Estate, Construction) back to factory default demo data. Proceed?'
        : 'Reset ' + this.currentVertical.toUpperCase() + ' demo back to original factory demo data?';

      if (confirm(msg)) {
        window.SiteStore.reset(scope);
        this.toast('Data restored to factory defaults.', 'success');
        this.renderCurrentView();
      }
    },

    // Toast Notification System
    toast: function(msg, type) {
      var container = document.getElementById('toast-container');
      if (!container) return;

      var toastEl = document.createElement('div');
      toastEl.className = 'toast toast-' + (type || 'info');
      toastEl.textContent = msg;

      container.appendChild(toastEl);
      setTimeout(function() {
        toastEl.style.opacity = '0';
        toastEl.style.transform = 'translateX(40px)';
        toastEl.style.transition = 'all 0.3s ease';
        setTimeout(function() { toastEl.remove(); }, 300);
      }, 3500);
    }
  };

  window.AdminApp = AdminApp;

  document.addEventListener('DOMContentLoaded', function() {
    AdminApp.init();
  });

})(typeof window !== 'undefined' ? window : this, typeof document !== 'undefined' ? document : {});
