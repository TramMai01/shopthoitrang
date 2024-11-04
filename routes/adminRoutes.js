const express = require('express');
const router = express.Router();
const path = require('path');
const multer = require('multer');
const adminController = require('../controllers/adminController'); // Đảm bảo đường dẫn chính xác
const { ensureAuthenticated } = require('../middleware/authMiddleware');

// Sử dụng middleware để kiểm tra quyền truy cập admin
router.use(ensureAuthenticated);

// Route đến dashboard của admin
router.get('/dashboard', adminController.getDashboard);

// Route cho trang quản lý sản phẩm
router.get('/manageProducts', adminController.getProducts);

// Route để hiển thị form thêm sản phẩm
router.get('/addProduct', adminController.showAddProductForm);

// Cấu hình lưu trữ Multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Đường dẫn đến thư mục lưu trữ
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Đặt tên file bằng timestamp
    }
});

// Định nghĩa upload cho nhiều file
const upload = multer({ storage: storage }).array('images'); // 'images' là tên field trong form
// Routes
router.post('/addProduct', upload, adminController.addProduct);

// Route để hiển thị trang sửa sản phẩm
router.get('/editProduct/:id', adminController.editProduct);

router.post('/editProduct/:id', upload, adminController.updateProduct); // Sử dụng upload như một middleware
 // Đảm bảo updateProduct đã được định nghĩa

// Các route khác...
router.post('/deleteProduct/:id', adminController.deleteProduct); // Sử dụng hàm deleteProduct từ controller

router.get('/manageCustomers', adminController.getCustomers); // Đảm bảo getCustomers đã được định nghĩa

module.exports = router;
