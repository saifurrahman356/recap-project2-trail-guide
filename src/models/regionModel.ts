import { Region } from "../types";
import { getDB } from "./db";

export async function getAllRegions(): Promise<Region[]> {
  const db = await getDB();
  const regions = await db.all<
    Region[]
  >(`SELECT id, name, slug, country, description
     FROM regions
     ORDER BY name ASC`);
  return regions;
}

export async function getRegionBySlug(
  slug: string,
): Promise<Region | undefined> {
  const db = await getDB();
  const region = await db.get<Region>("SELECT * FROM regions WHERE slug = ?", [
    slug,
  ]);

  return region;
}

export async function getRegionById(id: number): Promise<Region | undefined> {
  const db = await getDB();
  const region = await db.get<Region>("SELECT * FROM regions WHERE id = ?", [
    id,
  ]);
  return region;
}
