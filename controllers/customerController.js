const Product = require('../models/productModel');

exports.getCustomerHomePage = async (req, res) => {
    try {
        const products = await Product.find(); // Lấy danh sách sản phẩm từ cơ sở dữ liệu
        const user = req.user; // Thông tin người dùng đã được lưu từ middleware

        res.render('customer/home', { 
            products,
            user
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Có lỗi xảy ra trong quá trình lấy dữ liệu.');
    }
};
