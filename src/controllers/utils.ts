import { isDifficulty } from "../types";

export function formatDate(unix: number): string {
  return new Date(unix * 1000).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function isValidTrailInput(
  title: unknown,
  regionId: unknown,
  difficulty: unknown,
  distanceKm: unknown,
  description: unknown,
  imageUrl: unknown,
): boolean {
  return (
    typeof title === "string" &&
    title.trim() !== "" &&
    typeof regionId === "string" &&
    Number.isInteger(Number(regionId)) &&
    Number(regionId) > 0 &&
    typeof difficulty === "string" &&
    isDifficulty(difficulty) &&
    typeof distanceKm === "string" &&
    Number.isFinite(Number(distanceKm)) &&
    Number(distanceKm) > 0 &&
    (description === undefined || typeof description === "string") &&
    (imageUrl === undefined || typeof imageUrl === "string")
  );
}

export function isValidTrailUpdateInput(
  title: unknown,
  regionId: unknown,
  difficulty: unknown,
  distanceKm: unknown,
  description: unknown,
  imageUrl: unknown,
): boolean {
  return (
    (title === undefined ||
      (typeof title === "string" && title.trim() !== "")) &&
    (regionId === undefined ||
      (typeof regionId === "string" &&
        Number.isInteger(Number(regionId)) &&
        Number(regionId) > 0)) &&
    (difficulty === undefined || isDifficulty(difficulty)) &&
    (distanceKm === undefined ||
      (typeof distanceKm === "string" &&
        Number.isFinite(Number(distanceKm)) &&
        Number(distanceKm) > 0)) &&
    (description === undefined || typeof description === "string") &&
    (imageUrl === undefined || typeof imageUrl === "string")
  );
}

export function getTrimmedString(value: unknown): string | undefined {
  return typeof value === "string" ? value.trim() : undefined;
}

export function isValidSlug(slug: string): boolean {
  return /^[a-z0-9-]+$/.test(slug);
}
