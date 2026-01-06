import jwt from "jsonwebtoken";
import { TokenBlacklist } from "../models/user/userModel";

export const AuthMiddleWare = async(req:any, res:any, next:any) => {
  const authToken = req.headers.authorization;
  const checkBlacklist = await TokenBlacklist.findOne({ token: authToken });
  if (checkBlacklist) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  if (!authToken || !authToken.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const finalToken = authToken.split(" ")[1];
  try {
    const decodeToken = jwt.verify(finalToken, "KRUP123");
    req.user = decodeToken;

    next();
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized" });
  }
};
