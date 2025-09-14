import { clerkClient } from "@clerk/express";

export const auth = async (req, res, next) => {
  try {
    const { userId } = req.auth;

    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    // Fetch Clerk user
    const user = await clerkClient.users.getUser(userId);

    // Get the raw plan value from privateMetadata
    const rawPlan = user.privateMetadata?.plan;
    const userPlan = rawPlan?.toLowerCase()?.trim() || "free";
    
    // Check for premium status with multiple possible values
    const isPremium = userPlan === "premium" || 
                     userPlan === "pro" || 
                     userPlan === "paid" ||
                     user.privateMetadata?.isPremium === true ||
                     user.privateMetadata?.subscription === "active";

    // Debug logging with more details
    console.log("🔍 DETAILED User plan check:", {
      userId,
      rawPlan,
      userPlan,
      isPremium,
      privateMetadata: user.privateMetadata,
      hasIsPremium: user.privateMetadata?.isPremium,
      hasSubscription: user.privateMetadata?.subscription
    });

    // Set plan and usage based on premium status
    if (isPremium) {
      req.plan = "premium";
      req.free_usage = 0; // Premium users don't track usage
      console.log("✅ CONFIRMED: User is PREMIUM - no usage tracking");
    } else {
      req.plan = "free";
      req.free_usage = user.privateMetadata?.free_usage ?? 0;
      console.log("✅ CONFIRMED: User is FREE - tracking usage:", req.free_usage);
    }

    // Final verification
    console.log("🔍 FINAL PLAN ASSIGNMENT:", {
      userId,
      reqPlan: req.plan,
      reqFreeUsage: req.free_usage
    });

    next();
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};
