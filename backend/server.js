import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { clerkMiddleware, requireAuth } from "@clerk/express";
import aiRouter from "./routes/aiRoutes.js";
import testRouter from "./routes/testRoutes.js";
import connectCloudinary from "./configs/cloudinary.js";

dotenv.config();
const PORT = process.env.PORT || 4000;

const app = express();

await connectCloudinary();

app.use(cors());
app.use(express.json());
app.use(clerkMiddleware());
app.use("/api/ai", aiRouter);
app.use("/api/test", testRouter);

app.get("/", (req, res) => {
  res.send("server is running...");
});

app.listen(PORT, () => console.log("✅ Server is running bro..."));
