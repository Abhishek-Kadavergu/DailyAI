import express from "express";
import { auth } from "../middlewares/auth.js";
import {
  generateArticle,
  generateBlogTitles,
  generateImage,
  removeImageBackground,
  removeImageObject,
  reviewResume,
} from "../controllers/aiController.js";
import { upload, uploadResume, uploadImage } from "../configs/multer.js";

const aiRouter = express.Router();

aiRouter.post("/generate-article", auth, generateArticle);
aiRouter.post("/generate-blog-titles", auth, generateBlogTitles);
aiRouter.post("/generate-image", auth, generateImage);
aiRouter.post(
  "/remove-image-background",
  uploadImage.single("image"),
  auth,
  removeImageBackground
);
aiRouter.post(
  "/remove-image-object",
  uploadImage.single("image"),
  auth,
  removeImageObject
);
aiRouter.post("/review-resume", uploadResume.single("resume"), auth, reviewResume);

export default aiRouter;
