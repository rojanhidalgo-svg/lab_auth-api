const db = require('../config/db'); 

exports.usersWithRoles = (req, res) => {
  const sql = `
    SELECT u.id, u.email, r.role_name
    FROM users u
    INNER JOIN user_roles ur ON ur.user_id = u.id
    INNER JOIN roles r ON r.id = ur.role_id
    ORDER BY u.id, r.role_name;
  `;
  db.query(sql, (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    return res.json(rows);
  });
};

exports.usersWithProfiles = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT u.id, u.email, u.full_name, p.phone, p.city, p.country
      FROM users u
      LEFT JOIN profiles p ON u.id = p.user_id
    `);
    res.json(rows);
  } catch (err) {
    console.error("❌ Report error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.rolesRightJoin = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT r.role_name, ur.user_id, u.email
FROM user_roles ur
RIGHT JOIN roles r ON r.id = ur.role_id
LEFT JOIN users u ON u.id = ur.user_id
ORDER BY r.role_name, ur.user_id;

    `);
    res.json(rows);
  } catch (err) {
    console.error("❌ Report error:", err);
    res.status(500).json({ message: "Server error" });
  }
};



exports.profilesFullOuter = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT u.id AS user_id, u.full_name, u.email,
             p.phone, p.city, p.country
      FROM users u
      LEFT JOIN profiles p ON u.id = p.user_id
      UNION
      SELECT u.id AS user_id, u.full_name, u.email,
             p.phone, p.city, p.country
      FROM profiles p
      LEFT JOIN users u ON p.user_id = u.id
    `);
    res.json(rows);
  } catch (err) {
    console.error("❌ Report error:", err);
    res.status(500).json({ error: err.message });
  }
};


exports.userRoleCombos = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT u.id, u.full_name, u.email,
             r.id AS role_id, r.role_name
      FROM users u
      JOIN user_roles ur ON u.id = ur.user_id
      JOIN roles r ON ur.role_id = r.id
    `);
    res.json(rows);
  } catch (err) {
    console.error("❌ Report error:", err);
    res.status(500).json({ error: err.message });
  }
};


exports.referrals = async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT u.id, u.email, p.phone, p.city, p.country, r.referred_user_id, r.referred_at
            FROM users u
            JOIN profiles p ON u.id = p.user_id
            LEFT JOIN referrals r ON u.id = r.referrer_user_id
        `);
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Database error" });
    }
};


exports.latestLogin = async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT u.id, u.email, la.ip_address, la.occurred_at
FROM users u
LEFT JOIN (
  SELECT l1.user_id, l1.ip_address, l1.occurred_at
  FROM login_audit l1
  JOIN (
    SELECT user_id, MAX(occurred_at) AS max_occurred
    FROM login_audit
    GROUP BY user_id
  ) l2 ON l1.user_id = l2.user_id AND l1.occurred_at = l2.max_occurred
) la ON la.user_id = u.id
ORDER BY u.id;
        `);
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Database error" });
    }
};
