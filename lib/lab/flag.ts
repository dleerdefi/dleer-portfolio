// The lab's feature flag. NEXT_PUBLIC_* is inlined at build time: redeploy after changing it.
export const labEnabled = () => process.env.NEXT_PUBLIC_FEATURE_LAB === 'true';
