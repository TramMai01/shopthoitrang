const User = require('../models/Customer');

const customerAuth = async (req, res, next) => {
    if (!req.session.userId) {
        return res.redirect('/login');
    }

    try {
        const user = await User.findById(req.session.userId);
        if (!user) {
            return res.redirect('/login');
        }
        req.user = user; // Lưu thông tin người dùng vào đối tượng request để sử dụng trong controller
        next();
    } catch (err) {
        console.error(err);
        res.redirect('/login');
    }
};

module.exports = customerAuth;
