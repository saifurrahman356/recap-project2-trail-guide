import type { Request } from "express";
import { isDifficulty, TrailFiltersResult } from "../types";

export function getTrailFilters(req: Request): TrailFiltersResult {
  const { region, difficulty, q } = req.query;

  if (
    difficulty !== undefined &&
    (typeof difficulty !== "string" || !isDifficulty(difficulty))
  ) {
    return {
      success: false,
      error: "Invalid difficulty. Use easy, moderate or hard.",
    };
  }

  if (region !== undefined && (typeof region !== "string" || !region.trim())) {
    return {
      success: false,
      error: "Invalid region.",
    };
  }

  if (q !== undefined && (typeof q !== "string" || !q.trim())) {
    return {
      success: false,
      error: "Invalid search query.",
    };
  }

  return {
    success: true,
    filters: {
      region: typeof region === "string" ? region : undefined,
      difficulty: typeof difficulty === "string" ? difficulty : undefined,
      q: typeof q === "string" ? q.trim() : undefined,
    },
  };
}
