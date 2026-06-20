// Ambient global types for the LUNR static site analytics layer.
// Used by `tsc --noEmit` to type-check analytics.js (checkJs).

export {};

interface LunrAnalyticsConfig {
  gaMeasurementId?: string | null;
  clarityProjectId?: string | null;
}

declare global {
  interface Window {
    /** Runtime config emitted by build-generated /analytics-config.js. */
    __LUNR_ANALYTICS__?: LunrAnalyticsConfig;
    /** GA4 dataLayer queue. */
    dataLayer: unknown[];
    /** GA4 global command queue function. */
    gtag: (...args: unknown[]) => void;
    /** Microsoft Clarity global. */
    clarity?: (...args: unknown[]) => void;
    /** Exposed for inline HTML event handlers. */
    trackEvent: (name: string, params?: Record<string, unknown>) => void;
  }
}
