import type { TrailWithRegionData } from "../types";
import { getDB } from "./db";

export async function getAllTrails(): Promise<TrailWithRegionData[]> {
  const db = await getDB();
  const trails = await db.all<TrailWithRegionData[]>(
    `SELECT
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
     JOIN regions r ON t.region_id = r.id ORDER BY t.created_at DESC`,
  );

  return trails;
}

export async function getTrailBySlug(
  slug: string,
): Promise<TrailWithRegionData | undefined> {
  const db = await getDB();
  const trail = await db.get<TrailWithRegionData>(
    `SELECT
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
     JOIN regions r ON t.region_id = r.id
     WHERE t.slug = ?`,
    [slug],
  );

  return trail;
}
