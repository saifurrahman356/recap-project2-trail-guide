import { Request, Response } from "express";
import { sanitize } from "../service/sanitizeContentService";
import { slugify } from "../models/utils";
import {
  addTrail,
  deleteTrailById,
  getAllTrails,
  getTrailById,
  getTrailBySlug,
  updateTrail,
} from "../models/trailModel";
import { getAllRegions } from "../models/regionModel";
import {
  getTrimmedString,
  isValidTrailUpdateInput,
  isValidTrailInput,
} from "./utils";
import { CreateTrail, Difficulty } from "../types";
import { renderError } from "../service/errorHandlerService";

export async function showAllTrails(_req: Request, res: Response) {
  try {
    const trails = await getAllTrails();

    res.status(200).render("index.njk", { isAdmin: true, trails });
  } catch (error) {
    renderError(
      res,
      500,
      "Failed to Fetch Trails",
      "Sorry, there was an error fetching the trails.",
    );
  }
}

export async function deleteTrail(_req: Request, res: Response) {
  const trailId = Number(_req.params.id);

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

export async function showEditTrailForm(_req: Request, res: Response) {
  const trailId = Number(_req.params.id);

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

export async function createNewTrail(_req: Request, res: Response) {
  let { title, regionId, difficulty, distanceKm, description, imageUrl } =
    _req.body;

  title = getTrimmedString(title);
  regionId = getTrimmedString(regionId);
  difficulty = getTrimmedString(difficulty);
  distanceKm = getTrimmedString(distanceKm);
  description = getTrimmedString(description);
  imageUrl = getTrimmedString(imageUrl);

  if (
    !isValidTrailInput(
      title,
      regionId,
      difficulty,
      distanceKm,
      description,
      imageUrl,
    )
  ) {
    console.error("Invalid trail input:", {
      title,
      regionId,
      difficulty,
      distanceKm,
      description,
      imageUrl,
    });
    res.status(400).render("error/error.njk", {
      errorTitle: "Failed to Create Trail",
      errorMessage: "Invalid input. Please fill in all required fields.",
      action: "/admin",
      actionText: "Back to all trails",
    });
    return;
  }

  const newTrail = {
    title,
    regionId: Number(regionId),
    difficulty,
    distanceKm: Number(distanceKm),
    description: description !== undefined ? sanitize(description) : "",
    imageUrl,
    createdAt: Math.floor(Date.now() / 1000),
    slug: slugify(title ?? ""),
  };

  if (newTrail.slug === "") {
    console.error("Failed to create new trail: slug is empty");
    renderError(
      res,
      400,
      "Failed to Create Trail",
      "Invalid input. Please fill in all required fields.",
    );
    return;
  }

  if (newTrail.title !== "") {
    const existingTrailWithSlug = await getTrailBySlug(newTrail.slug);
    if (existingTrailWithSlug) {
      console.error("Failed to create new trail: slug already exists");
      renderError(
        res,
        400,
        "Failed to Create Trail",
        "A trail with this title already exists.",
      );
      return;
    }
  }

  try {
    await addTrail(newTrail);
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
    const title = getTrimmedString(req.body.title);
    const regionId = getTrimmedString(req.body.regionId);
    const difficulty = getTrimmedString(req.body.difficulty);
    const distanceKm = getTrimmedString(req.body.distanceKm);
    const description = getTrimmedString(req.body.description);
    const imageUrl = getTrimmedString(req.body.imageUrl);

    const trailId = Number(req.params.id);

    if (!Number.isInteger(trailId) || trailId <= 0) {
      console.error("Invalid trail ID:", trailId);
      return renderError(
        res,
        400,
        "Failed to Update Trail",
        "Not a valid trail ID.",
      );
    }

    const existingTrail = await getTrailById(trailId);

    if (!existingTrail) {
      return renderError(
        res,
        404,
        "Failed to Update Trail",
        "Trail not found.",
      );
    }

    if (
      !isValidTrailUpdateInput(
        title,
        regionId,
        difficulty,
        distanceKm,
        description,
        imageUrl,
      )
    ) {
      console.error("Invalid trail update input:", {
        title,
        regionId,
        difficulty,
        distanceKm,
        description,
        imageUrl,
      });
      return renderError(
        res,
        400,
        "Failed to Update Trail",
        "Invalid input. Please fill in all required fields.",
      );
    }

    const updatedTrailData: Partial<CreateTrail> = {
      title,
      regionId: Number(regionId),
      difficulty: difficulty as Difficulty,
      distanceKm: Number(distanceKm),
      description:
        description !== undefined ? sanitize(description) : undefined,
      imageUrl,
      slug: title ? slugify(title) : undefined,
    };

    if (updatedTrailData.slug && existingTrail.slug !== updatedTrailData.slug) {
      const existingTrailWithSlug = await getTrailBySlug(updatedTrailData.slug);

      if (existingTrailWithSlug) {
        return renderError(
          res,
          400,
          "Failed to Update Trail",
          "Slug already exists for another trail.",
          `/admin/trails/${trailId}/edit`,
          "Back to edit trail",
        );
      }
    }

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
