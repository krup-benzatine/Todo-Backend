import { TokenBlacklist, User } from "../models/user/userModel";
import { Request, response, Response } from "express";
import * as bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Types } from "mongoose";

const RefreshTokenSecret = process.env.JWT_REFRESH_SECRET || "";
const AccessTokenSecret = process.env.JWT_ACCESS_SECRET || "";
const RefreshTokenExpire = process.env.JWT_REFRESH_TOKEN_EXPIRE || "";
const AccessTokenExpire = process.env.JWT_ACCESS_TOKEN_EXPIRE || "";

export const refreshTokenGenerator = (payload: {
  email: string;
  id: Types.ObjectId;
}) => {
  return jwt.sign(payload, RefreshTokenSecret, {
    expiresIn: RefreshTokenExpire as any,
  });
};

export const accessTokenGenerator = (payload: {
  email: string;
  id: Types.ObjectId;
}) => {
  return jwt.sign(payload, AccessTokenSecret, {
    expiresIn: AccessTokenExpire as any,
  });
};

export const signup = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;
    const userExist = await User.findOne({ email });
    if (userExist) {
      return res.status(400).json({ message: "User Already Exist" });
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
      secure: false,
      path: "/",
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
      path: "/",
      secure: false,
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    const token = accessTokenGenerator(payload);

    res.status(200).json({ message: "Login Successful", user, token });
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

    if (!refreshToken) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const decoded = jwt.verify(refreshToken, RefreshTokenSecret) as {
      email: string;
      id: Types.ObjectId;
    };

    const payload = { email: decoded.email, id: decoded.id };

    const newAccessToken = accessTokenGenerator(payload);
    const newRefreshToken = refreshTokenGenerator(payload);

    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      secure: false,
      path: "/",
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
