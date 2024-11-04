const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { redirectIfAuthenticated } = require('../middleware/authMiddleware');

// Route cho trang đăng ký
router.get('/register', redirectIfAuthenticated, authController.getRegisterPage);
router.post('/register', authController.registerUser);

// Route cho trang đăng nhập
router.get('/login', redirectIfAuthenticated, authController.getLoginPage);
router.post('/login', authController.loginUser);

module.exports = router;
