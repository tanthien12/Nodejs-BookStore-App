
const axios = require('axios');
const CryptoJS = require('crypto-js');
const moment = require('moment');
const zaloPayConfig = require('../../config/zaloPayConfig');
const orderModel = require('../../models/orderModel');

const payWithZaloPay = async (req, res) => {
    try {
        const { orderId } = req.body;

        const order = await orderModel.findById(orderId).populate('products.productId');
        if (!order) return res.status(404).json({ error: 'Order not found' });

        const transID = Math.floor(Math.random() * 1000000);
        const totalAmount = order.totalAmount + order.shippingFee;

        const simplifiedProducts = order.products.map(p => ({
            productId: p.productId?._id?.toString() || p.productId,
            quantity: p.quantity
        }));

        const paymentData = {
            app_id: zaloPayConfig.app_id,
            app_trans_id: `${moment().format('YYMMDD')}_${transID}`,
            app_user: order.userId.toString(),
            app_time: Date.now(),
            amount: totalAmount,
            item: JSON.stringify(simplifiedProducts),
            embed_data: JSON.stringify({}),
            description: `Thanh toán đơn hàng #${transID}`,
            bank_code: "",
            callback_url: "http://localhost:3000/order-success",
            redirect_url: "google.com"
        };

        const data = `${zaloPayConfig.app_id}|${paymentData.app_trans_id}|${paymentData.app_user}|${paymentData.amount}|${paymentData.app_time}|${paymentData.embed_data}|${paymentData.item}`;
        paymentData.mac = CryptoJS.HmacSHA256(data, zaloPayConfig.key1).toString();

        const response = await axios.post(zaloPayConfig.endpoint, null, { params: paymentData });

        if (response.data.return_code !== 1 || !response.data.order_url) {
            return res.status(400).json({
                error: 'Payment creation failed',
                details: response.data
            });
        }

        order.paymentMethod = 'zalopay';
        order.paymentResult = {
            transactionId: response.data.zp_trans_token,
            responseCode: response.data.return_code,
            orderInfo: paymentData.description
        };
        await order.save();

        res.json({
            success: true,
            order_url: response.data.order_url
        });

    } catch (error) {
        console.error("Lỗi khi gọi ZaloPay:", error?.response?.data || error.message);
        res.status(500).json({
            error: 'Internal Server Error',
            details: error?.response?.data || error.message
        });
    }
};

module.exports = {
    payWithZaloPay
};
