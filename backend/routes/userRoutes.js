import express from "express";
import { auth } from "../middlewares/auth.js";
import {
  getPublishedCreations,
  getUserCreations,
  getDashboardStats,
} from "../controllers/userControllers.js";

const userRouter = express.Router();

userRouter.get("/get-user-creations", auth, getUserCreations);
userRouter.get("/get-published-creations", auth, getPublishedCreations);
userRouter.get("/get-dashboard-stats", auth, getDashboardStats);

export default userRouter;
