import { Request, Response } from "express";
import {
  addTrail,
  updateTrail,
  getAllTrails,
  getTrailById,
  getTrailBySlug,
  deleteTrailById,
} from "../models/trailModel";
import { getPageInformation } from "../service/trailPaginationService";
import { isValidSlug } from "../utils/utils";
import {
  prepareUpdateTrail,
  prepareNewTrail,
} from "../service/trailPrepareSerivce";
import { TrailUpdateBodyRequest } from "../types";
import { getTrailFilters } from "../service/trailFilterService";
import { getAllTagsForTrail } from "../models/tagModel";

export const showTrails = async (req: Request, res: Response) => {
  try {
    const result = getTrailFilters(req);
    const pageInformation = getPageInformation(req);

    if (!result.success) {
      return res.status(400).json({ message: result.error });
    }

    const paginatedTrails = await getAllTrails(result.filters, pageInformation);
    const trails = paginatedTrails.items;

    return res.status(200).json({
      items: trails,
      total: paginatedTrails.total,
      page: paginatedTrails.page,
      pageSize: paginatedTrails.pageSize,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Error fetching trails",
    });
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

    const trailId = trail.id;
    const trailTags = await getAllTagsForTrail(trailId);

    res.json({ ...trail, tags: trailTags });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: `Error fetching trail: ${slug}` });
  }
};

export const createTrail = async (req: Request, res: Response) => {
  try {
    const trailPreparationResult = await prepareNewTrail(req.body);

    if (!trailPreparationResult.success) {
      return res.status(trailPreparationResult.statusCode).json({
        error: trailPreparationResult.errorMessage,
      });
    }

    if (!trailPreparationResult.trail) {
      throw new Error("Failed to create trail: trail data is missing");
    }

    const addedTrailId = await addTrail(trailPreparationResult.trail);
    const trail = await getTrailById(addedTrailId);
    if (!trail) {
      throw new Error("Failed to create trail: trail not found after creation");
    }

    const trailTags = await getAllTagsForTrail(addedTrailId);

    res.status(201).json({ ...trail, tags: trailTags });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error creating trail" });
  }
};

export const editTrail = async (
  req: Request<{ id: string }>,
  res: Response,
) => {
  try {
    console.log("Request body for update:", req.body);

    const trailId = Number(req.params.id);

    const updatePreperationResult = await prepareUpdateTrail(
      trailId,
      req.body as TrailUpdateBodyRequest,
    );

    if (!updatePreperationResult.success || !updatePreperationResult.trail) {
      return res.status(updatePreperationResult.statusCode).json({
        success: false,
        errorMessage: updatePreperationResult.errorMessage,
      });
    }

    await updateTrail(trailId, updatePreperationResult.trail);

    const updatedTrail = await getTrailById(trailId);

    const updatedTrailTags = await getAllTagsForTrail(trailId);

    return res.status(200).json({ ...updatedTrail, tags: updatedTrailTags });
  } catch (error) {
    console.error("Failed to update trail:", error);

    return res.status(500).json({
      success: false,
      errorMessage: "Sorry, there was an error updating the trail.",
    });
  }
};

export const deleteTrail = async (
  req: Request<{ id: string }>,
  res: Response,
) => {
  try {
    const { id } = req.params;
    const trail = await getTrailById(Number(id));
    if (!trail) {
      return res
        .status(404)
        .json({ message: `Trail to delete not found: ${id}` });
    }
    await deleteTrailById(Number(id));
    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error deleting trail" });
  }
};
