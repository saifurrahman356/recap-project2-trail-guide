import type { Request, Response } from "express";
import { getTrailBySlug } from "../models/trailModel";
import { showPaginatedTrails } from "../service/trailPaginationService";
import { renderError } from "../service/errorHandlerService";
import { formatDate } from "../utils/utils";

export async function showTrails(req: Request, res: Response) {
  await showPaginatedTrails(req, res, false);
}

export async function showTrailBySlug(
  req: Request<{ slug: string }>,
  res: Response,
) {
  const { slug } = req.params;

  const trail = await getTrailBySlug(slug);

  if (trail) {
    res.status(200).render("trail.njk", {
      trail: {
        ...trail,
        createdAt: formatDate(trail.createdAt),
      },
    });
  } else {
    return renderError(
      res,
      404,
      "Trail Not Found",
      "Sorry, the trail you are looking for does not exist.",
      "/",
      "Back to all trails",
    );
  }
}
