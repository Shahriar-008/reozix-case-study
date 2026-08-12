// Shared utilities for all Reozix demo sites
document.addEventListener('DOMContentLoaded', function() {
  // Mobile nav toggle
  const toggles = document.querySelectorAll('.nav-toggle');
  toggles.forEach(function(toggle) {
    toggle.addEventListener('click', function() {
      const nav = this.parentElement.querySelector('.nav-links');
      if (nav) nav.classList.toggle('open');
    });
  });
});
