const express = require('express');
const router = express.Router();
const customerController = require('../controllers/customerController');
const customerAuth = require('../middleware/customerAuth'); // Middleware kiểm tra xác thực của khách hàng

// Sử dụng middleware để kiểm tra quyền truy cập
router.use(customerAuth);

// Route cho trang home của khách hàng
router.get('/home', customerController.getCustomerHomePage);

module.exports = router;
