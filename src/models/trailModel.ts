import type { TrailWithRegionData, CreateTrail, UpdateTrail } from "../types";
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

export async function deleteTrailById(id: number): Promise<void> {
  const db = await getDB();

  await db.run(`DELETE FROM trails WHERE id = ?`, [id]);
}

export async function getTrailById(
  id: number,
): Promise<TrailWithRegionData | undefined> {
  const db = await getDB();

  return db.get<TrailWithRegionData>(
    `${TRAIL_REGIONS_JOIN_QUERY}
     WHERE t.id = ?`,
    [id],
  );
}

export async function addTrail(data: CreateTrail): Promise<number> {
  const db = await getDB();

  const result = await db.run(
    `INSERT INTO trails (title, slug, difficulty, distance_km, description, image_url, region_id, created_at)
     VALUES (@title, @slug, @difficulty, @distance_km, @description, @image_url, @region_id, @created_at)`,
    {
      "@title": data.title,
      "@slug": data.slug,
      "@difficulty": data.difficulty,
      "@distance_km": data.distanceKm,
      "@description": data.description,
      "@image_url": data.imageUrl,
      "@region_id": data.regionId,
      "@created_at": data.createdAt,
    },
  );

  return result.lastID!;
}

export async function updateTrail(
  id: number,
  data: Partial<UpdateTrail>,
): Promise<void> {
  const db = await getDB();

  await db.run(
    `UPDATE trails
     SET title = COALESCE(@title, title),
         slug = COALESCE(@slug, slug),
         difficulty = COALESCE(@difficulty, difficulty),
         distance_km = COALESCE(@distance_km, distance_km),
         description = CASE
           WHEN @update_description = 1 THEN @description
           ELSE description
         END,
         image_url = CASE
           WHEN @update_image_url = 1 THEN @image_url
           ELSE image_url
         END,
         region_id = COALESCE(@region_id, region_id)
     WHERE id = @id`,
    {
      "@id": id,
      "@title": data.title ?? null,
      "@slug": data.slug ?? null,
      "@difficulty": data.difficulty ?? null,
      "@distance_km": data.distanceKm ?? null,
      "@description": data.description ?? null,
      "@update_description": data.description !== undefined ? 1 : 0,
      "@image_url": data.imageUrl ?? null,
      "@update_image_url": data.imageUrl !== undefined ? 1 : 0,
      "@region_id": data.regionId ?? null,
    },
  );
}
