// Shared utilities for all Reozix demo sites

// Mobile nav toggle — synced aria-expanded, closes on link click / Escape
document.addEventListener('DOMContentLoaded', function() {
  document.querySelectorAll('.nav-toggle').forEach(function(toggle) {
    var nav = toggle.parentElement.querySelector('.nav-links');
    if (!nav) return;

    function setOpen(open) {
      nav.classList.toggle('open', open);
      toggle.setAttribute('aria-expanded', String(open));
    }

    toggle.setAttribute('aria-expanded', 'false');
    toggle.addEventListener('click', function() {
      setOpen(!nav.classList.contains('open'));
    });
    // Choosing a destination closes the panel
    nav.addEventListener('click', function(e) {
      if (e.target.closest('a')) setOpen(false);
    });
    // Escape closes and returns focus to the toggle
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && nav.classList.contains('open')) {
        setOpen(false);
        toggle.focus();
      }
    });
  });
});

// Shared formatting/stay helpers (used by the hotel booking flow; available to all)
window.RZ = {
  pad: function(n) { return (n < 10 ? '0' : '') + n; },
  // Date → YYYY-MM-DD in local time (toISOString would shift by timezone)
  iso: function(d) { return d.getFullYear() + '-' + this.pad(d.getMonth() + 1) + '-' + this.pad(d.getDate()); },
  nights: function(checkin, checkout) {
    var n = Math.round((new Date(checkout) - new Date(checkin)) / 86400000);
    return n > 0 ? n : 0;
  },
  money: function(n) { return '$' + n.toLocaleString('en-AU'); },
  // '2026-09-01' → 'Tue 1 Sep' (T12:00 avoids the date shifting back a day in UTC- timezones)
  fmtDate: function(iso) {
    return new Date(iso + 'T12:00').toLocaleDateString('en-AU', { weekday: 'short', day: 'numeric', month: 'short' });
  },
  // Read the stay (checkin/checkout/guests) from the current URL, '' / 0 when absent
  stayFromUrl: function() {
    var p = new URLSearchParams(window.location.search);
    return {
      checkin: p.get('checkin') || '',
      checkout: p.get('checkout') || '',
      guests: parseInt(p.get('guests'), 10) || 0,
      query: function() {
        var qs = new URLSearchParams();
        if (this.checkin) qs.set('checkin', this.checkin);
        if (this.checkout) qs.set('checkout', this.checkout);
        if (this.guests) qs.set('guests', this.guests);
        return qs.toString();
      }
    };
  },

  // Fullscreen image lightbox. images: [{src, alt}]. Returns { open(i), close() }.
  // Esc / backdrop close, arrow keys navigate, Tab is trapped to the overlay,
  // focus returns to the trigger on close.
  makeLightbox: function(images) {
    var lb = document.createElement('div');
    lb.className = 'lightbox';
    lb.setAttribute('role', 'dialog');
    lb.setAttribute('aria-modal', 'true');
    lb.setAttribute('aria-label', 'Photo viewer');
    lb.innerHTML =
      '<button type="button" class="lb-close" aria-label="Close photos">✕</button>' +
      '<button type="button" class="lb-prev" aria-label="Previous photo">‹</button>' +
      '<img src="" alt="">' +
      '<button type="button" class="lb-next" aria-label="Next photo">›</button>' +
      '<p class="lb-count"></p>';
    document.body.appendChild(lb);

    var img = lb.querySelector('img');
    var count = lb.querySelector('.lb-count');
    var idx = 0;
    var lastFocus = null;

    function focusables() {
      return Array.prototype.filter.call(
        lb.querySelectorAll('button'),
        function(el) { return el.offsetParent !== null; }
      );
    }

    function update() {
      img.src = images[idx].src;
      img.alt = images[idx].alt;
      count.textContent = (idx + 1) + ' / ' + images.length;
    }
    function step(dir) {
      idx = (idx + dir + images.length) % images.length;
      update();
    }
    function open(i) {
      lastFocus = document.activeElement;
      idx = i;
      update();
      lb.classList.add('open');
      document.body.style.overflow = 'hidden';
      lb.querySelector('.lb-close').focus();
    }
    function close() {
      lb.classList.remove('open');
      document.body.style.overflow = '';
      if (lastFocus) lastFocus.focus();
    }

    lb.querySelector('.lb-close').addEventListener('click', close);
    lb.querySelector('.lb-prev').addEventListener('click', function() { step(-1); });
    lb.querySelector('.lb-next').addEventListener('click', function() { step(1); });
    lb.addEventListener('click', function(e) { if (e.target === lb) close(); });
    document.addEventListener('keydown', function(e) {
      if (!lb.classList.contains('open')) return;
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowLeft') step(-1);
      if (e.key === 'ArrowRight') step(1);
      if (e.key === 'Tab') {
        // Trap Tab inside the dialog
        var f = focusables();
        if (!f.length) return;
        var first = f[0], last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    });

    return { open: open, close: close };
  }
};

// Corner Contact & Enquiry Widget (Hotel, Real Estate, Construction)
(function() {
  var VERTICALS = {
    hotel: {
      id: 'hotel',
      name: 'Reozix Hotel',
      title: 'Concierge Desk',
      sub: 'Available now · Avg. reply 15m',
      initials: 'RH',
      phone: '+61 3 5984 1200',
      email: 'stay@reozixhotel.com.au',
      launcherLabel: 'Concierge Desk',
      submitText: 'Send Concierge Enquiry',
      prefix: 'HTL',
      topics: [
        { id: 'booking', label: '🏨 Suite & Stay Booking', placeholder: 'Let us know your preferred dates, room preferences, or party size...' },
        { id: 'dining', label: '🍷 Private Dining & Cellar', placeholder: 'Tell us about your dining party size, date, and cellar preferences...' },
        { id: 'experiences', label: '🌿 Experiences & Transfers', placeholder: 'Inquire about vineyard tours, peninsula transfers, or special requests...' },
        { id: 'general', label: '💬 General Enquiry', placeholder: 'How may our concierge team assist your stay?' }
      ],
      quickTags: ['Request Callback', 'Check Dates', 'Special Occasion', 'Late Checkout']
    },
    realestate: {
      id: 'realestate',
      name: 'Reozix Real Estate',
      title: 'Gold Coast Property Desk',
      sub: 'Specialist Agent · Avg. reply 20m',
      initials: 'RE',
      phone: '+61 7 5592 3400',
      email: 'enquiries@reozixrealestate.com.au',
      launcherLabel: 'Enquire with Agent',
      submitText: 'Send Property Enquiry',
      prefix: 'REA',
      topics: [
        { id: 'inspection', label: '🏡 Property Inspection', placeholder: 'Specify the property address or listing you would like to inspect...' },
        { id: 'appraisal', label: '📊 Free Market Appraisal', placeholder: 'Tell us your property address, bedroom count, and current timeline...' },
        { id: 'offmarket', label: '🔑 Off-Market & Alerts', placeholder: 'Share your preferred suburbs, property type, and budget bracket...' },
        { id: 'general', label: '🏢 General Question', placeholder: 'Ask any question to our Gold Coast real estate specialists...' }
      ],
      quickTags: ['Book Private Inspection', 'Request Contract', 'Virtual Tour', 'Call Me Back']
    },
    construction: {
      id: 'construction',
      name: 'Reozix Construction',
      title: 'Brisbane Estimator Desk',
      sub: 'QBCC #15298834 · Direct Consultation',
      initials: 'RC',
      phone: '+61 7 3186 2400',
      email: 'projects@reozixconstruction.com.au',
      launcherLabel: 'Consult Estimator',
      submitText: 'Request Builder Consultation',
      prefix: 'BLD',
      topics: [
        { id: 'quote', label: '🏗️ Commercial Fit-out', placeholder: 'Describe your commercial premises, square meterage, and target dates...' },
        { id: 'residential', label: '🏠 Residential Build & Extension', placeholder: 'Tell us about your home renovation, extension, or new build vision...' },
        { id: 'drawings', label: '📐 Tender & Drawing Review', placeholder: 'Share your plans status, budget estimate, and engineering approvals...' },
        { id: 'callback', label: '📞 Request Site Callback', placeholder: 'Provide your site location and best time for our supervisor to call...' }
      ],
      quickTags: ['Request Site Visit', 'Have Architectural Plans', 'Cost Estimate', 'QBCC Question']
    }
  };

  function detectVertical() {
    var p = window.location.pathname.toLowerCase();
    if (p.indexOf('/hotel') !== -1 || document.querySelector('.hotel-nav') || document.querySelector('link[href*="hotel.css"]')) {
      return 'hotel';
    }
    if (p.indexOf('/realestate') !== -1 || document.querySelector('.re-nav') || document.querySelector('link[href*="realestate.css"]')) {
      return 'realestate';
    }
    if (p.indexOf('/construction') !== -1 || document.querySelector('.ct-nav') || document.querySelector('link[href*="construction.css"]')) {
      return 'construction';
    }
    return null;
  }

  function ContactPopupManager() {
    this.verticalId = detectVertical();
    if (!this.verticalId) return;
    this.config = VERTICALS[this.verticalId];
    this.dockEl = null;
    this.cardEl = null;
    this.formEl = null;
    this.launcherEl = null;
    this.isOpen = false;
    this.selectedTopic = this.config && this.config.topics ? this.config.topics[0].id : '';
    this.lastActiveElement = null;
  }

  ContactPopupManager.prototype.init = function() {
    if (!this.verticalId || !this.config) return;
    if (document.getElementById('rz-contact-dock')) return;
    this.render();
    this.bindEvents();
  };

  ContactPopupManager.prototype.render = function() {
    var c = this.config;
    var dock = document.createElement('div');
    dock.id = 'rz-contact-dock';
    dock.className = 'rz-contact-dock';
    dock.setAttribute('data-vertical', this.verticalId);

    var chatIconSvg = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>';
    var closeIconSvg = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>';
    var phoneIconSvg = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>';
    var mailIconSvg = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>';
    var checkIconSvg = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>';
    var sendArrowSvg = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>';

    var topicChipsHtml = c.topics.map(function(t, idx) {
      return '<button type="button" class="rz-topic-chip ' + (idx === 0 ? 'is-active' : '') + '" data-topic-id="' + t.id + '">' + t.label + '</button>';
    }).join('');

    var quickTagsHtml = c.quickTags.map(function(tag) {
      return '<button type="button" class="rz-quick-tag" data-tag="' + tag + '">+' + tag + '</button>';
    }).join('');

    var html = [
      '<div class="rz-contact-card" role="dialog" aria-modal="true" aria-labelledby="rz-card-title">',
      '  <div class="rz-card-header">',
      '    <div class="rz-header-profile">',
      '      <div class="rz-avatar-badge">' + c.initials + '<span class="rz-online-dot" aria-label="Online"></span></div>',
      '      <div class="rz-header-info">',
      '        <h4 id="rz-card-title">' + c.title + '</h4>',
      '        <p>' + c.sub + '</p>',
      '      </div>',
      '    </div>',
      '    <div class="rz-header-actions">',
      '      <button type="button" class="rz-header-btn rz-close-btn" aria-label="Minimize contact widget">' + closeIconSvg + '</button>',
      '    </div>',
      '  </div>',
      '  <div class="rz-hotline-strip">',
      '    <a href="tel:' + c.phone.replace(/[^0-9+]/g, '') + '" class="rz-hotline-link">' + phoneIconSvg + ' ' + c.phone + '</a>',
      '    <a href="mailto:' + c.email + '" class="rz-hotline-link">' + mailIconSvg + ' ' + c.email + '</a>',
      '  </div>',
      '  <div class="rz-card-body">',
      '    <div class="rz-form-container">',
      '      <div class="rz-section-subhead">Select Enquiry Topic</div>',
      '      <div class="rz-topic-chips">' + topicChipsHtml + '</div>',
      '      <form class="rz-contact-form" id="rz-contact-form" novalidate>',
      '        <div class="rz-form-row">',
      '          <div class="rz-form-group" id="group-name">',
      '            <label class="rz-form-label" for="rz-input-name">Full Name *</label>',
      '            <input type="text" class="rz-form-input" id="rz-input-name" placeholder="Your name" autocomplete="name" required>',
      '            <span class="rz-error-text">Please enter your name</span>',
      '          </div>',
      '          <div class="rz-form-group" id="group-phone">',
      '            <label class="rz-form-label" for="rz-input-phone">Phone Number</label>',
      '            <input type="tel" class="rz-form-input" id="rz-input-phone" placeholder="04xx xxx xxx" autocomplete="tel">',
      '          </div>',
      '        </div>',
      '        <div class="rz-form-group" id="group-email">',
      '          <label class="rz-form-label" for="rz-input-email">Email Address *</label>',
      '          <input type="email" class="rz-form-input" id="rz-input-email" placeholder="you@example.com" autocomplete="email" required>',
      '          <span class="rz-error-text">Please enter a valid email address</span>',
      '        </div>',
      '        <div class="rz-form-group" id="group-subject">',
      '          <label class="rz-form-label" for="rz-input-subject">Context / Reference</label>',
      '          <input type="text" class="rz-form-input" id="rz-input-subject" placeholder="e.g. Room preference, Property address, Project...">',
      '        </div>',
      '        <div class="rz-form-group" id="group-message">',
      '          <label class="rz-form-label" for="rz-input-msg">Message / Requirements *</label>',
      '          <textarea class="rz-form-textarea" id="rz-input-msg" placeholder="' + c.topics[0].placeholder + '" required></textarea>',
      '          <span class="rz-error-text">Please include your message or inquiry details</span>',
      '        </div>',
      '        <div class="rz-quick-tags">' + quickTagsHtml + '</div>',
      '        <button type="submit" class="rz-submit-btn" id="rz-submit-btn">',
      '          <span class="rz-spinner" aria-hidden="true"></span>',
      '          <span class="rz-btn-text">' + c.submitText + '</span>',
      '          ' + sendArrowSvg,
      '        </button>',
      '      </form>',
      '    </div>',
      '    <div class="rz-success-state" id="rz-success-state">',
      '      <div class="rz-success-icon">' + checkIconSvg + '</div>',
      '      <h4 class="rz-success-title">Enquiry Received!</h4>',
      '      <p class="rz-success-desc">Thank you. Our ' + (this.verticalId === 'hotel' ? 'concierge desk' : this.verticalId === 'realestate' ? 'agent specialist' : 'estimator') + ' has received your details and will respond promptly.</p>',
      '      <div class="rz-ref-box">Reference ID: <span id="rz-ref-code">—</span></div>',
      '      <div class="rz-success-actions">',
      '        <button type="button" class="rz-btn-secondary" id="rz-reset-btn">Send Another</button>',
      '        <button type="button" class="rz-submit-btn" id="rz-done-btn">Done</button>',
      '      </div>',
      '    </div>',
      '  </div>',
      '</div>',
      '<button type="button" class="rz-contact-launcher" id="rz-contact-launcher" aria-label="Open contact widget" aria-expanded="false">',
      '  <span class="rz-icon-wrapper">' + chatIconSvg + '</span>',
      '  <span class="rz-launcher-text">' + c.launcherLabel + '</span>',
      '  <span class="rz-online-dot" aria-hidden="true"></span>',
      '</button>'
    ].join('\n');

    dock.innerHTML = html;
    document.body.appendChild(dock);

    this.dockEl = dock;
    this.cardEl = dock.querySelector('.rz-contact-card');
    this.formEl = dock.querySelector('#rz-contact-form');
    this.launcherEl = dock.querySelector('#rz-contact-launcher');
  };

  ContactPopupManager.prototype.bindEvents = function() {
    var self = this;

    this.launcherEl.addEventListener('click', function(e) {
      e.stopPropagation();
      self.toggle();
    });

    this.dockEl.querySelector('.rz-close-btn').addEventListener('click', function(e) {
      e.stopPropagation();
      self.close();
    });

    this.dockEl.querySelector('#rz-done-btn').addEventListener('click', function() {
      self.close();
    });

    this.dockEl.querySelector('#rz-reset-btn').addEventListener('click', function() {
      self.resetForm();
    });

    var chips = this.dockEl.querySelectorAll('.rz-topic-chip');
    chips.forEach(function(chip) {
      chip.addEventListener('click', function() {
        chips.forEach(function(c) { c.classList.remove('is-active'); });
        chip.classList.add('is-active');
        self.selectedTopic = chip.getAttribute('data-topic-id');

        var match = self.config.topics.filter(function(t) { return t.id === self.selectedTopic; })[0];
        if (match) {
          var textarea = self.dockEl.querySelector('#rz-input-msg');
          textarea.placeholder = match.placeholder;
        }
      });
    });

    var quickTags = this.dockEl.querySelectorAll('.rz-quick-tag');
    quickTags.forEach(function(tagBtn) {
      tagBtn.addEventListener('click', function() {
        var tagText = tagBtn.getAttribute('data-tag');
        var textarea = self.dockEl.querySelector('#rz-input-msg');
        var current = textarea.value.trim();
        if (current.indexOf(tagText) === -1) {
          textarea.value = current ? current + '\n• ' + tagText : '• ' + tagText;
        }
        textarea.focus();
      });
    });

    this.formEl.addEventListener('submit', function(e) {
      e.preventDefault();
      self.handleSubmit();
    });

    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && self.isOpen) {
        self.close();
      }
    });

    document.addEventListener('click', function(e) {
      var trigger = e.target.closest('[data-open-contact], a[href="#contact"], .open-contact-btn');
      if (trigger) {
        e.preventDefault();
        var subject = trigger.getAttribute('data-contact-subject') || '';
        var topic = trigger.getAttribute('data-contact-topic') || '';
        self.open({ subject: subject, topic: topic });
      }
    });
  };

  ContactPopupManager.prototype.handleSubmit = function() {
    var self = this;
    var nameInput = this.dockEl.querySelector('#rz-input-name');
    var emailInput = this.dockEl.querySelector('#rz-input-email');
    var phoneInput = this.dockEl.querySelector('#rz-input-phone');
    var subjectInput = this.dockEl.querySelector('#rz-input-subject');
    var msgInput = this.dockEl.querySelector('#rz-input-msg');
    var submitBtn = this.dockEl.querySelector('#rz-submit-btn');

    var groupName = this.dockEl.querySelector('#group-name');
    var groupEmail = this.dockEl.querySelector('#group-email');
    var groupMsg = this.dockEl.querySelector('#group-message');

    groupName.classList.remove('has-error');
    groupEmail.classList.remove('has-error');
    groupMsg.classList.remove('has-error');

    var isValid = true;

    if (!nameInput.value.trim() || nameInput.value.trim().length < 2) {
      groupName.classList.add('has-error');
      isValid = false;
    }

    var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailInput.value.trim())) {
      groupEmail.classList.add('has-error');
      isValid = false;
    }

    if (!msgInput.value.trim()) {
      groupMsg.classList.add('has-error');
      isValid = false;
    }

    if (!isValid) return;

    submitBtn.classList.add('is-loading');
    submitBtn.disabled = true;

    var refCode = this.config.prefix + '-' + Math.floor(10000 + Math.random() * 90000);
    var inquiryData = {
      refCode: refCode,
      vertical: this.verticalId,
      topic: this.selectedTopic,
      name: nameInput.value.trim(),
      email: emailInput.value.trim(),
      phone: phoneInput.value.trim(),
      subject: subjectInput.value.trim(),
      message: msgInput.value.trim(),
      timestamp: new Date().toISOString()
    };

    setTimeout(function() {
      submitBtn.classList.remove('is-loading');
      submitBtn.disabled = false;

      try {
        var existing = JSON.parse(localStorage.getItem('reozix_inquiries') || '[]');
        existing.push(inquiryData);
        localStorage.setItem('reozix_inquiries', JSON.stringify(existing));
      } catch (err) {
        console.warn('Could not save to localStorage', err);
      }

      self.dockEl.querySelector('.rz-form-container').style.display = 'none';
      self.dockEl.querySelector('#rz-ref-code').textContent = refCode;
      self.dockEl.querySelector('#rz-success-state').classList.add('is-visible');
    }, 600);
  };

  ContactPopupManager.prototype.resetForm = function() {
    if (!this.dockEl) return;
    this.formEl.reset();
    this.dockEl.querySelector('.rz-form-container').style.display = 'block';
    this.dockEl.querySelector('#rz-success-state').classList.remove('is-visible');
  };

  ContactPopupManager.prototype.open = function(opts) {
    if (!this.dockEl) return;
    opts = opts || {};
    this.lastActiveElement = document.activeElement;
    this.isOpen = true;
    this.dockEl.classList.add('is-open');
    this.launcherEl.setAttribute('aria-expanded', 'true');

    if (opts.subject) {
      var subj = this.dockEl.querySelector('#rz-input-subject');
      if (subj) subj.value = opts.subject;
    }

    if (opts.topic) {
      var targetChip = this.dockEl.querySelector('.rz-topic-chip[data-topic-id="' + opts.topic + '"]');
      if (targetChip) targetChip.click();
    }

    var firstInput = this.dockEl.querySelector('#rz-input-name');
    if (firstInput) {
      setTimeout(function() { firstInput.focus(); }, 150);
    }
  };

  ContactPopupManager.prototype.close = function() {
    if (!this.dockEl) return;
    this.isOpen = false;
    this.dockEl.classList.remove('is-open');
    this.launcherEl.setAttribute('aria-expanded', 'false');
    if (this.lastActiveElement && typeof this.lastActiveElement.focus === 'function') {
      this.lastActiveElement.focus();
    }
  };

  ContactPopupManager.prototype.toggle = function() {
    if (!this.dockEl) return;
    if (this.isOpen) {
      this.close();
    } else {
      this.open();
    }
  };

  window.RZ = window.RZ || {};
  window.RZ.contactPopup = new ContactPopupManager();

  document.addEventListener('DOMContentLoaded', function() {
    if (window.RZ.contactPopup && typeof window.RZ.contactPopup.init === 'function') {
      window.RZ.contactPopup.init();
    }
  });

  window.RZ.openContact = function(opts) {
    if (window.RZ.contactPopup && typeof window.RZ.contactPopup.open === 'function') {
      window.RZ.contactPopup.open(opts);
    }
  };
  window.RZ.closeContact = function() {
    if (window.RZ.contactPopup && typeof window.RZ.contactPopup.close === 'function') {
      window.RZ.contactPopup.close();
    }
  };
  window.RZ.toggleContact = function() {
    if (window.RZ.contactPopup && typeof window.RZ.contactPopup.toggle === 'function') {
      window.RZ.contactPopup.toggle();
    }
  };
})();

