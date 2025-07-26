const Order = require("../../models/orderModel");

const getMyOrders = async (req, res) => {
    try {
        const userId = req.userId; // middleware phải gán user
        const orders = await Order.find({ userId })
            .sort({ createdAt: -1 })
            .populate("products.productId", "productName sellingPrice");

        res.json({
            success: true,
            orders
        });
    } catch (error) {
        console.error("Lỗi lấy đơn hàng người dùng:", error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};

module.exports = {
    getMyOrders
};
