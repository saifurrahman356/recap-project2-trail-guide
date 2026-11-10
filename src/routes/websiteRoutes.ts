import express from "express";
import { showTrailBySlug, showTrails } from "../controllers/trailController";

const router = express.Router();

router.get("/", showTrails);

router.get("/trails", showTrails);
router.get("/trails/:slug", showTrailBySlug);

export default router;
