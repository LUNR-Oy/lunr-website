// @ts-check
/**
 * LUNR analytics — Google Analytics 4 + Microsoft Clarity loader and event helper.
 *
 * Configuration is read at runtime from `window.__LUNR_ANALYTICS__`, which is
 * emitted by the build-generated `/analytics-config.js` from environment
 * variables (NEXT_PUBLIC_GA_MEASUREMENT_ID / NEXT_PUBLIC_CLARITY_PROJECT_ID).
 *
 * Design guarantees:
 *  - If an ID is missing, that tool is simply not loaded — no errors, no warnings.
 *  - `trackEvent` is always safe to call: it is a no-op when gtag is unavailable
 *    and never throws.
 *  - No IDs are hardcoded anywhere in this file.
 *
 * This module is loaded with `<script type="module">`. Because inline HTML event
 * handlers cannot see module scope, `trackEvent` is also exposed on `window` so
 * existing inline handlers can call it. The `export` keeps it tree-shakeable for
 * any future bundled usage.
 */

/**
 * @typedef {Object} LunrAnalyticsConfig
 * @property {string|null} [gaMeasurementId]   GA4 Measurement ID (G-XXXXXXX).
 * @property {string|null} [clarityProjectId]  Microsoft Clarity project ID.
 */

/** @returns {LunrAnalyticsConfig} */
function getConfig() {
  if (typeof window === "undefined") return {};
  return window.__LUNR_ANALYTICS__ || {};
}

/**
 * Track a custom analytics event. Safe no-op when GA is unavailable.
 *
 * @param {string} name - GA4 event name (e.g. "waitlist_signup").
 * @param {Record<string, unknown>} [params] - Optional event parameters.
 * @returns {void}
 */
export function trackEvent(name, params) {
  if (typeof window === "undefined") return;
  if (typeof window.gtag !== "function") return;
  try {
    window.gtag("event", name, params || {});
  } catch {
    /* analytics must never break the page */
  }
}

/**
 * Inject GA4 (gtag.js) and configure the property. Page views are tracked
 * automatically by the default `config` call.
 *
 * @param {string} id - GA4 Measurement ID.
 * @returns {void}
 */
function loadGA4(id) {
  const tag = document.createElement("script");
  tag.async = true;
  tag.src =
    "https://www.googletagmanager.com/gtag/js?id=" + encodeURIComponent(id);
  document.head.appendChild(tag);

  window.dataLayer = window.dataLayer || [];
  function gtag() {
    window.dataLayer.push(arguments);
  }
  window.gtag = window.gtag || gtag;
  window.gtag("js", new Date());
  window.gtag("config", id);
}

/**
 * Inject the Microsoft Clarity tag using its current recommended loader.
 *
 * @param {string} id - Clarity project ID.
 * @returns {void}
 */
function loadClarity(id) {
  /** @type {any} */
  const clarity =
    window.clarity ||
    function () {
      (clarity.q = clarity.q || []).push(arguments);
    };
  window.clarity = clarity;

  const tag = document.createElement("script");
  tag.async = true;
  tag.src = "https://www.clarity.ms/tag/" + encodeURIComponent(id);

  const first = document.getElementsByTagName("script")[0];
  if (first && first.parentNode) {
    first.parentNode.insertBefore(tag, first);
  } else {
    document.head.appendChild(tag);
  }
}

/**
 * Read config and load whichever tools have an ID configured. Also exposes
 * `trackEvent` on `window` for inline handlers.
 *
 * @returns {void}
 */
export function initAnalytics() {
  if (typeof window === "undefined" || typeof document === "undefined") return;

  // Expose for inline HTML handlers regardless of whether GA loads, so calls
  // are always safe no-ops rather than ReferenceErrors.
  window.trackEvent = trackEvent;

  const { gaMeasurementId, clarityProjectId } = getConfig();
  if (gaMeasurementId) loadGA4(gaMeasurementId);
  if (clarityProjectId) loadClarity(clarityProjectId);
}

initAnalytics();
