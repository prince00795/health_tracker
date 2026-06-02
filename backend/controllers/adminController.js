const User = require('../models/User');

exports.getAdminDashboardData = async (req, res) => {
  try {
    const { adminId } = req.body;
    
    // Security Check: Verify if the user requesting is actually an admin
    const adminUser = await User.findById(adminId);
    if (!adminUser || adminUser.role !== 'admin') {
      return res.status(403).json({ error: "Access Denied. Admins only." });
    }

    // Fetch all users
    const allUsers = await User.find().select('-password').sort({ createdAt: -1 });

    // Calculate Analytics
    const totalUsers = allUsers.length;
    const activePlans = allUsers.filter(u => u.aiPlan && u.aiPlan.workoutPlan).length;
    
    // Total logs tracked across the platform
    const totalTelemetryLogs = allUsers.reduce((sum, u) => sum + (u.progressLogs ? u.progressLogs.length : 0), 0);

    res.json({
      totalUsers,
      activePlans,
      totalTelemetryLogs,
      users: allUsers
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch admin data." });
  }
};