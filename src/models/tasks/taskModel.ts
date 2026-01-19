import mongoose from "mongoose";

const TaskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      require: true,
    },
    cardColor: {
      type: String,
      require: false,
    },
    isCompleted: {
      type: Boolean,
      default: false,
    },
    creater: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      require: true,
    },
  },
  { timestamps: true },
);

export const TaskModel = mongoose.model("Task", TaskSchema);