/* ==========================================================================
   RZ.Motion — Animation & Micro-interaction Engine for all Demo Sites
   ========================================================================== */
(function() {
  'use strict';

  var isReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var hasIO = 'IntersectionObserver' in window;

  var Motion = {
    io: null,
    counters: new WeakSet(),
    revealed: new WeakSet(),

    init: function() {
      var self = this;
      this.initHeaderScroll();
      this.initToasts();
      this.initFavorites();
      this.initBeforeAfterSliders();
      this.initSubtleTilt();
      this.initConstructionCalculator();
      this.enhancePageStructure();
      this.scan();

      // Observe DOM mutations to auto-enhance dynamically injected cards
      if (window.MutationObserver) {
        var mo = new MutationObserver(function(mutations) {
          var shouldScan = false;
          for (var i = 0; i < mutations.length; i++) {
            if (mutations[i].addedNodes.length > 0) {
              shouldScan = true;
              break;
            }
          }
          if (shouldScan) self.scan();
        });
        mo.observe(document.body, { childList: true, subtree: true });
      }
    },

    // Interactive Quick Project Estimator (Construction)
    initConstructionCalculator: function() {
      var typeSelect = document.getElementById('calc-type');
      var sqmSlider = document.getElementById('calc-sqm');
      var sqmDisplay = document.getElementById('calc-sqm-val');
      var costMinDisplay = document.getElementById('calc-cost-min');
      var costMaxDisplay = document.getElementById('calc-cost-max');
      var timeDisplay = document.getElementById('calc-time-val');

      if (!typeSelect || !sqmSlider) return;

      var RATES = {
        fitout: { min: 900, max: 1500, weeksPer100: 1.2, baseWeeks: 6 },
        extension: { min: 2200, max: 3800, weeksPer100: 3.5, baseWeeks: 10 },
        newbuild: { min: 2800, max: 4800, weeksPer100: 4.0, baseWeeks: 18 },
        renovation: { min: 1400, max: 2600, weeksPer100: 2.0, baseWeeks: 4 }
      };

      function updateCalc() {
        var type = typeSelect.value || 'fitout';
        var sqm = parseInt(sqmSlider.value, 10) || 150;
        var r = RATES[type] || RATES.fitout;

        if (sqmDisplay) sqmDisplay.textContent = sqm + ' m²';

        var totalMin = Math.round((sqm * r.min) / 5000) * 5000;
        var totalMax = Math.round((sqm * r.max) / 5000) * 5000;
        var weeks = Math.round(r.baseWeeks + (sqm / 100) * r.weeksPer100);

        if (costMinDisplay) costMinDisplay.textContent = '$' + totalMin.toLocaleString('en-AU');
        if (costMaxDisplay) costMaxDisplay.textContent = '$' + totalMax.toLocaleString('en-AU');
        if (timeDisplay) timeDisplay.textContent = weeks + '–' + (weeks + 4) + ' weeks';
      }

      typeSelect.addEventListener('change', updateCalc);
      sqmSlider.addEventListener('input', updateCalc);

      document.querySelectorAll('.ct-calc-preset-btn').forEach(function(btn) {
        btn.addEventListener('click', function() {
          var t = btn.getAttribute('data-type');
          var s = btn.getAttribute('data-sqm');
          if (t) typeSelect.value = t;
          if (s) sqmSlider.value = s;
          updateCalc();
          btn.style.transform = 'scale(0.94)';
          setTimeout(function() { btn.style.transform = ''; }, 200);
        });
      });

      updateCalc();
    },

    // Add scroll glass effect to navbars
    initHeaderScroll: function() {
      var nav = document.querySelector('.hotel-nav, .re-nav, .ct-nav');
      if (!nav) return;
      var onScroll = function() {
        if (window.scrollY > 20) {
          nav.classList.add('nav-scrolled');
        } else {
          nav.classList.remove('nav-scrolled');
        }
      };
      window.addEventListener('scroll', onScroll, { passive: true });
      onScroll();
    },

    // Toast notification manager
    initToasts: function() {
      var container = document.getElementById('rz-toast-container');
      if (!container) {
        container = document.createElement('div');
        container.id = 'rz-toast-container';
        container.className = 'rz-toast-container';
        container.setAttribute('aria-live', 'polite');
        document.body.appendChild(container);
      }
      this.toastContainer = container;
    },

    toast: function(message, opts) {
      opts = opts || {};
      var vId = 'hotel';
      var p = window.location.pathname.toLowerCase();
      if (p.indexOf('/realestate') !== -1) vId = 'realestate';
      else if (p.indexOf('/construction') !== -1) vId = 'construction';

      var toast = document.createElement('div');
      toast.className = 'rz-toast toast-' + vId;
      var icon = opts.icon || (vId === 'hotel' ? '✨' : vId === 'realestate' ? '🏡' : '🏗️');
      toast.innerHTML = '<span class="rz-toast-icon">' + icon + '</span><span>' + message + '</span>';
      
      this.toastContainer.appendChild(toast);
      
      requestAnimationFrame(function() {
        toast.classList.add('is-visible');
      });

      setTimeout(function() {
        toast.classList.remove('is-visible');
        setTimeout(function() {
          if (toast.parentNode) toast.parentNode.removeChild(toast);
        }, 400);
      }, opts.duration || 3200);
    },

    // Interactive heart favorite / bookmark toggle
    initFavorites: function() {
      var self = this;
      document.addEventListener('click', function(e) {
        var btn = e.target.closest('.rz-favorite-btn');
        if (!btn) return;
        e.preventDefault();
        e.stopPropagation();

        var isActive = btn.classList.toggle('is-active');
        btn.classList.add('is-popping');
        setTimeout(function() { btn.classList.remove('is-popping'); }, 600);

        var title = btn.getAttribute('data-item-title') || 'Listing';
        if (isActive) {
          self.toast('Saved "' + title + '" to your shortlist', { icon: '❤️' });
        } else {
          self.toast('Removed "' + title + '" from your shortlist', { icon: '🤍' });
        }
      });
    },

    // Interactive before/after split image comparison slider
    initBeforeAfterSliders: function() {
      document.querySelectorAll('.rz-compare-container').forEach(function(container) {
        var before = container.querySelector('.rz-compare-before');
        var handle = container.querySelector('.rz-compare-handle');
        if (!before || !handle) return;

        var isDown = false;
        function updatePos(x) {
          var rect = container.getBoundingClientRect();
          var offsetX = Math.max(0, Math.min(x - rect.left, rect.width));
          var pct = Math.max(5, Math.min(95, (offsetX / rect.width) * 100));
          before.style.clipPath = 'polygon(0 0, ' + pct + '% 0, ' + pct + '% 100%, 0 100%)';
          handle.style.left = pct + '%';
        }

        container.addEventListener('mousedown', function(e) { isDown = true; updatePos(e.clientX); });
        window.addEventListener('mouseup', function() { isDown = false; });
        window.addEventListener('mousemove', function(e) { if (isDown) updatePos(e.clientX); });

        container.addEventListener('touchstart', function(e) { isDown = true; updatePos(e.touches[0].clientX); }, { passive: true });
        window.addEventListener('touchend', function() { isDown = false; });
        window.addEventListener('touchmove', function(e) { if (isDown) updatePos(e.touches[0].clientX); }, { passive: true });
      });
    },

    // Subtle 3D mouse parallax tilt
    initSubtleTilt: function() {
      if (isReduced || !window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
      var tiltEls = document.querySelectorAll('.hero-visual, .ct-hero-visual, .featured-property-visual');
      tiltEls.forEach(function(el) {
        el.style.transition = 'transform 0.4s var(--rz-ease-out-expo)';
        el.addEventListener('mousemove', function(e) {
          var rect = el.getBoundingClientRect();
          var x = (e.clientX - rect.left) / rect.width - 0.5;
          var y = (e.clientY - rect.top) / rect.height - 0.5;
          el.style.transform = 'perspective(1000px) rotateY(' + (x * 6) + 'deg) rotateX(' + (-y * 6) + 'deg) scale3d(1.01, 1.01, 1.01)';
        });
        el.addEventListener('mouseleave', function() {
          el.style.transform = 'perspective(1000px) rotateY(0deg) rotateX(0deg) scale3d(1, 1, 1)';
        });
      });
    },

    // Add motion classes to standard components automatically
    enhancePageStructure: function() {
      // Add stagger parent to card grids
      document.querySelectorAll(
        '.room-grid, .property-grid, .results-grid, .ct-portfolio-grid, .ct-projects-grid, .ct-services-grid, .experience-grid, .stats-strip .container, .ct-stat-bar .ct-container, .ct-stats-grid, .cards, .agent-grid, .perk-strip .perks'
      ).forEach(function(grid) {
        if (!grid.classList.contains('rz-stagger-parent')) {
          grid.classList.add('rz-stagger-parent');
        }
      });

      // Add reveal to section heads
      document.querySelectorAll('.section-head, .re-section-title, .ct-section-kicker, .ct-section-title, .hero-kicker, .hero-content h1, .ct-hero-content h1').forEach(function(head) {
        if (!head.classList.contains('rz-reveal')) {
          head.classList.add('rz-reveal');
        }
      });

      // Add interactive card class to cards
      document.querySelectorAll(
        '.room-card, .property-card, .ct-project-card, .project-card, .ct-service-card, .agent-card, .feature-card, .card, .booking-widget, .re-hero .search-bar, .ct-stat'
      ).forEach(function(card) {
        card.classList.add('rz-card-interactive');
      });

      // Add animated button class
      document.querySelectorAll('.btn, .check-btn, .book-btn, .re-btn, .ct-btn, .search-btn').forEach(function(btn) {
        btn.classList.add('rz-btn-animated');
      });
    },

    // Smooth cubic metric count-up
    animateCounter: function(el) {
      if (this.counters.has(el)) return;
      this.counters.add(el);

      var raw = el.textContent.trim();
      var match = raw.match(/^([^0-9.]*)([0-9.]+)(.*)$/);
      if (!match) return;

      var prefix = match[1] || '';
      var targetNum = parseFloat(match[2]);
      var suffix = match[3] || '';
      if (isNaN(targetNum)) return;

      var decimals = (match[2].split('.')[1] || '').length;
      var duration = 1200;
      var startTime = null;

      function step(now) {
        if (!startTime) startTime = now;
        var progress = Math.min((now - startTime) / duration, 1);
        var ease = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
        var current = targetNum * ease;
        
        el.textContent = prefix + (decimals > 0 ? current.toFixed(decimals) : Math.round(current)) + suffix;
        if (progress < 1) {
          requestAnimationFrame(step);
        } else {
          el.textContent = raw;
        }
      }

      requestAnimationFrame(step);
    },

    // Scan and bind intersection observer to reveals and counters
    scan: function() {
      var self = this;
      this.enhancePageStructure();

      if (isReduced || !hasIO) {
        document.querySelectorAll('.rz-reveal, .rz-stagger-parent').forEach(function(el) {
          el.classList.add('is-revealed');
        });
        return;
      }

      if (!this.io) {
        this.io = new IntersectionObserver(function(entries) {
          entries.forEach(function(entry) {
            if (entry.isIntersecting) {
              var target = entry.target;
              target.classList.add('is-revealed');

              // Check for counter elements inside or on the target
              var counterEls = target.matches('.stat-num, .ct-stat-num, .ct-stat-value, .score-num, [data-countup]') 
                ? [target] 
                : target.querySelectorAll('.stat-num, .ct-stat-num, .ct-stat-value, .score-num, [data-countup]');
              
              counterEls.forEach(function(c) {
                self.animateCounter(c);
              });

              self.io.unobserve(target);
            }
          });
        }, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' });
      }

      document.querySelectorAll('.rz-reveal:not(.is-revealed), .rz-stagger-parent:not(.is-revealed)').forEach(function(el) {
        self.io.observe(el);
      });

      document.querySelectorAll('.stat-num, .ct-stat-num, .ct-stat-value, .score-num, [data-countup]').forEach(function(c) {
        if (!self.counters.has(c)) {
          self.io.observe(c);
        }
      });
    }
  };

  window.RZ = window.RZ || {};
  window.RZ.Motion = Motion;
  window.RZ.toast = function(msg, opts) { Motion.toast(msg, opts); };

  document.addEventListener('DOMContentLoaded', function() {
    Motion.init();
  });
})();


