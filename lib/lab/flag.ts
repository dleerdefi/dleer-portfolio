// The lab's feature flags. NEXT_PUBLIC_* is inlined at build time: redeploy after changing them.
export const labEnabled = () => process.env.NEXT_PUBLIC_FEATURE_LAB === 'true';

/**
 * The threat map: /lab/threats, its two API routes and every threats entry point. Off by
 * default, and it only counts while the lab is on; with it off the lab is telemetry only.
 */
export const labThreatsEnabled = () => labEnabled() && process.env.NEXT_PUBLIC_FEATURE_LAB_THREATS === 'true';
