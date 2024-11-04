module.exports = (req, res, next) => {
    if (req.session.adminId) {
        return next();
    }
    req.flash('error', 'Bạn không có quyền truy cập vào trang này.');
    res.redirect('/login');
};
