// Custom next/image loader.
//
// Instead of proxying images through Next's own optimizer (/_next/image?url=...),
// this returns the source URL directly with width/quality query params, e.g.
//   https://sn.shikshanation.com/skillo/hero.webp?w=256&q=75
//
// The CDN (CloudFront) serves the object directly; the ?w/?q params are harmless
// (ignored by plain S3/CloudFront) and keep Next's responsive srcset intact.

interface ImageLoaderProps {
  src: string;
  width: number;
  quality?: number;
}

export default function cdnImageLoader({ src, width, quality }: ImageLoaderProps): string {
  const q = quality || 75;
  const sep = src.includes("?") ? "&" : "?";
  return `${src}${sep}w=${width}&q=${q}`;
}
