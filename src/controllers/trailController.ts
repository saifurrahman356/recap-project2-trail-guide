import type { Request, Response } from "express";
import { getAllTrails, getTrailBySlug } from "../models/trailModel";
import { getTrailFilters } from "../service/trailFilterService";
import { renderError } from "../service/errorHandlerService";
import { formatDate } from "../utils/utils";

export async function showTrails(req: Request, res: Response) {
  try {
    const result = getTrailFilters(req);

    if (!result.success) {
      return renderError(res, 400, "Invalid Filters", result.error);
    }

    const trails = await getAllTrails(result.filters);

    return res.status(200).render("index.njk", {
      trails,
      q: result.filters.q ?? "",
      showSearch: true,
    });
  } catch (error) {
    console.error(error);

    return renderError(
      res,
      500,
      "Failed to Fetch Trails",
      "Sorry, there was an error fetching the trails.",
    );
  }
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
