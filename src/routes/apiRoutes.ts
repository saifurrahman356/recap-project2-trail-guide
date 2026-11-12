import express from "express";
import {
  showRegions,
  showTrailsByRegion,
} from "../controllers/apiRegionController";
import {
  showTrail,
  showTrails,
  createTrail,
  deleteTrail,
  editTrail,
} from "../controllers/apiTrailController";
import { apiKeyMiddleware } from "../middleware/apiKey";

const router = express.Router();
router.get("/trails", showTrails);
router.get("/trails/:slug", showTrail);
router.get("/regions", showRegions);
router.get("/regions/:slug/trails", showTrailsByRegion);

router.use(apiKeyMiddleware);
router.post("/trails", createTrail);
router.put("/trails/:id", editTrail);
router.delete("/trails/:id", deleteTrail);

export default router;
