// booking.js — step navigation
var currentStep = 1;
function showStep(n) {
  document.querySelectorAll('.booking-step').forEach(function(el, i) {
    el.style.display = (i + 1 === n) ? 'block' : 'none';
  });
  document.querySelectorAll('.booking-steps .step').forEach(function(el, i) {
    el.className = 'step';
    if (i + 1 < n) el.classList.add('complete');
    if (i + 1 === n) el.classList.add('active');
  });
  currentStep = n;
}
function confirmBooking() {
  var ref = 'RZH-' + Date.now().toString(36).toUpperCase().slice(-6);
  document.getElementById('booking-ref').textContent = ref;
  showStep(4); // Confirmation step
}
