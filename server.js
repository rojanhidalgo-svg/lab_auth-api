const express = require("express")
const app = express()
const port = 3000
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');

app.use(express.json());
app.use('/auth', authRoutes);


const db = require('./config/db')

app.use("/api/auth", authRoutes);

app.get('/api/health', (req, res) => {
    const dbStatus = db && db.threadId ? 'connected' : 'initialized';
    res.json({ status: 'ok', db: dbStatus, time: new Date().toISOString() });
});

app.listen(3000, () => {
  console.log(`Example app listening on port ${port}`)
});