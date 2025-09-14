import express from "express";
import { auth } from "../middlewares/auth.js";

const testRouter = express.Router();

// Test endpoint to check user plan status
testRouter.get("/user-plan", auth, (req, res) => {
  res.json({
    success: true,
    userId: req.auth.userId,
    plan: req.plan,
    free_usage: req.free_usage,
    message: `User is ${req.plan} with usage: ${req.free_usage}`
  });
});

export default testRouter;

