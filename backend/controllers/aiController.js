import OpenAI from "openai";
import sql from "../configs/db.js";
import { clerkClient } from "@clerk/express";
import dotenv from "dotenv";
import axios from "axios";
import fs from "fs";
import pdf from "pdf-parse/lib/pdf-parse.js";
import { v2 as cloudinary } from "cloudinary";
dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.GEMINI_API_KEY,
  baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/",
});

export const generateArticle = async (req, res) => {
  try {
    const { userId } = req.auth;
    const { prompt, length } = req.body;
    const plan = req.plan;
    const free_usage = req.free_usage;

    if (plan != "premium" && free_usage >= 10) {
      return res.json({
        success: false,
        message: "Limit exceeded. Upgrade to continue.",
      });
    }
    const response = await openai.chat.completions.create({
      model: "gemini-2.0-flash",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: length,
    });

    const content = response.choices[0].message.content;

    // Insert into database with better error handling
    try {
      await sql`insert into creations(user_id, prompt, content, type) 
      values(${userId}, ${prompt}, ${content}, ${"article"})`;
      console.log("✅ Article saved to database successfully");
    } catch (dbError) {
      console.error("❌ Database error:", dbError);
      // Continue with the response even if database save fails
      // You might want to implement a retry mechanism or queue system here
    }

    // Debug logging for plan and usage
    console.log("🔍 Usage update check:", {
      userId,
      plan,
      free_usage,
      isPremium: plan === "premium",
      willUpdateUsage: plan !== "premium",
    });

    // ONLY update free_usage for FREE users, NEVER for premium users
    if (plan === "free") {
      try {
        await clerkClient.users.updateUserMetadata(userId, {
          privateMetadata: {
            free_usage: free_usage + 1,
          },
        });
        console.log("✅ FREE user - usage updated to:", free_usage + 1);
      } catch (clerkError) {
        console.error("❌ Clerk metadata update error:", clerkError);
        // Continue with the response even if metadata update fails
      }
    } else if (plan === "premium") {
      console.log(
        "✅ PREMIUM user - NO usage update (usage tracking disabled)"
      );
    } else {
      console.log("⚠️ Unknown plan type:", plan);
    }
    res.json({ success: true, content });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};
export const generateBlogTitles = async (req, res) => {
  try {
    const { userId } = req.auth;
    const { prompt } = req.body;
    const plan = req.plan;
    const free_usage = req.free_usage;

    if (plan != "premium" && free_usage >= 10) {
      return res.json({
        success: false,
        message: "Limit exceeded. Upgrade to continue.",
      });
    }
    const response = await openai.chat.completions.create({
      model: "gemini-2.0-flash",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 100,
    });

    const content = response.choices[0].message.content;

    await sql`insert into creations(user_id, prompt, content, type) 
      values(${userId}, ${prompt}, ${content}, ${"blog-titles"})`;

    if (plan == "free") {
      await clerkClient.users.updateUserMetadata(userId, {
        privateMetadata: {
          free_usage: free_usage + 1,
        },
      });
    }
    res.json({ success: true, content });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};
export const generateImage = async (req, res) => {
  try {
    const { userId } = req.auth;
    const { prompt, publish } = req.body;
    const plan = req.plan;
    const free_usage = req.free_usage;

    // if (plan != "premium") {
    //   return res.json({
    //     success: false,
    //     message: "Only premium users can generate images, please upgrade.",
    //   });
    // }

    const formData = new FormData();
    formData.append("prompt", prompt);
    const response = await axios.post(
      "https://clipdrop-api.co/text-to-image/v1",
      formData,
      {
        headers: { "x-api-key": process.env.CLIPDROP_API_KEY },
        responseType: "arraybuffer",
      }
    );

    const base64Image = `data:image/png;base64,${Buffer.from(
      response.data,
      "binary"
    ).toString("base64")}`;
    const { secure_url } = await cloudinary.uploader.upload(base64Image);
    res.json({ success: true, secure_url });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

export const removeImageBackground = async (req, res) => {
  try {
    const { userId } = req.auth;
    const { image } = req.body;
    const plan = req.plan;

    // if (plan != "premium") {
    //   return res.json({
    //     success: false,
    //     message: "Only premium users can generate images, please upgrade.",
    //   });
    // }

    const { secure_url } = await cloudinary.uploader.upload(image.path, {
      transformation: [
        {
          effect: "background_removal",
          background_removal: "remove_the_background",
        },
      ],
    });
    await sql`insert into creations(user_id, prompt, content, type) 
      values(${userId}, ${"remove background from image"}, ${secure_url}, ${"image"})`;

    res.json({ success: true, content: secure_url });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

export const removeImageObject = async (req, res) => {
  try {
    const { userId } = req.auth;
    const { object } = req.body;
    const { image } = req.file;
    const plan = req.plan;

    // if (plan != "premium") {
    //   return res.json({
    //     success: false,
    //     message: "Only premium users can generate images, please upgrade.",
    //   });
    // }

    const { public_id } = await cloudinary.uploader.upload(image.path);

    const imageUrl = cloudinary.url(public_id, {
      transformation: [{ effect: `gen_remove:${object}` }],
      resource_type: "image",
    });

    await sql`insert into creations(user_id, prompt, content, type) 
      values(${userId}, ${`remove ${object} from the image`}, ${imageUrl}, ${"image"})`;

    res.json({ success: true, content: imageUrl });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};
export const reviewResume = async (req, res) => {
  try {
    const { userId } = req.auth;
    const resume = req.file;
    const plan = req.plan;

    // if (plan != "premium") {
    //   return res.json({
    //     success: false,
    //     message: "Only premium users can generate images, please upgrade.",
    //   });
    // }

    if (resume.size > 5 * 1024 * 1024) {
      return req.json({
        success: false,
        message: "Resume size is greater that 5 mb.",
      });
    }

    const { public_id } = await cloudinary.uploader.upload(image.path);

    const imageUrl = cloudinary.url(public_id, {
      transformation: [{ effect: `gen_remove:${object}` }],
      resource_type: "image",
    });

    const dataBuffer = fs.readFileSync(resume.path);
    const pdfData = await pdf(dataBuffer);

    const prompt = `Review the following resume and provide constructive feedback on it's strengths, weaknesses, and areas of improvements. Resume content : \n\n${pdfData.text}`;

    const response = await openai.chat.completions.create({
      model: "gemini-2.0-flash",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 1000,
    });

    const content = response.choices[0].message.content;

    await sql`insert into creations(user_id, prompt, content, type) 
      values(${userId}, ${"Review the uploaded resume"}, ${content}, ${"resume-review"})`;

    res.json({ success: true, content: content });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};
