import { Request, Response } from "express";
import {
  addTrail,
  deleteTrailById,
  getAllTrails,
  getTrailById,
  updateTrail,
} from "../models/trailModel";
import { getAllRegions } from "../models/regionModel";
import { TrailUpdateBodyRequest } from "../types";
import { renderError } from "../service/errorHandlerService";
import { getTrailFilters } from "../service/trailFilterService";
import {
  prepareNewTrail,
  prepareUpdateTrail,
} from "../service/trailPrepareSerivce";

export async function showAllTrails(req: Request, res: Response) {
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
      isAdmin: true,
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
    res.status(200).render("admin/form.njk", { regions, isEdit: false });
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

    res.status(200).render("admin/form.njk", { trail, regions, isEdit: true });
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
