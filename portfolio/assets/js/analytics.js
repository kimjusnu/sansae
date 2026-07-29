/**
 * Cloudflare Web Analytics.
 *
 * Chosen over GA4 for one reason: it sets no cookies, so the site needs no
 * consent banner. On a portfolio the first thing a recruiter sees matters more
 * than the richer reporting GA4 would give. It is also lighter (~5KB) and less
 * often blocked, which counts when most visitors are developers.
 *
 * The beacon is cookieless and does not follow anyone between sites, so there
 * is no cross-site profile for Do Not Track to opt out of; DNT is deliberately
 * not consulted.
 *
 * Set TOKEN below and it starts reporting. Leave it empty and nothing is
 * loaded at all — an unconfigured build makes no third-party request.
 */
(function () {
  'use strict';

  // dash.cloudflare.com → Web Analytics → Add a site → JS snippet의 token 값
  var TOKEN = '';

  // The token is issued per hostname, so local and preview traffic would only
  // add noise to the real numbers.
  var HOST = 'kimjusnu.github.io';

  if (!TOKEN || window.location.hostname !== HOST) return;

  var script = document.createElement('script');
  script.defer = true;
  script.src = 'https://static.cloudflareinsights.com/beacon.min.js';
  script.setAttribute('data-cf-beacon', JSON.stringify({ token: TOKEN }));
  document.head.appendChild(script);
})();
