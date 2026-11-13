import { getDB } from "./db";
import type { Tag } from "../types";

export async function getTags(): Promise<Tag[]> {
  const db = await getDB();
  const result = await db.all("SELECT * FROM tags");
  return result;
}

export async function getAllTagsForTrail(trailId: number): Promise<Tag[]> {
  const db = await getDB();
  const result = await db.all(
    "SELECT t.* FROM tags t INNER JOIN trail_tags tt ON t.id = tt.tag_id WHERE tt.trail_id = ?",
    [trailId],
  );
  return result;
}

export async function saveTagsForTrail(
  trailId: number,
  tagIds: number[],
): Promise<void> {
  const db = await getDB();
  await db.run("DELETE FROM trail_tags WHERE trail_id = ?", [trailId]);
  for (const tagId of tagIds) {
    await db.run("INSERT INTO trail_tags (trail_id, tag_id) VALUES (?, ?)", [
      trailId,
      tagId,
    ]);
  }
}
