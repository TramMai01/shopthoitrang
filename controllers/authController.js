// controllers/authController.js
const User = require('../models/Customer');
const Admin = require('../models/Admin');
const bcrypt = require('bcrypt'); // Nhập bcrypt để mã hóa mật khẩu
const saltRounds = 10; // Số vòng mã hóa

// Hiển thị trang đăng ký
exports.getRegisterPage = (req, res) => {
    res.render('register', { messages: req.flash() });
};

// Xử lý đăng ký
exports.registerUser = async (req, res) => {
    try {
        const { fullName, birthDate, phoneNumber, email, password } = req.body;

        // Kiểm tra dữ liệu nhập
        if (!fullName || !birthDate || !phoneNumber || !email || !password) {
            req.flash('error', 'Tất cả các trường đều bắt buộc!');
            return res.render('register', { messages: req.flash() });
        }

        // Mã hóa mật khẩu trước khi lưu
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const newUser = new User({ fullName, birthDate, phoneNumber, email, password: hashedPassword });
        await newUser.save();
        req.flash('success', 'Đăng ký tài khoản thành công! Bạn có thể tiếp tục sử dụng trang web.');
        res.redirect('/login');
    } catch (err) {
        console.error('Error during registration:', err);
        req.flash('error', 'Có lỗi xảy ra trong quá trình đăng ký. Vui lòng thử lại.');
        res.render('register', { messages: req.flash() });
    }
};

// Hiển thị trang đăng nhập
exports.getLoginPage = (req, res) => {
    res.render('login', { messages: req.flash() });
};

// Xử lý đăng nhập
exports.loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Kiểm tra người dùng thông thường
        const user = await User.findOne({ email });
        if (user) {
            if (await bcrypt.compare(password, user.password)) {
                req.session.userId = user._id;
                return res.redirect('/customer/home');
            }
        }

        // Kiểm tra admin
        const admin = await Admin.findOne({ email });
        if (admin && await bcrypt.compare(password, admin.password)) {
            req.session.adminId = admin._id;
            return res.render('admin/dashboard', { 
                adminName: admin.fullName, 
                navbar: true // Có thể thêm biến này để xác định việc hiển thị navbar 
            });
        }

        req.flash('error', 'Email hoặc mật khẩu không đúng.');
        res.render('login', { messages: req.flash() });

    } catch (err) {
        console.error('Error during login:', err);
        req.flash('error', 'Có lỗi xảy ra trong quá trình đăng nhập. Vui lòng thử lại.');
        res.render('login', { messages: req.flash() });
    }
};
