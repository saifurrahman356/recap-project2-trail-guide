import { Request, Response } from "express";
import { getAllTrails, getTrailBySlug } from "../models/trailModel";
import { isValidSlug } from "./utils";

export const showTrails = async (_req: Request, res: Response) => {
  try {
    const trails = await getAllTrails();
    res.json({ trails });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching trails" });
  }
};

export const showTrail = async (
  req: Request<{ slug: string }>,
  res: Response,
) => {
  const { slug } = req.params;

  if (!isValidSlug(slug)) {
    return res.status(400).json({ message: `Invalid slug: ${slug}` });
  }

  try {
    const trail = await getTrailBySlug(slug);
    if (!trail) {
      return res.status(404).json({ message: `Trail not found: ${slug}` });
    }

    res.json({ trail });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: `Error fetching trail: ${slug}` });
  }
};
