import { setUserPlan, getUserPlan } from "./utils/setUserPlan.js";

// Test script to set a user as premium
const testUserId = "YOUR_USER_ID_HERE"; // Replace with actual user ID

async function testPremiumUser() {
  console.log("🧪 Testing premium user setup...");
  
  // First, check current status
  console.log("\n1. Checking current user status:");
  const currentStatus = await getUserPlan(testUserId);
  
  // Set user as premium
  console.log("\n2. Setting user as premium:");
  const result = await setUserPlan(testUserId, "premium");
  
  if (result.success) {
    console.log("✅ User successfully set as premium!");
    
    // Verify the change
    console.log("\n3. Verifying premium status:");
    const verifyStatus = await getUserPlan(testUserId);
  } else {
    console.log("❌ Failed to set user as premium:", result.error);
  }
}

// Run the test
testPremiumUser().catch(console.error);
