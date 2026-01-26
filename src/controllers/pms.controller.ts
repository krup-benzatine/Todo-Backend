import { Request, Response } from "express";
import { ProjectModel } from "../models/pms/projectList";

export const CreateProject = async (req: Request, res: Response) => {
  try {
    const projectDetails = req.body;
    const userId = (req as any).user.id;
    const newProject = await ProjectModel.create({
      ...projectDetails,
      creater: userId,
    });
    return res
      .status(201)
      .json({ message: "Project Created Successfully", newProject });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getAllProjects = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user.id;
    const userEmail = (req as any).user.email;
    const projects = await ProjectModel.find({ creater: user });
    const assignedProjects = await ProjectModel.find({
      "userList.email": userEmail,
    });
    const finalProjects = [...projects, ...assignedProjects].filter(
      (project, index, self) =>
        index ===
        self.findIndex((p) => p._id.toString() === project._id.toString()),
    );

    return res.status(200).json({
      message: "Projects Fetched Successfully",
      projects: finalProjects,
    });
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const updateProjectCards = async (req: Request, res: Response) => {
  try {
    const projectId = req.params.id;
    const updatedData = req.body;
    const dsfsdgfsdfg = await ProjectModel.findById(projectId, {
      projectColumns: updatedData,
    });
    return res
      .status(200)
      .json({ message: "Project Updated Successfully", updateData :dsfsdgfsdfg });
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
