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
