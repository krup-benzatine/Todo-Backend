import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export const User = mongoose.model("User", userSchema);

const tokenBlacklist = new mongoose.Schema({
  token: {
    type: String,
    required: true,
  },
  expiredDate: {
    type: Date,
    required: true,
  },
});

export const TokenBlacklist = mongoose.model("TokenBlacklist", tokenBlacklist);
