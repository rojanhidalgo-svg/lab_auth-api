const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcrypt');
const db = require('../config/db');

function generateToken(user) {
  const jti = uuidv4();
  const token = jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
      jti
    },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );
  return { token, jti };
}

const register = async (req, res) => {
  try {
    const { email, password, full_name, role } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    await db.query(
      'INSERT INTO users (email, password_hash, full_name, role) VALUES (?, ?, ?, ?)',
      [email, hashedPassword, full_name, role || 'student']
    );

    res.json({ message: 'User registered successfully' });
  } catch (err) {
    console.error('❌ Register error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email]);

    if (rows.length === 0) return res.status(400).json({ message: 'User not found' });

    const user = rows[0];
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const { token, jti } = generateToken(user);

    res.json({ message: 'Login successful', token });
  } catch (err) {
    console.error('❌ Login error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

const profile = async (req, res) => {
  res.json({ message: 'Profile info', user: req.user });
};

const logout = async (req, res) => {
  try {
    const { jti, exp } = req.user;
    await db.query('INSERT INTO revoked_tokens (jti, expires_at) VALUES (?, FROM_UNIXTIME(?))', [
      jti,
      exp
    ]);
    res.json({ message: 'Logout successful' });
  } catch (err) {
    console.error('❌ Logout error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { register, login, profile, logout };
