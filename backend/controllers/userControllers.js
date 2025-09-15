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

export const getDashboardStats = async (req, res) => {
  const { userId } = req.auth;

  try {
    // Get total creations count for the user
    const totalCreationsResult = await sql`
      SELECT COUNT(*) as total_creations 
      FROM creations 
      WHERE user_id = ${userId}
    `;
    
    // Get recent creations (last 10)
    const recentCreations = await sql`
      SELECT * FROM creations 
      WHERE user_id = ${userId} 
      ORDER BY created_at DESC 
      LIMIT 10
    `;
    
    // Get creations by type for statistics
    const creationsByType = await sql`
      SELECT type, COUNT(*) as count 
      FROM creations 
      WHERE user_id = ${userId} 
      GROUP BY type
    `;

    const dashboardStats = {
      totalCreations: totalCreationsResult[0]?.total_creations || 0,
      recentCreations: recentCreations,
      creationsByType: creationsByType
    };

    console.log("✅ Dashboard stats fetched for user:", userId);
    res.json({ success: true, data: dashboardStats });
  } catch (error) {
    console.error("❌ Error fetching dashboard stats:", error);
    res.json({ success: false, message: error.message });
  }
};
