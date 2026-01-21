import mongoose from "mongoose";

const ProjectSchema = new mongoose.Schema(
  {
    projectName: {
      type: String,
      require: true,
    },
    projectDescription: {
      type: String,
      require: true,
    },
    userList: [
      {
        email: {
          type: String,
          required: true,
        },
        role: {
          type: String,
          enum: ["admin", "view", "edit"],
          default: "member",
        },
      },
    ],
    creater: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true },
);

export const ProjectModel = mongoose.model("Projects", ProjectSchema);
