// booking.js — Reozix Hotel direct-booking engine.
// Four steps: dates → room & rate → extras & details → confirmation.
// Research-grounded behaviours:
//   - Rate plans per room (Flexible / Saver −14% / Breakfast included)
//   - Transparent GST-inclusive totals from the room step onward
//   - Payment-timing choice (pay on arrival vs pay online now), locked for Saver
//   - Completed steps collapse into summaries (Baymard) instead of vanishing
//   - Sticky mobile bar with the running total

var state = {
  checkin: '', checkout: '', guests: 2,
  room: null, plan: null,
  extras: {},          // id -> true
  payment: 'property'  // 'property' | 'online'
};

function $(id) { return document.getElementById(id); }
function findRoom(id) { return HOTEL_DATA.rooms.filter(function(r) { return r.id === id; })[0] || null; }
function findPlan(id) { return HOTEL_DATA.ratePlans.filter(function(p) { return p.id === id; })[0] || null; }
function nights() { return RZ.nights(state.checkin, state.checkout); }

// --- Pricing ------------------------------------------------------------------

function planPerNight(room, plan) {
  var base = room.rate - Math.round(room.rate * (plan.discount || 0));
  return base + (plan.perNight || 0);
}
function quote() {
  var n = nights();
  var q = { nights: n, lines: [], total: 0 };
  if (!state.room || !state.plan) return q;
  var per = planPerNight(state.room, state.plan);
  var roomTotal = per * n;
  q.lines.push({ label: state.room.name + ' · ' + planShortName(state.plan), value: hotelMoney(per) + ' × ' + n + ' nights', amount: roomTotal });
  Object.keys(state.extras).forEach(function(id) {
    if (!state.extras[id]) return;
    var ex = HOTEL_DATA.extras.filter(function(e) { return e.id === id; })[0];
    if (!ex) return;
    q.lines.push({ label: ex.name, value: 'once per stay', amount: ex.price });
  });
  q.total = q.lines.reduce(function(sum, l) { return sum + l.amount; }, 0);
  return q;
}
function planShortName(plan) {
  if (plan.id === 'saver') return 'Saver';
  if (plan.id === 'breakfast') return 'Breakfast incl.';
  return 'Flexible';
}

// --- Step navigation ----------------------------------------------------------

