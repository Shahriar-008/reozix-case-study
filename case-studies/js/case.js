(function () {
  'use strict';
  document.documentElement.classList.add('js');
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var hasIO = 'IntersectionObserver' in window;

  /* Reveal on scroll */
  var revealEls = Array.prototype.slice.call(document.querySelectorAll('.reveal'));
  if (hasIO && !reduce) {
    var ro = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('revealed'); ro.unobserve(e.target); }
      });
    }, { threshold: 0.12 });
    revealEls.forEach(function (el) { ro.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('revealed'); });
  }

  /* Progress rail active state */
  var railLinks = Array.prototype.slice.call(document.querySelectorAll('.progress-rail a[href^="#"]'));
  if (railLinks.length && hasIO) {
    var map = {};
    railLinks.forEach(function (l) { map[l.getAttribute('href').slice(1)] = l; });
    var so = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        var link = map[e.target.id];
        if (!link) return;
        railLinks.forEach(function (l) { l.classList.remove('active'); });
        link.classList.add('active');
      });
    }, { rootMargin: '-40% 0px -55% 0px' });
    Object.keys(map).forEach(function (id) {
      var sec = document.getElementById(id);
      if (sec) so.observe(sec);
    });
  }

  /* Sticky mobile CTA after the hero leaves the viewport */
  var pill = document.querySelector('.sticky-cta');
  var hero = document.querySelector('.hero');
  if (pill && hero && hasIO) {
    new IntersectionObserver(function (entries) {
      var past = !entries[0].isIntersecting;
      if (past !== pill.classList.contains('visible')) {
        pill.classList.toggle('visible', past);
      }
    }, { threshold: 0 }).observe(hero);
  }

  /* Metric count-up */
  function countUp(el) {
    var m = el.textContent.match(/^([\d.]+)(.*)$/);
    if (!m) return;
    var end = parseFloat(m[1]);
    if (isNaN(end)) return;
    var decimals = (m[1].split('.')[1] || '').length;
    var suffix = m[2];
    var start = null, dur = 900;
    function step(ts) {
      if (start === null) start = ts;
      var p = Math.min((ts - start) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = (end * eased).toFixed(decimals) + suffix;
      if (p < 1) window.requestAnimationFrame(step);
    }
    window.requestAnimationFrame(step);
  }
  var counters = Array.prototype.slice.call(document.querySelectorAll('[data-countup]'));
  if (counters.length && hasIO && !reduce) {
    var co = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { countUp(e.target); co.unobserve(e.target); }
      });
    }, { threshold: 0.5 });
    counters.forEach(function (el) { co.observe(el); });
  }
})();
