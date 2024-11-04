const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    type: { type: String, required: true },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    description: { type: String, required: true },
    color: { type: String, required: true },
    size: { type: String, required: true },
    quantity: { type: Number, required: true, default: 1 }, // Thêm số lượng
    images: { type: [String], required: true } // Thêm mảng hình ảnh
});


const Product = mongoose.model('Product', productSchema);

module.exports = Product;