var currentStep = 1;
function showStep(n) {
  currentStep = n;
  // Non-refundable rates must always be paid online, even when the plan was
  // pre-selected from the URL and no radio change event ever fired.
  if (n >= 3 && state.plan && state.plan.discount) state.payment = 'online';
  document.querySelectorAll('.booking-step').forEach(function(el, i) {
    el.style.display = (i + 1 === n) ? 'block' : 'none';
  });
  document.querySelectorAll('.booking-steps .step').forEach(function(el, i) {
    el.className = 'step';
    if (i + 1 < n) el.classList.add('complete');
    if (i + 1 === n) el.classList.add('active');
  });
  renderDoneSummaries();
  updateSummary();
  updateBar();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Collapsed completed-step summaries (Baymard: never leave a step behind empty)
function renderDoneSummaries() {
  document.querySelectorAll('.done-summary').forEach(function(box) {
    box.innerHTML = '';
  });
  if (currentStep < 2) return;
  var chips = [];
  chips.push(
    '<span class="done-chip"><span class="chip-label">Dates</span> ' +
    RZ.fmtDate(state.checkin) + ' → ' + RZ.fmtDate(state.checkout) + ', ' +
    state.guests + (state.guests === 1 ? ' guest' : ' guests') +
    ' <a href="#" data-goto="1">Edit</a></span>'
  );
  if (currentStep >= 3 && state.room && state.plan) {
    chips.push(
      '<span class="done-chip"><span class="chip-label">' + state.room.name + '</span> ' +
      planShortName(state.plan) + ' <a href="#" data-goto="2">Change</a></span>'
    );
  }
  var box = document.querySelector('.done-summary[data-done-for="' + currentStep + '"]');
  if (box) box.innerHTML = chips.join('');
}
document.addEventListener('click', function(e) {
  var link = e.target.closest('[data-goto]');
  if (!link) return;
  e.preventDefault();
  showStep(parseInt(link.getAttribute('data-goto'), 10));
});

// --- Step 2: rooms with rate plans --------------------------------------------

function renderRoomRates() {
  var grid = $('room-rate-grid');
  grid.innerHTML = '';
  var n = nights();

  HOTEL_DATA.rooms.forEach(function(room) {
    var tooSmall = state.guests > room.maxGuests;
    var left = hotelRoomsLeft(room.id, state.checkin);

    var card = document.createElement('article');
    card.className = 'room-card room-select-card';
    card.id = 'room-card-' + room.id;

    var imgWrap =
      '<div class="room-img" style="height:220px;">' +
        '<img src="https://images.unsplash.com/photo-' + room.imgId + '?w=700&q=80" alt="' + room.name + '" loading="lazy">' +
        (left > 0 && left <= 2 && !tooSmall ? '<span class="urgency">Only ' + left + (left === 1 ? ' room' : ' rooms') + ' left</span>' : '') +
      '</div>';

    var plansHtml = '';
    if (tooSmall) {
      plansHtml =
        '<div style="padding:18px 24px 24px;">' +
        '<p class="too-small-msg" style="font-size:0.875rem;color:#9d3030;">Sleeps up to ' + room.maxGuests +
        ' — too small for your party of ' + state.guests + '.</p></div>';
    } else {
      plansHtml = '<div class="plan-list" style="padding:6px 24px 24px;" role="radiogroup" aria-label="' + room.name + ' rate plans">';
      HOTEL_DATA.ratePlans.forEach(function(plan) {
        var per = planPerNight(room, plan);
        plansHtml +=
          '<label class="plan-option">' +
            '<input type="radio" name="rate-' + room.id + '" value="' + plan.id + '"' +
              (state.room && state.room.id === room.id && state.plan && state.plan.id === plan.id ? ' checked' : '') + '>' +
            '<span class="plan-box">' +
              '<span class="plan-meta">' +
                '<span class="plan-name">' + plan.name + (plan.tag ? ' <span class="plan-tag">' + plan.tag + '</span>' : '') + '</span>' +
                '<span class="plan-summary">' + plan.summary + '</span>' +
                '<span class="plan-summary" style="color:var(--accent-strong);font-weight:500;">' + plan.payment + '</span>' +
              '</span>' +
              '<span class="plan-price">' +
                (plan.discount ? '<span class="plan-old">$' + room.rate + '</span> ' : '') +
                '<span class="pp-night">$' + per + '</span>' +
                '<span class="pp-stay">$' + (per * n).toLocaleString('en-AU') + ' total</span>' +
              '</span>' +
            '</span>' +
          '</label>';
      });
      plansHtml += '</div>';
    }

    card.innerHTML =
      imgWrap +
      '<div class="room-info" style="padding-bottom:8px;">' +
        '<h3>' + room.name + '</h3>' +
        '<p class="sleeps">Sleeps up to ' + room.maxGuests + '</p>' +
        '<p class="desc">' + room.description + '</p>' +
      '</div>' + plansHtml;

    grid.appendChild(card);
  });

  // Desktop-visible continue action (the sticky bar is mobile-only)
  var foot = document.createElement('div');
  foot.className = 'confirm-row';
  foot.style.maxWidth = '720px';
  foot.innerHTML =
    '<button type="button" class="check-btn" id="step2-continue">Continue' +
    '<span class="btn-arrow" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg></span></button>';
  grid.appendChild(foot);
  foot.querySelector('#step2-continue').addEventListener('click', function() {
    if (!state.room || !state.plan) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    showStep(3);
  });

  // One delegated listener handles every room/rate radio
  grid.onchange = function(e) {
    var input = e.target.closest('input[type="radio"]');
    if (!input) return;
    var roomId = input.name.replace('rate-', '');
    state.room = findRoom(roomId);
    state.plan = findPlan(input.value);
    // Saver is pay-online-only
    state.payment = state.plan.discount ? 'online' : state.payment === 'online' ? 'online' : 'property';
    renderPayOptions();
    updateSummary();
    updateBar(true);
  };
}

// --- Step 3: extras, payment timing, summary -----------------------------------

function renderExtras() {
  var list = $('extras-list');
  list.innerHTML = '';
  HOTEL_DATA.extras.forEach(function(ex) {
    var label = document.createElement('label');
    label.className = 'extra-check';
    label.innerHTML =
      '<input type="checkbox" id="extra-' + ex.id + '" data-extra="' + ex.id + '">' +
      '<span class="extra-box">' +
        '<span class="ex-name"><span>' + ex.name + '</span><span class="ex-price">+' + hotelMoney(ex.price) + '</span></span>' +
        '<span class="ex-detail">' + ex.detail + '</span>' +
      '</span>';
    list.appendChild(label);
  });
  list.addEventListener('change', function(e) {
    var cb = e.target.closest('input[data-extra]');
    if (!cb) return;
    state.extras[cb.getAttribute('data-extra')] = cb.checked;
    updateSummary();
    updateBar(true);
  });
}

function renderPayOptions() {
  var wrap = $('pay-options');
  var saverLocked = !!(state.plan && state.plan.discount);
  var options = [
    { id: 'property', title: 'Pay on arrival', desc: 'Nothing charged today. Free cancellation until 48h before check-in.' },
    { id: 'online', title: 'Pay online now', desc: 'Secure card payment at confirmation — one less thing to think about.' }
  ];
  wrap.innerHTML = '';
  options.forEach(function(opt) {
    var locked = saverLocked && opt.id !== 'online';
    var checked = state.payment === opt.id || (locked && opt.id === 'online');
    var l = document.createElement('label');
    l.className = 'pay-opt' + (locked ? ' locked' : '');
    l.innerHTML =
      '<input type="radio" name="payment" value="' + opt.id + '"' + (checked ? ' checked' : '') + (locked ? ' disabled' : '') + '>' +
      '<span class="pay-box"><span class="pay-title">' + opt.title + '</span><span class="pay-desc">' +
      (locked ? 'Required for the non-refundable Saver rate.' : opt.desc) + '</span></span>';
    wrap.appendChild(l);
  });
  wrap.onchange = function(e) {
    var input = e.target.closest('input[name="payment"]');
    if (!input) return;
    state.payment = input.value;
    syncCardFields();
    updateSummary();
  };
}

function updateSummary() {
    syncCardFields();
  if (currentStep < 2) return;
  var q = quote();
  $('sum-dates').textContent = state.checkin ? RZ.fmtDate(state.checkin) + ' → ' + RZ.fmtDate(state.checkout) : '—';
  $('sum-guests').textContent = state.guests + (state.guests === 1 ? ' guest' : ' guests');
  if (state.room && state.plan) {
    var line0 = q.lines[0];
    $('sum-room').textContent = state.room.name;
    $('sum-room-price').textContent = line0 ? line0.value : '';
    var planLine = state.plan.discount ? 'Saver rate applied (−14%)' :
      state.plan.perNight ? 'Breakfast included (+$35/night)' : 'Flexible rate';
    $('sum-plan').textContent = planLine;
    $('sum-plan-price').textContent = '';
    var extrasHtml = '';
    q.lines.slice(1).forEach(function(l) {
      extrasHtml += '<div class="row muted"><span>' + l.label + '</span><span>+' + hotelMoney(l.amount) + '</span></div>';
    });
    $('sum-extras').innerHTML = extrasHtml;
    $('sum-total').textContent = hotelMoney(q.total) + ' AUD';
    $('sum-pay').textContent = state.payment === 'online'
      ? 'Paid online now — no further charge.'
      : 'Nothing to pay today — settle on arrival.';
  } else {
    ['sum-room', 'sum-room-price', 'sum-plan'].forEach(function(id) { $(id).textContent = '—'; });
    $('sum-extras').innerHTML = '';
    $('sum-total').textContent = '—';
    $('sum-pay').textContent = 'Select a room and rate to see your total.';
  }
}

// --- Mobile sticky bar -----------------------------------------------------------

function updateBar(advance) {
  var bar = $('book-bar');
  var q = quote();
  $('bar-label').textContent = currentStep === 2
    ? (state.room ? state.room.name + ' · ' + nights() + (nights() === 1 ? ' night' : ' nights') : 'Select a room')
    : (nights() + (nights() === 1 ? ' night' : ' nights') + ' · ' + state.guests + ' guests');
  $('bar-amount').textContent = (currentStep >= 2 && state.room) ? hotelMoney(q.total) + ' AUD' : 'From $240 AUD';
  $('bar-btn').textContent = currentStep === 1 ? 'Choose room' : currentStep === 2 ? 'Continue' : 'Review';
  var showBar = currentStep >= 1 && currentStep <= 3;
  requestAnimationFrame(function() { bar.classList.toggle('show', showBar); });
}

// --- Validation + confirmation ----------------------------------------------------

function validEmail(email) { return /.+@.+\..+/.test(email); }

function syncCardFields() {
    var wrap = document.getElementById('card-fields');
    if (wrap) wrap.classList.toggle('show', state.payment === 'online');
  }
  function validCard() {
    var num = document.getElementById('card-number').value.replace(/\s+/g, '');
    var exp = document.getElementById('card-exp').value.trim();
    var cvc = document.getElementById('card-cvc').value.trim();
    var numOk = /^\d{15,16}$/.test(num);
    var expOk = /^(0[1-9]|1[0-2])\/\d{2}$/.test(exp);
    var cvcOk = /^\d{3,4}$/.test(cvc);
    ['card-number', 'card-exp', 'card-cvc'].forEach(function (id) {
      document.getElementById(id).classList.remove('invalid');
    });
    var bad = [];
    if (!numOk) bad.push('card-number');
    if (!expOk) bad.push('card-exp');
    if (!cvcOk) bad.push('card-cvc');
    bad.forEach(function (id) { document.getElementById(id).classList.add('invalid'); });
    return { ok: !bad.length, bad: bad };
  }

  function confirmBooking() {
  ['guest-name', 'guest-email', 'guest-phone'].forEach(function(id) { $(id).classList.remove('invalid'); });
  var invalid = [];
  if (!$('guest-name').value.trim()) invalid.push('guest-name');
  if (!validEmail($('guest-email').value.trim())) invalid.push('guest-email');
  if (!$('guest-phone').value.trim()) invalid.push('guest-phone');
  if (invalid.length) {
    invalid.forEach(function(id) { $(id).classList.add('invalid'); });
    var err = $('details-error');
    err.textContent = invalid.length === 1 && invalid[0] === 'guest-email'
      ? 'Please enter a valid email address.'
      : 'Please fill in your name, a valid email, and a phone number.';
    err.classList.add('show');
    err.scrollIntoView({ behavior: 'smooth', block: 'center' });
    return;
  }
  $('details-error').classList.remove('show');
  if (state.payment === 'online') {
    var card = validCard();
    if (!card.ok) {
      var err = $('details-error');
      err.textContent = 'Please check your card details — number, expiry (MM/YY) and CVC.';
      err.classList.add('show');
      err.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }
  }

  var q = quote();
  $('booking-ref').textContent = 'RZH-' + Date.now().toString(36).toUpperCase().slice(-6);
  $('confirm-room').textContent = state.room.name;
  $('confirm-plan').textContent = state.plan.name;
  $('confirm-dates').textContent = RZ.fmtDate(state.checkin) + ' → ' + RZ.fmtDate(state.checkout) +
    ' (' + q.nights + (q.nights === 1 ? ' night' : ' nights') + ')';
  $('confirm-guests').textContent = state.guests + (state.guests === 1 ? ' guest' : ' guests');
  var extras = q.lines.slice(1).map(function(l) { return l.label; });
  if (extras.length) {
    $('confirm-extras-row').style.display = '';
    $('confirm-extras').textContent = extras.join(', ');
  } else {
    $('confirm-extras-row').style.display = 'none';
  }
  $('confirm-total').textContent = hotelMoney(q.total) + ' AUD';
  $('confirm-payment').textContent = state.payment === 'online' ? 'Paid online now' : 'Due on arrival';
  $('confirm-email').textContent = $('guest-email').value.trim();

  // Save to SiteStore CRM leads
  if (window.SiteStore) {
    try {
      window.SiteStore.addLead({
        vertical: 'hotel',
        type: 'booking',
        title: state.room.name + ' (' + q.nights + (q.nights === 1 ? ' night' : ' nights') + ')',
        name: (($('guest-first') ? $('guest-first').value : '') + ' ' + ($('guest-last') ? $('guest-last').value : '')).trim() || 'Guest',
        email: $('guest-email').value.trim(),
        phone: $('guest-phone') ? $('guest-phone').value.trim() : '',
        amount: q.total,
        details: {
          room: state.room.name,
          plan: state.plan.name,
          checkin: state.checkin,
          checkout: state.checkout,
          guests: state.guests,
          extras: extras,
          payment: state.payment === 'online' ? 'Paid online now' : 'Due on arrival'
        }
      });
    } catch (e) {}
  }

  showStep(4);
}

// --- Init -------------------------------------------------------------------------

document.addEventListener('DOMContentLoaded', function() {
  var fromUrl = RZ.stayFromUrl();
  function defaultDates() {
    var d = new Date(); d.setDate(d.getDate() + 7);
    var o = new Date(d); o.setDate(o.getDate() + 2);
    return { checkin: RZ.iso(d), checkout: RZ.iso(o) };
  }
  var fb = defaultDates();
  state.checkin = fromUrl.checkin || fb.checkin;
  state.checkout = fromUrl.checkout || fb.checkout;
  if (fromUrl.guests >= 1 && fromUrl.guests <= 4) state.guests = fromUrl.guests;

  var params = new URLSearchParams(window.location.search);
  var preselect = params.get('plan');
  state.room = findRoom(params.get('room')) || null;
  state.plan = preselect ? findPlan(preselect) : null;
  if (state.room && state.guests > state.room.maxGuests) { state.room = null; state.plan = null; }

  /* Dates step */
  $('checkin').value = state.checkin;
  $('checkout').value = state.checkout;
  $('checkin').min = RZ.iso(new Date());
  syncCheckoutMin();
  $('guests').value = String(state.guests);
  $('checkin').addEventListener('change', syncCheckoutMin);

  $('dates-form').addEventListener('submit', function(e) {
    e.preventDefault();
    var err = $('dates-error');
    err.classList.remove('show');
    state.checkin = $('checkin').value;
    state.checkout = $('checkout').value;
    state.guests = parseInt($('guests').value, 10) || 2;
    if (!state.checkin || !state.checkout) {
      err.textContent = 'Select both a check-in and a check-out date.'; err.classList.add('show'); return;
    }
    if (!nights()) {
      err.textContent = 'Check-out must be at least one night after check-in.'; err.classList.add('show'); return;
    }
    renderRoomRates();
    showStep(2);
  });

  $('back-to-dates').addEventListener('click', function() { showStep(1); });
  $('back-to-room').addEventListener('click', function() { showStep(2); });
  $('details-form').addEventListener('submit', function(e) { e.preventDefault(); confirmBooking(); });
  $('bar-btn').addEventListener('click', function() {
    if (currentStep === 1) { $('dates-form').requestSubmit ? $('dates-form').requestSubmit() : $('next-btn').click(); }
    else if (currentStep === 2) {
      if (!state.room || !state.plan) {
        window.scrollTo({ top: document.getElementById('room-rate-grid').offsetTop - 100, behavior: 'smooth' });
        return;
      }
      showStep(3);
    } else if (currentStep === 3) {
      confirmBooking();
    }
  });

  renderExtras();
  renderPayOptions();
  showStep(1);

  function syncCheckoutMin() {
    if (!$('checkin').value) return;
    var d = new Date($('checkin').value + 'T12:00'); d.setDate(d.getDate() + 1);
    $('checkout').min = RZ.iso(d);
  }
});
