const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
    fullName: { type: String, required: true },
    birthDate: { type: Date, required: true }, // Trường ngày sinh
    gender: { type: String, enum: ['Nam', 'Nữ', 'Khác'], required: true }, // Giới tính
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    avatar: { type: String }, // Đường dẫn đến hình ảnh avatar
    cart: [{ // Giỏ hàng của khách hàng
        productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
        quantity: { type: Number, required: true, default: 1 },
    }],
    // Thêm các trường khác nếu cần
});

const Customer = mongoose.model('Customer', customerSchema);
module.exports = Customer;
