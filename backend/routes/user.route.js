import express from "express";
import { protectedRouteMiddleware } from "../middleware/protected.js";
import {
  followUnfollowUser,
  getSuggestedUser,
  getUserProfile,
  updateUserProfile,
} from "../controller/user.Controller.js";

const router = express.Router();

router.get("/profile/:username", protectedRouteMiddleware, getUserProfile);
router.get("/suggested", protectedRouteMiddleware, getSuggestedUser);
router.post(
  "/followunfollow/:id",
  protectedRouteMiddleware,
  followUnfollowUser
);
router.post("/update", protectedRouteMiddleware, updateUserProfile);

export default router;
