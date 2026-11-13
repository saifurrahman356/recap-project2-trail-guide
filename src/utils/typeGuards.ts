import {
  isDifficulty,
  UpdateTrail,
  type CreateTrail,
  type TrailBodyRequest,
} from "../types";

export function isValidCreateTrail(
  input: TrailBodyRequest,
): input is CreateTrail {
  return (
    typeof input.title === "string" &&
    input.title.trim() !== "" &&
    (typeof input.regionId === "string" ||
      typeof input.regionId === "number") &&
    Number.isInteger(Number(input.regionId)) &&
    Number(input.regionId) > 0 &&
    typeof input.difficulty === "string" &&
    isDifficulty(input.difficulty) &&
    (typeof input.distanceKm === "string" ||
      typeof input.distanceKm === "number") &&
    Number.isFinite(Number(input.distanceKm)) &&
    Number(input.distanceKm) > 0 &&
    (input.description === undefined ||
      typeof input.description === "string") &&
    (input.imageUrl === undefined || typeof input.imageUrl === "string") &&
    (input.tagIds === undefined || Array.isArray(input.tagIds))
  );
}

export function isValidUpdateTrail(
  input: TrailBodyRequest,
): input is UpdateTrail {
  const hasAtLeastOneField = Object.values(input).some(
    (value) => value !== undefined,
  );

  return (
    hasAtLeastOneField &&
    (input.title === undefined ||
      (typeof input.title === "string" && input.title.trim() !== "")) &&
    (input.regionId === undefined ||
      ((typeof input.regionId === "string" ||
        typeof input.regionId === "number") &&
        Number.isInteger(Number(input.regionId)) &&
        Number(input.regionId) > 0)) &&
    (input.difficulty === undefined ||
      (typeof input.difficulty === "string" &&
        isDifficulty(input.difficulty))) &&
    (input.distanceKm === undefined ||
      ((typeof input.distanceKm === "string" ||
        typeof input.distanceKm === "number") &&
        Number.isFinite(Number(input.distanceKm)) &&
        Number(input.distanceKm) > 0)) &&
    (input.description === undefined ||
      typeof input.description === "string") &&
    (input.imageUrl === undefined || typeof input.imageUrl === "string") &&
    (input.tagIds === undefined || Array.isArray(input.tagIds))
  );
}
