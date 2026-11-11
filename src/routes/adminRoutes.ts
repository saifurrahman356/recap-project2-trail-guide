import express from "express";
import {
  showAllTrails,
  showCreateTrailForm,
  showEditTrailForm,
  deleteTrail,
  editTrail,
  createNewTrail,
} from "../controllers/adminController";

const router = express.Router();
router.get("/", showAllTrails);
router.get("/trails/new", showCreateTrailForm);
router.get("/trails/:id/edit", showEditTrailForm);
router.post("/trails/", createNewTrail);
router.post("/trails/:id/edit", editTrail);
router.post("/trails/:id/delete", deleteTrail);
export default router;
