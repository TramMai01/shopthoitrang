const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
    customer: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true }, // Tham chiếu đến khách hàng
    items: [{
        product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true }, // Sản phẩm
        quantity: { type: Number, required: true, default: 1 } // Số lượng sản phẩm
    }],
    totalAmount: { type: Number, default: 0 }, // Tổng giá trị của giỏ hàng
}, { timestamps: true });

const Cart = mongoose.model('Cart', cartSchema);
module.exports = Cart;
