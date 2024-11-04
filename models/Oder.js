const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    customer: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true }, // Tham chiếu đến khách hàng
    items: [{
        product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true }, // Sản phẩm
        quantity: { type: Number, required: true } // Số lượng
    }],
    totalAmount: { type: Number, required: true }, // Tổng giá trị đơn hàng
    shippingAddress: { type: String, required: true }, // Địa chỉ giao hàng
    orderDate: { type: Date, default: Date.now }, // Ngày đặt hàng
    status: { type: String, default: 'Pending' }, // Trạng thái đơn hàng
});

const Order = mongoose.model('Order', orderSchema);
module.exports = Order;
