const multer = require('multer');
const path = require('path');

// Cấu hình lưu trữ Multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Đường dẫn đến thư mục lưu trữ
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Đặt tên file bằng timestamp
    }
});

// Định nghĩa upload cho một file
const upload = multer({ storage: storage }).single('image'); // 'image' là tên field trong form
