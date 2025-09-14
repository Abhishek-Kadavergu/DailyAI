import { clerkClient } from "@clerk/express";
import dotenv from "dotenv";

dotenv.config();

// Utility function to set user plan
export const setUserPlan = async (userId, plan) => {
  try {
    const metadata = {
      plan: plan, // "premium" or "free"
      free_usage: plan === "premium" ? 0 : 0, // Reset usage when setting plan
    };

    // Add additional premium indicators
    if (plan === "premium") {
      metadata.isPremium = true;
      metadata.subscription = "active";
    } else {
      metadata.isPremium = false;
      metadata.subscription = "inactive";
    }

    await clerkClient.users.updateUserMetadata(userId, {
      privateMetadata: metadata,
    });
    
    console.log(`✅ User ${userId} plan set to: ${plan}`);
    console.log("📋 Metadata set:", metadata);
    return { success: true, metadata };
  } catch (error) {
    console.error("❌ Error setting user plan:", error);
    return { success: false, error: error.message };
  }
};

// Function to get user plan status
export const getUserPlan = async (userId) => {
  try {
    const user = await clerkClient.users.getUser(userId);
    console.log("🔍 User metadata:", user.privateMetadata);
    return { success: true, metadata: user.privateMetadata };
  } catch (error) {
    console.error("❌ Error getting user plan:", error);
    return { success: false, error: error.message };
  }
};

// Example usage:
// setUserPlan("user_123456789", "premium");
// setUserPlan("user_123456789", "free");
// getUserPlan("user_123456789");
