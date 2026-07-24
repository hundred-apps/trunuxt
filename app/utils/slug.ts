export const formatSlug = (text: string): string => {
  if (!text) return "";

  return text
    .toLowerCase()
    .replace(/\b\w/g, (char) => char.toUpperCase())
    .replace(/[^a-zA-Z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
};

// Atau versi simple (tanpa capitalize)
export const formatSlugSimple = (text: string): string => {
  if (!text) return "";

  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
};
