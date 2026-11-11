import type { Request, Response } from "express";
import { deleteTrailById, getAllTrails } from "../models/trailModel";

export async function showAllTrails(_req: Request, res: Response) {
  const trails = await getAllTrails();

  res.status(200).render("index.njk", { isAdmin: true, trails });
}

export async function deleteTrail(_req: Request, res: Response) {
  const trailId = Number(_req.params.id);

  if (isNaN(trailId)) {
    res.status(400).render("err/error.njk", {
      errorTitle: "Failed to Fetch Trail",
      errorMessage: "Sorry, there was an error fetching the trail.",
      action: "/admin/trails",
      actionText: "Back to all trails",
    });
    return;
  }

  try {
    await deleteTrailById(trailId);
  } catch (error) {
    res.status(500).render("err/error.njk", {
      errorTitle: "Failed to Delete Trail",
      errorMessage: "Sorry, there was an error deleting the trail.",
      action: "/admin/trails",
      actionText: "Back to all trails",
    });
    return;
  }
  res.redirect("/admin");
}
