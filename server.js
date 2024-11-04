const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const session = require('express-session');
const Admin = require('./models/Admin');
const flash = require('connect-flash');
const authRoutes = require('./routes/authRoutes');
const cartRoutes = require('./routes/cartRoutes');
const adminRoutes = require('./routes/adminRoutes');
const customerRouter = require('./routes/customerRouter');
const { ensureAuthenticated, redirectIfAuthenticated } = require('./middleware/authMiddleware');
const cors = require('cors');
const app = express();

// Kết nối tới MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/shopping', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('Could not connect to MongoDB...', err));

// Cấu hình Express
app.use(express.urlencoded({ extended: true })); // Để parse dữ liệu từ form
app.use(express.static(path.join(__dirname, 'public'))); // Thay 'public' bằng thư mục chứa tệp css
app.use(cors()); // Cho phép tất cả nguồn
// Đảm bảo thư mục uploads tồn tại
const fs = require('fs');
const dir = './uploads';

if (!fs.existsSync(dir)){
    fs.mkdirSync(dir);
}

// Cấu hình middleware để phục vụ tệp tĩnh từ thư mục uploads
app.use('/admin/uploads', express.static('uploads'));
// Đường dẫn đến thư mục lưu trữ hình ảnh
app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); // Cung cấp các file ảnh từ thư mục 'uploads'

// Cấu hình middleware session
app.use(session({
    secret: 'your-secret-key', // Thay thế bằng khóa bí mật của bạn
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Đặt true nếu bạn sử dụng HTTPS
}));
app.use(flash());

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
// Route cho trang chủ
app.get('/', redirectIfAuthenticated, (req, res) => {
    res.redirect('/login');
});

// Kiểm tra và tạo tài khoản admin nếu chưa tồn tại
mongoose.connection.once('open', async () => {
    console.log('Connected to MongoDB');

    const existingAdmin = await Admin.findOne({ email: 'admin@example.com' });

    if (!existingAdmin) {
        const newAdmin = new Admin({
            fullName: 'ngocmai',
            birthDate: new Date('1990-01-01'),
            phone: '0123456789',
            email: 'admin@example.com',
            password: 'admin123', // Mật khẩu sẽ được hash trong mô hình
        });

        await newAdmin.save();
        console.log('Default admin account created');
    } else {
        console.log('Admin account already exists');
    }
});
// Routes
app.use('/', authRoutes);
app.use('/customer', cartRoutes);
app.use('/admin', adminRoutes);
app.use('/customer', customerRouter); // Đảm bảo rằng router của khách hàng đã được kết nối

// Xử lý lỗi kết nối MongoDB
mongoose.connection.on('error', (err) => {
    console.error(`MongoDB connection error: ${err}`);
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
