export function slugify(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function formatDate(unix: number): string {
  return new Date(unix * 1000).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function getTrimmedString(value: unknown): string | undefined {
  return typeof value === "string" ? value.trim() : undefined;
}

export function isValidSlug(slug: string): boolean {
  return /^[a-z0-9-]+$/.test(slug);
}
