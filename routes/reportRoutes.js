const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/auth");
const reportCtrl = require("../controllers/reportController");

const db = require("../config/db");


router.get("/users-with-roles", authMiddleware, async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT id, email, full_name, role, created_at FROM users"
    );
    res.json(rows);
  } catch (err) {
    console.error("❌ Report error:", err);
    res.status(500).json({ message: "Server error" });
  }
}
);
router.get('/users-with-profiles', authMiddleware, reportCtrl.usersWithProfiles);
router.get('/roles-right-join', authMiddleware, reportCtrl.rolesRightJoin);
router.get('/profiles-full-outer', authMiddleware, reportCtrl.profilesFullOuter);
router.get('/user-role-combos', authMiddleware, reportCtrl.userRoleCombos);
router.get('/referrals', authMiddleware, reportCtrl.referrals);
router.get('/latest-login', authMiddleware, reportCtrl.latestLogin);


module.exports = router;
