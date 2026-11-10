import express from "express";
import { showTrailBySlug, showTrails } from "../controllers/trailController";
import { showRegionBySlug, showRegions } from "../controllers/regionController";

const router = express.Router();

router.get("/", showTrails);
router.get("/trails/:slug", showTrailBySlug);

router.get("/regions", showRegions);
router.get("/regions/:slug", showRegionBySlug);

export default router;
