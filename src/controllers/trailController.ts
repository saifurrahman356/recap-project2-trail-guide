import type { Request, Response } from "express";
import { getAllTrails, getTrailBySlug } from "../models/trailModel";
import { formatDate } from "./utils";

export async function showTrails(_req: Request, res: Response) {
  const trails = await getAllTrails();
  res.render("index.njk", { trails });
}

export async function showTrailBySlug(
  req: Request<{ slug: string }>,
  res: Response,
) {
  const { slug } = req.params;

  const trail = await getTrailBySlug(slug);

  if (trail) {
    res.render("trail.njk", {
      trail: {
        ...trail,
        createdAt: formatDate(trail.createdAt),
      },
    });
  } else {
    res.status(404).render("error/404.njk");
  }
}
