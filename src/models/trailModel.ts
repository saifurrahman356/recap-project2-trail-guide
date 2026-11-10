import type { TrailWithRegionData } from "../types";
import { getDB } from "./db";

const TRAIL_REGIONS_JOIN_QUERY = `
  SELECT
    t.id,
    t.title,
    t.slug,
    t.difficulty,
    t.distance_km AS distanceKm,
    t.description,
    t.image_url AS imageUrl,
    t.region_id AS regionId,
    t.created_at AS createdAt,
    r.name AS regionName,
    r.country AS regionCountry
  FROM trails t
  INNER JOIN regions r ON t.region_id = r.id
`;

export async function getAllTrails(): Promise<TrailWithRegionData[]> {
  const db = await getDB();

  return db.all<TrailWithRegionData[]>(
    `${TRAIL_REGIONS_JOIN_QUERY}
     ORDER BY t.created_at DESC`,
  );
}

export async function getTrailBySlug(
  slug: string,
): Promise<TrailWithRegionData | undefined> {
  const db = await getDB();

  return db.get<TrailWithRegionData>(
    `${TRAIL_REGIONS_JOIN_QUERY}
     WHERE t.slug = ?`,
    [slug],
  );
}

export async function getTrailsByRegionId(
  regionId: number,
): Promise<TrailWithRegionData[]> {
  const db = await getDB();

  return db.all<TrailWithRegionData[]>(
    `${TRAIL_REGIONS_JOIN_QUERY}
     WHERE t.region_id = ?`,
    [regionId],
  );
}
