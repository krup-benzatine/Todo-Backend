import express from "express";
import {
  login,
  logout,
  refreshToken,
  signup,
} from "../controllers/user.controller";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.get("/logout", logout);
router.get("/refresh-token", refreshToken);

export default router;
