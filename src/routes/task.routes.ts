import express from "express";
import { AuthMiddleWare } from "../utils/authMiddleware";
import { CreateTask, DeleteTask, GetTask, UpdateTask } from "../controllers/task.controller";

const router = express.Router();

router.post("/createTask",AuthMiddleWare,CreateTask)
router.get("/getTask",AuthMiddleWare,GetTask)
router.delete("/deleteTask/:id",AuthMiddleWare,DeleteTask)
router.put("/updateTask/:id",AuthMiddleWare,UpdateTask)

export default router;