import { Request, response, Response } from "express";
import { TaskModel } from "../models/tasks/taskModel";

export const CreateTask = async (req: Request, res: Response) => {
  try {
    const taskDetails = req.body;

    console.log("helllloo",taskDetails)

    if (!taskDetails) {
      return res.status(400).json({ message: "Task Details Not Found" });
    }

    const userId = (req as any).user.id;

    const newTask = await TaskModel.create({
      ...taskDetails,
      creater: userId,
    });

    return res
      .status(201)
      .json({ message: "Task Created Successfully", newTask });
  } catch (error) {
    return res.status(500).json({ message: "Server Error", error });
  }
};

export const GetTask = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const tasks = await TaskModel.find({ creater: userId });
    return res.status(200).json({ tasks });
  } catch (error) {
    return res.status(500).json({ message: "Server Error" });
  }
};

export const DeleteTask = async (req: Request, res: Response) => {
  try {
    const taskId = req.params.id;
    await TaskModel.findByIdAndDelete(taskId);
    return res.status(200).json({ message: "Task Deleted Successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Server Error" });
  }
};

export const UpdateTask = async (req: Request, res: Response) => {
  try {
    const taskId = req.params.id;
    const updatedData = req.body;
    await TaskModel.findByIdAndUpdate(taskId, {
      ...updatedData,
    });
    return res.status(200).json({ message: "Task Updated Successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Server Error" });
  }
};
