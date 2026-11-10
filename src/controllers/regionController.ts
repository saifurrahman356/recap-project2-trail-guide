import type { Request, Response } from "express";
import { getAllRegions, getRegionBySlug } from "../models/regionModel";
import { getTrailsByRegionId } from "../models/trailModel";

export async function showRegions(_req: Request, res: Response) {
  try {
    const regions = await getAllRegions();
    res.render("regions.njk", { regions });
  } catch (error) {
    res.status(500).render("error/error.njk", {
      errorTitle: "Failed to Fetch Regions",
      errorMessage: "Sorry, there was an error fetching the regions.",
      action: "/regions",
      actionText: "Back to all regions",
    });
  }
}

export async function showRegionBySlug(
  req: Request<{ slug: string }>,
  res: Response,
) {
  const { slug } = req.params;
  const region = await getRegionBySlug(slug);

  if (region) {
    const trails = await getTrailsByRegionId(region.id);
    res.render("region.njk", { region, trails });
  } else {
    res.status(404).render("error/error.njk", {
      errorTitle: "Region Not Found",
      errorMessage: "Sorry, the region you are looking for does not exist.",
      action: "/regions",
      actionText: "Back to all regions",
    });
  }
}
