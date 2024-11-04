const User = require('../models/Customer');
const Product = require('../models/productModel');


exports.getCart = (req, res) => {
    res.render('customer/cart');  // Nếu file cart.ejs nằm trong views/customer
};
