const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');

// Đường dẫn đến trang giỏ hàng
router.get('/cart', cartController.getCart);

module.exports = router;
