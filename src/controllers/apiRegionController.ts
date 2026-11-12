import { Request, Response } from "express";
import { isValidSlug } from "../utils/utils";
import { getAllRegions } from "../models/regionModel";
import { getTrailsByRegionSlug } from "../models/trailModel";

export const showRegions = async (_req: Request, res: Response) => {
  try {
    const regions = await getAllRegions();
    res.json({
      regions,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching regions" });
  }
};

export const showTrailsByRegion = async (
  req: Request<{ slug: string }>,
  res: Response,
) => {
  const { slug } = req.params;

  if (!isValidSlug(slug)) {
    return res.status(400).json({ message: `Invalid slug: ${slug}` });
  }

  try {
    const trails = await getTrailsByRegionSlug(slug);

    if (trails.length === 0) {
      return res
        .status(404)
        .json({ message: `No trails found for region: ${slug}` });
    }

    res.json({ trails });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: `Error fetching trails for region: ${slug}` });
  }
};
