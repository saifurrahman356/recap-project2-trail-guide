import express from "express";
import {
  showRegions,
  showTrailsByRegion,
} from "../controllers/apiRegionController";
import { showTrail, showTrails } from "../controllers/apiTrailController";

const router = express.Router();
router.get("/trails", showTrails);
router.get("/trails/:slug", showTrail);
router.get("/regions", showRegions);
router.get("/regions/:slug/trails", showTrailsByRegion);

export default router;
