import express from "express";
import { AuthMiddleWare } from "../utils/authMiddleware";
import { CreateTask, DeleteTask, GetTask } from "../controllers/task.controller";

const router = express.Router();

router.post("/createTask",AuthMiddleWare,CreateTask)
router.get("/getTask",AuthMiddleWare,GetTask)
router.delete("/deleteTask/:id",AuthMiddleWare,DeleteTask)

export default router;