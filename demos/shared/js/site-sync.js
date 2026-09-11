// =====================================================================
// Reozix Standalone Demos — Public Site Synchronizer
// Live-binds website details (brand name, contact, phone, accents, announcement)
// from SiteStore and captures form submissions.
// =====================================================================

(function(window, document) {
  'use strict';

  function detectVertical() {
    var path = window.location.pathname.toLowerCase();
    if (path.indexOf('/hotel/') !== -1) return 'hotel';
    if (path.indexOf('/realestate/') !== -1) return 'realestate';
    if (path.indexOf('/construction/') !== -1) return 'construction';
    var bodyV = document.body ? document.body.getAttribute('data-vertical') : null;
    if (bodyV) return bodyV;
    return 'hotel';
  }

  var vertical = detectVertical();

  function applyCustomizations() {
    if (!window.SiteStore) return;

    var data = window.SiteStore.get(vertical);
    if (!data || !data.details) return;
    var d = data.details;

    // 1. Accent Color
    if (d.accentColor) {
      var styleEl = document.getElementById('reozix-dynamic-theme');
      if (!styleEl) {
        styleEl = document.createElement('style');
        styleEl.id = 'reozix-dynamic-theme';
        document.head.appendChild(styleEl);
      }
      var cssRules = '';
      if (vertical === 'hotel') {
        cssRules = ':root { --hotel-gold: ' + d.accentColor + '; --accent: ' + d.accentColor + '; }';
      } else if (vertical === 'realestate') {
        cssRules = ':root { --re-accent: ' + d.accentColor + '; --accent: ' + d.accentColor + '; }';
      } else if (vertical === 'construction') {
        cssRules = ':root { --ct-accent: ' + d.accentColor + '; --accent: ' + d.accentColor + '; }';
      }
      styleEl.textContent = cssRules;
    }

    // 2. Phone Links
    if (d.phone) {
      var telClean = d.phone.replace(/[^+\d]/g, '');
      document.querySelectorAll('a[href^="tel:"]').forEach(function(a) {
        a.href = 'tel:' + telClean;
        // if text looks like a phone number, update text too
        if (/[+\d\s()-]{7,}/.test(a.textContent.trim())) {
          a.textContent = d.phone;
        }
      });
    }

    // 3. Email Links
    if (d.email) {
      document.querySelectorAll('a[href^="mailto:"]').forEach(function(a) {
        a.href = 'mailto:' + d.email;
        if (a.textContent.indexOf('@') !== -1) {
          a.textContent = d.email;
        }
      });
    }

    // 4. Brand Name in Nav/Header
    if (d.name) {
      document.querySelectorAll('.logo, .brand-name').forEach(function(logo) {
        if (vertical === 'hotel') {
          logo.textContent = d.name;
        } else if (vertical === 'realestate') {
          logo.innerHTML = d.name.replace('Real Estate', '') + ' <span>Real Estate</span>';
        } else if (vertical === 'construction') {
          logo.innerHTML = d.name.replace('Construction', '') + ' <span>Construction</span>';
        }
      });
    }

    // 5. Announcement Bar
    var existingBar = document.querySelector('.rz-announcement-bar');
    if (d.announcement && d.announcement.enabled && d.announcement.text) {
      if (!existingBar) {
        var bar = document.createElement('div');
        bar.className = 'rz-announcement-bar';
        bar.innerHTML = [
          '<div class="rz-announce-inner">',
          '  <span class="rz-announce-badge">' + (d.announcement.badge || 'Update') + '</span>',
          '  <span class="rz-announce-text">' + d.announcement.text + '</span>',
          d.announcement.link ? '  <a class="rz-announce-link" href="' + d.announcement.link + '">Explore →</a>' : '',
          '</div>'
        ].join('');
        document.body.insertBefore(bar, document.body.firstChild);
      } else {
        existingBar.querySelector('.rz-announce-badge').textContent = d.announcement.badge || 'Update';
        existingBar.querySelector('.rz-announce-text').textContent = d.announcement.text;
        var linkEl = existingBar.querySelector('.rz-announce-link');
        if (linkEl && d.announcement.link) {
          linkEl.href = d.announcement.link;
        }
      }
    } else if (existingBar) {
      existingBar.remove();
    }

    // 6. Floating Admin Gateway Dock (Demo-to-Admin Bridge)
    renderAdminDock();
  }

  function renderAdminDock() {
    var path = window.location.pathname.toLowerCase();
    if (path.indexOf('/admin/') !== -1) return;
    if (document.querySelector('.rz-admin-dock')) return;

    var dock = document.createElement('a');
    dock.className = 'rz-admin-dock';
    dock.href = '../admin/index.html?vertical=' + encodeURIComponent(vertical);
    dock.setAttribute('title', 'Open ' + (vertical.charAt(0).toUpperCase() + vertical.slice(1)) + ' in Admin Dashboard');
    dock.innerHTML = [
      '<span class="rz-admin-dock-icon">⚡</span>',
      '<span class="rz-admin-dock-label">',
      '  <span class="rz-admin-dock-title">Admin Console</span>',
      '  <span class="rz-admin-dock-sub">Customize Live</span>',
      '</span>'
    ].join('');

    document.body.appendChild(dock);
  }

  // Hook form submissions globally into SiteStore leads
  function bindFormCaptures() {
    // Hotel booking submission hook
    window.addEventListener('reozix:hotel-booked', function(e) {
      if (window.SiteStore && e.detail) {
        window.SiteStore.addLead(Object.assign({
          vertical: 'hotel',
          type: 'booking'
        }, e.detail));
      }
    });

    // Real estate appraisal submission hook
    window.addEventListener('reozix:realestate-appraisal', function(e) {
      if (window.SiteStore && e.detail) {
        window.SiteStore.addLead(Object.assign({
          vertical: 'realestate',
          type: 'appraisal'
        }, e.detail));
      }
    });

    // Construction quote submission hook
    window.addEventListener('reozix:construction-quote', function(e) {
      if (window.SiteStore && e.detail) {
        window.SiteStore.addLead(Object.assign({
          vertical: 'construction',
          type: 'quote'
        }, e.detail));
      }
    });
  }

  // Initial load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
      applyCustomizations();
      bindFormCaptures();
    });
  } else {
    applyCustomizations();
    bindFormCaptures();
  }

  // Reactive updates on data changes
  window.addEventListener('reozix:data-change', function() {
    applyCustomizations();
  });

})(typeof window !== 'undefined' ? window : this, typeof document !== 'undefined' ? document : {});
