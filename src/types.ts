export interface Region {
  id: number;
  name: string;
  slug: string;
  country: string;
  description: string | null;
}

export interface Trail {
  id: number;
  title: string;
  slug: string;
  difficulty: Difficulty;
  distanceKm: number;
  description: string | null;
  imageUrl: string | null;
  regionId: number;
  createdAt: number;
}

export type CreateTrail = Omit<Trail, "id">;
export type UpdateTrail = Omit<CreateTrail, "createdAt">;

export interface TrailWithRegionData extends Trail {
  regionName: string;
  regionCountry: string;
}

export const DIFFICULTIES = ["easy", "moderate", "hard"] as const;

export type Difficulty = (typeof DIFFICULTIES)[number];

export function isDifficulty(value: unknown): value is Difficulty {
  return DIFFICULTIES.some((difficulty) => difficulty === value);
}
