import { Request, Response } from "express";
import {
  addTrail,
  deleteTrailById,
  getTrailById,
  updateTrail,
} from "../models/trailModel";
import { showPaginatedTrails } from "../service/trailPaginationService";
import { getAllRegions } from "../models/regionModel";
import { TrailUpdateBodyRequest } from "../types";
import { renderError } from "../service/errorHandlerService";
import { getAllTagsForTrail, getTags } from "../models/tagModel";

import {
  prepareNewTrail,
  prepareUpdateTrail,
} from "../service/trailPrepareSerivce";

export async function showAllTrails(req: Request, res: Response) {
  await showPaginatedTrails(req, res, true);
}

export async function deleteTrail(req: Request, res: Response) {
  const trailId = Number(req.params.id);

  if (isNaN(trailId)) {
    renderError(res, 400, "Failed to Fetch Trail", "Not a valid trail ID.");
    return;
  }

  try {
    await deleteTrailById(trailId);
  } catch (error) {
    renderError(
      res,
      500,
      "Failed to Delete Trail",
      "Sorry, there was an error deleting the trail.",
    );
    return;
  }
  res.redirect("/admin");
}

export async function showCreateTrailForm(_req: Request, res: Response) {
  try {
    const regions = await getAllRegions();
    const tags = await getTags();
    res.status(200).render("admin/form.njk", { regions, tags, isEdit: false });
  } catch (error) {
    renderError(
      res,
      500,
      "Failed to Show Create Trail Form",
      "Sorry, there was an error displaying the create trail form.",
    );
  }
}

export async function showEditTrailForm(req: Request, res: Response) {
  const trailId = Number(req.params.id);

  if (isNaN(trailId)) {
    renderError(res, 400, "Failed to Fetch Trail", "Not a valid trail ID.");
    return;
  }

  try {
    const regions = await getAllRegions();
    const trail = await getTrailById(trailId);

    if (!trail) {
      renderError(
        res,
        404,
        "Trail Not Found",
        "The requested trail does not exist.",
      );
      return;
    }

    const tags = await getTags();
    const tagIds = (await getAllTagsForTrail(trailId)).map((tag) => tag.id);
    trail.tagIds = tagIds;
    res
      .status(200)
      .render("admin/form.njk", { trail, regions, tags, isEdit: true, tagIds });
  } catch (error) {
    renderError(
      res,
      500,
      "Failed to Show Edit Trail Form",
      "Sorry, there was an error displaying the edit trail form.",
    );
  }
}

export async function createNewTrail(req: Request, res: Response) {
  try {
    const trailPreparationResult = await prepareNewTrail(req.body);

    if (!trailPreparationResult.success) {
      return renderError(
        res,
        trailPreparationResult.statusCode,
        "Failed to Create Trail",
        trailPreparationResult.errorMessage,
      );
    }

    if (!trailPreparationResult.trail) {
      throw new Error("Failed to create trail: trail data is missing");
    }

    await addTrail(trailPreparationResult.trail);
    res.redirect("/admin");
  } catch (error) {
    console.error("Failed to create new trail:", error);
    renderError(
      res,
      500,
      "Failed to Create Trail",
      "Sorry, there was an error creating the trail.",
    );
  }
}

export async function editTrail(req: Request, res: Response) {
  try {
    const trailId = Number(req.params.id);

    const updatePreperationResult = await prepareUpdateTrail(
      trailId,
      req.body as TrailUpdateBodyRequest,
    );

    if (!updatePreperationResult.success || !updatePreperationResult.trail) {
      return renderError(
        res,
        updatePreperationResult.statusCode,
        "Failed to Update Trail",
        updatePreperationResult.errorMessage,
      );
    }

    const updatedTrailData = updatePreperationResult.trail;
    await updateTrail(trailId, updatedTrailData);

    return res.redirect("/admin");
  } catch (error) {
    console.error("Failed to update trail:", error);

    return renderError(
      res,
      500,
      "Failed to Update Trail",
      "Sorry, there was an error updating the trail.",
    );
  }
}
