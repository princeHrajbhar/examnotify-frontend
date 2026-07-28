// Central helper for building CDN (CloudFront) asset URLs.
//
// Base can be overridden per-environment via NEXT_PUBLIC_ASSET_BASE_URL,
// otherwise it defaults to the production CloudFront domain.
export const CDN_BASE = (
  process.env.NEXT_PUBLIC_ASSET_BASE_URL || "https://sn.shikshanation.com"
).replace(/\/+$/, "");

/**
 * Build a full CDN URL from a relative path or bare filename.
 *   cdn("saurabh-kumar.webp")  -> https://sn.shikshanation.com/saurabh-kumar.webp
 *   cdn("/skillo/hero.webp")   -> https://sn.shikshanation.com/skillo/hero.webp
 * Absolute URLs are returned unchanged.
 */
export const cdn = (path: string): string => {
  if (!path) return "";
  if (/^https?:\/\//i.test(path)) return path;
  return `${CDN_BASE}/${path.replace(/^\/+/, "")}`;
};
