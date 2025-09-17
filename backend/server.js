import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { clerkMiddleware, requireAuth } from "@clerk/express";
import aiRouter from "./routes/aiRoutes.js";
import connectCloudinary from "./configs/cloudinary.js";
import userRouter from "./routes/userRoutes.js";
import testRouter from "./routes/testRoutes.js";

dotenv.config();
const PORT = process.env.PORT || 4000;

const app = express();

await connectCloudinary();

app.use(cors());
app.use(express.json());
app.use(clerkMiddleware());
app.use("/api/ai", aiRouter);
app.use("/api/user", userRouter);
app.use("/api/test", testRouter);

app.get("/", (req, res) => {
  res.send("server is running...");
});
app.get("/main", (req, res) => {
  res.send("main is working ✅");
});
app.listen(PORT, () => console.log("✅ Server is running bro..."));
