const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true
    },
    products: [
        {
            productId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "product"
            },
            quantity: Number
        }
    ],
    shippingAddress: {
        name: String,
        phone: String,
        address: String,
        city: String,
        district: String,
        ward: String,
    },
    paymentMethod: {
        type: String,
        enum: ['cod', 'bank', 'zalopay'], // cod = thanh toán khi nhận, bank = VNPay
        default: 'cod'
    },
    shippingFee: {
        type: Number,
        default: 0
    },
    totalAmount: {
        type: Number,
        required: true
    },

    // 🔥 Thêm để hỗ trợ VNPay
    isPaid: {
        type: Boolean,
        default: false
    },
    paidAt: Date,
    paymentResult: {
        transactionId: String,
        responseCode: String,
        orderInfo: String
        // có thể thêm mã ngân hàng, mã giao dịch quốc tế,...
    },

    //  Cập nhật trạng thái
    status: {
        type: String,
        enum: ["Đang xử lý", "Đã xác nhận", "Đang giao", "Đã giao", "Đã hủy"],
        default: "Đang xử lý"
    }
}, {
    timestamps: true
});

module.exports = mongoose.model("order", orderSchema);
