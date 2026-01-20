import express from "express";
import {
  forgotPassword,
  generateOTP,
  login,
  logout,
  refreshToken,
  resetPassword,
  signup,
  verifyOTP,
} from "../controllers/user.controller";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.get("/logout", logout);
router.get("/refresh-token", refreshToken);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.post("/generateOTP", generateOTP);
router.post("/verifyOTP", verifyOTP);

export default router;
