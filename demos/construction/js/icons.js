// icons.js — injects the shared construction SVG icon sprite once per page.
// Usage: <svg class="ct-ic" aria-hidden="true"><use href="#ct-clock"/></svg>
(function () {
  var sprite = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  sprite.setAttribute('style', 'display:none');
  sprite.setAttribute('aria-hidden', 'true');
  var symbols = {
    'menu': '<line x1="3" y1="7" x2="21" y2="7"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="17" x2="21" y2="17"/>',
    'building': '<rect x="4" y="3" width="12" height="18" rx="1"/><line x1="8" y1="7" x2="8.01" y2="7"/><line x1="12" y1="7" x2="12.01" y2="7"/><line x1="8" y1="11" x2="8.01" y2="11"/><line x1="12" y1="11" x2="12.01" y2="11"/><path d="M16 21v-4a2 2 0 0 1 2-2h2v6"/><path d="M3 21h18"/>',
    'home': '<path d="M3 10.5L12 3l9 7.5"/><path d="M5 9.5V21h14V9.5"/><path d="M10 21v-6h4v6"/>',
    'crane': '<line x1="6" y1="21" x2="6" y2="4"/><line x1="4" y1="4" x2="20" y2="4"/><line x1="16" y1="4" x2="16" y2="9"/><path d="M14.5 9h3l-1.5 3z"/><line x1="3" y1="21" x2="9" y2="21"/>',
    'hammer': '<path d="M14 12l-7.5 7.5a2.1 2.1 0 0 1-3-3L11 9"/><path d="M13 3l4 4 2-2-4-4z"/><path d="M15 9l2 2"/>',
    'doc': '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="8" y1="13" x2="16" y2="13"/><line x1="8" y1="17" x2="14" y2="17"/>',
    'shield': '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>',
    'search': '<circle cx="11" cy="11" r="7"/><line x1="21" y1="21" x2="16" y2="16"/>',
    'clock': '<circle cx="12" cy="12" r="9"/><polyline points="12 7 12 12 15.5 14"/>',
    'ruler': '<rect x="2" y="8" width="20" height="8" rx="1" transform="rotate(-20 12 12)"/><line x1="7" y1="10.6" x2="7.8" y2="13"/><line x1="11" y1="9.4" x2="11.8" y2="11.8"/><line x1="15" y1="8.2" x2="15.8" y2="10.6"/>',
    'check': '<polyline points="20 6 9 17 4 12"/>',
    'phone': '<path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3-8.7A2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 2 .7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.2a2 2 0 0 1 2.1-.5c.9.3 1.9.6 2.8.7a2 2 0 0 1 1.7 2z"/>',
    'mail': '<rect x="2" y="4" width="20" height="16" rx="2"/><polyline points="22 6 12 13 2 6"/>',
    'pin': '<path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0z"/><circle cx="12" cy="10" r="3"/>',
    'arrow': '<line x1="5" y1="12" x2="19" y2="12"/><polyline points="13 6 19 12 13 18"/>',
    'users': '<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20v-1.5A5.5 5.5 0 0 1 8 13h2a5.5 5.5 0 0 1 5.5 5.5V20"/><path d="M16 4.6a3.5 3.5 0 0 1 0 6.8"/><path d="M17.5 13.2A5.5 5.5 0 0 1 21.5 18.5V20"/>',
    'star': '<polygon points="12 2 15.1 8.6 22 9.3 17 14.1 18.2 21 12 17.8 5.8 21 7 14.1 2 9.3 8.9 8.6"/>',
    'close': '<line x1="6" y1="6" x2="18" y2="18"/><line x1="18" y1="6" x2="6" y2="18"/>'
  };
  var html = '';
  Object.keys(symbols).forEach(function (id) {
    html += '<symbol id="ct-' + id + '" viewBox="0 0 24 24">' + symbols[id] + '</symbol>';
  });
  sprite.innerHTML = html;
  document.body.insertBefore(sprite, document.body.firstChild);
})();
