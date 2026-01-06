import { TokenBlacklist, User } from "../models/user/userModel";
import { Request, response, Response } from "express";
import * as bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Types } from "mongoose";

export const refreshTokenGenerator = (payload: {
  email: string;
  id: Types.ObjectId;
}) => {
  return jwt.sign(payload, "KRUP123_REFRESH", { expiresIn: "30d" });
};

export const accessTokenGenerator = (payload: {
  email: string;
  id: Types.ObjectId;
}) => {
  return jwt.sign(payload, "KRUP123", { expiresIn: "10s" });
};

export const signup = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;
    const userExist = await User.findOne({ email });
    if (userExist) {
      return res.status(400).json({ message: "User ALready Exist" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });
    const payload = {
      email: user.email,
      id: user._id,
    };

    const token = accessTokenGenerator(payload);

    const refreshToken = refreshTokenGenerator(payload);

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    // const token = jwt.sign(payload, "KRUP123", { expiresIn: "24h" });
    return res
      .status(200)
      .json({ message: "User Created Successfully", user, token });
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User Not Found" });
    }

    const isMatchPassword = await bcrypt.compare(password, user.password);

    if (!isMatchPassword) {
      return res.status(400).json({ message: "Invalid Password" });
    }

    const payload = {
      email: user.email,
      id: user._id,
    };

    const refreshToken = refreshTokenGenerator(payload);
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false, // <-- MUST be false on localhost
      sameSite: "lax", // <-- "none" requires https
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    const token = accessTokenGenerator(payload);

    res
      .status(200)
      .json({ message: "Login Successful", user, token, ref: refreshToken });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const logout = async (req: Request, res: Response) => {
  try {
    const userToken = req.headers.authorization;

    if (!userToken) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    await TokenBlacklist.create({
      token: userToken,
      expiredDate: new Date(Date.now() + 24 * 60 * 60 * 1000),
    });

    return res.status(200).json({ message: "Logout Successful" });
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const refreshToken = async (req: Request, res: Response) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    console.log(refreshToken);

    if (!refreshToken) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const decoded = jwt.verify(refreshToken, "KRUP123_REFRESH") as {
      email: string;
      id: Types.ObjectId;
    };

    const payload = { email: decoded.email, id: decoded.id };

    // Generate new access + refresh token
    const newAccessToken = accessTokenGenerator(payload);
    const newRefreshToken = refreshTokenGenerator(payload);

    // Update cookie
    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      message: "New Access Token Generated",
      token: newAccessToken,
    });
  } catch (error) {
    return res.status(500).json({ message: "Internal Server error" });
  }
};
