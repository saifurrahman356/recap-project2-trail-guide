export interface Region {
  id: number;
  name: string;
  slug: string;
  country: string;
  description: string | null;
}

export type Difficulty = "easy" | "moderate" | "hard";

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

export interface TrailWithRegionData extends Trail {
  regionName: string;
  regionCountry: string;
}
