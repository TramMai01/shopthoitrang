const Admin = require('../models/Admin');

module.exports = {
    ensureAuthenticated: async (req, res, next) => {
        if (req.session.adminId) {
            try {
                const admin = await Admin.findById(req.session.adminId);
                if (admin) {
                    req.admin = admin; // Lưu admin vào req
                }
            } catch (error) {
                console.error('Lỗi khi tìm admin:', error.message);
            }
            return next();
        }
        req.flash('error', 'Bạn phải đăng nhập trước.');
        res.redirect('/login');
    },
    redirectIfAuthenticated: (req, res, next) => {
        if (req.session.userId) {
            return res.redirect('/customer/home');
        }
        if (req.session.adminId) {
            return res.redirect('/admin/dashboard');
        }
        next();
    }
};
