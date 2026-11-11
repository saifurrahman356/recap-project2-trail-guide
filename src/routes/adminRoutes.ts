import express from "express";
import { showAllTrails } from "../controllers/adminController";
import { deleteTrail } from "../controllers/adminController";

const router = express.Router();
router.get("/", showAllTrails);
router.post("/trails/:id/delete", deleteTrail);
export default router;
