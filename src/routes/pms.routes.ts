import express from "express";
import { CreateProject, getAllProjects, updateProjectCards } from "../controllers/pms.controller";
import { AuthMiddleWare } from "../utils/authMiddleware";

const router = express.Router();

router.post("/createProject",AuthMiddleWare, CreateProject);
router.get("/getProjects",AuthMiddleWare, getAllProjects);
router.put("/updateProject/:id",AuthMiddleWare,updateProjectCards)

export default router;