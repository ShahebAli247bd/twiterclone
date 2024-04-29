import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

export const protectedRouteMiddleware = async (req, res, next) => {
  //get cookie by name
  const token = req.cookies.jwt;
  if (!token) {
    return res.status(401).json({ message: "Unauthorized: Token not found" });
  }
  //verify token with JWT_SECRET
  const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

  if (!decodedToken) {
    return res.status(401).json({ message: "Unauthorized: Invalied token" });
  }

  //Find user by ID from the decoded token remove password
  const user = await User.findById({ _id: decodedToken.userId }).select(
    "-password"
  );

  if (!user) {
    return res.status(409).json({ message: "User not found" });
  }

  req.user = user;

  next();
};
