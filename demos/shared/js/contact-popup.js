// =====================================================================
// Reozix Demos — Shared Corner Contact & Enquiry Widget Controller
// Floating bottom-right chat-style popup that dynamically themes itself
// =====================================================================

(function(window, document) {
  'use strict';

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

    // SVGs
    var chatIconSvg = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>';
    var closeIconSvg = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>';
    var phoneIconSvg = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>';
    var mailIconSvg = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>';
    var checkIconSvg = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>';
    var sendArrowSvg = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>';

    // Build Topic Chips HTML
    var topicChipsHtml = c.topics.map(function(t, idx) {
      return '<button type="button" class="rz-topic-chip ' + (idx === 0 ? 'is-active' : '') + '" data-topic-id="' + t.id + '">' + t.label + '</button>';
    }).join('');

    // Build Quick Tags HTML
    var quickTagsHtml = c.quickTags.map(function(tag) {
      return '<button type="button" class="rz-quick-tag" data-tag="' + tag + '">+' + tag + '</button>';
    }).join('');

    var html = [
      '<!-- Floating Chat Popup Card -->',
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
      '          <input type="text" class="rz-form-input" id="rz-input-subject" placeholder="e.g. Booking Dates, Property, Project...">',
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
      '    <!-- Success State View -->',
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
      '<!-- Launcher Trigger Pill -->',
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

    // Launcher click
    this.launcherEl.addEventListener('click', function(e) {
      e.stopPropagation();
      self.toggle();
    });

    // Close button
    this.dockEl.querySelector('.rz-close-btn').addEventListener('click', function(e) {
      e.stopPropagation();
      self.close();
    });

    // Done button in success state
    this.dockEl.querySelector('#rz-done-btn').addEventListener('click', function() {
      self.close();
    });

    // Reset button in success state
    this.dockEl.querySelector('#rz-reset-btn').addEventListener('click', function() {
      self.resetForm();
    });

    // Topic chips switching
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

    // Quick tags appending
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

    // Form Submission with Validation
    this.formEl.addEventListener('submit', function(e) {
      e.preventDefault();
      self.handleSubmit();
    });

    // Global keyboard escape
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && self.isOpen) {
        self.close();
      }
    });

    // Global triggers: [data-open-contact], a[href="#contact"]
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

    // Reset error states
    groupName.classList.remove('has-error');
    groupEmail.classList.remove('has-error');
    groupMsg.classList.remove('has-error');

    var isValid = true;

    // Validate Name
    if (!nameInput.value.trim() || nameInput.value.trim().length < 2) {
      groupName.classList.add('has-error');
      isValid = false;
    }

    // Validate Email
    var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailInput.value.trim())) {
      groupEmail.classList.add('has-error');
      isValid = false;
    }

    // Validate Message
    if (!msgInput.value.trim()) {
      groupMsg.classList.add('has-error');
      isValid = false;
    }

    if (!isValid) return;

    // Start simulated submission
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

      // Save to localStorage
      try {
        var existing = JSON.parse(localStorage.getItem('reozix_inquiries') || '[]');
        existing.push(inquiryData);
        localStorage.setItem('reozix_inquiries', JSON.stringify(existing));
      } catch (err) {
        console.warn('Could not save to localStorage', err);
      }

      // Show success state
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

  // Expose to window.RZ
  window.RZ = window.RZ || {};
  window.RZ.contactPopup = new ContactPopupManager();

  // Auto-init on DOMContentLoaded
  var runInit = function() {
    if (window.RZ.contactPopup && typeof window.RZ.contactPopup.init === 'function') {
      window.RZ.contactPopup.init();
    }
  };
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', runInit);
  } else {
    runInit();
  }

  // Helper shortcuts
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

})(window, document);
