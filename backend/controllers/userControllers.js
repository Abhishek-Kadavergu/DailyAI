import sql from "../configs/db.js";

export const getUserCreations = async (req, res) => {
  const { userId } = req.auth;

  try {
    const creations =
      await sql`SELECT * FROM creations WHERE user_id = ${userId} ORDER BY created_at DESC`;
    res.json({ success: true, creations });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};
export const getPublishedCreations = async (req, res) => {
  try {
    const creations = await sql`
      SELECT * FROM creations 
      WHERE publish = true 
      ORDER BY created_at DESC
    `;
    
    console.log("✅ Published creations fetched:", creations.length);
    res.json({ success: true, creations });
  } catch (error) {
    console.error("❌ Error fetching published creations:", error);
    res.json({ success: false, message: error.message });
  }
};
