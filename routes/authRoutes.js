const express = require('express');
const router = express.Router();
const authController = require("../controllers/authController");
const auth = require('../middleware/auth');

router.post("/signup", authController.register);
router.post("/login", authController.login);
router.get("/profile", auth, authController.profile);
router.post("/logout", auth, authController.logout);

module.exports = router;

