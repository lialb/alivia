const prefix = process.env.NODE_ENV === "production" ? "/alivia" : "";

export function getAssetPath(src: string) {
  const normalizedSrc = src.startsWith("/") ? src : `/${src}`;
  return `${prefix}${normalizedSrc}`;
}
