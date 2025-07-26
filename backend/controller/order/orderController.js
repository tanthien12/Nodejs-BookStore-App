const Order = require("../../models/orderModel");

// [GET] /api/admin/orders
const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find()
            .populate("userId", "name email profilePic") // Lấy thông tin người dùng
            .populate("products.productId", "productName sellingPrice") // Lấy thông tin sản phẩm
            .sort({ createdAt: -1 }); // Đơn mới nhất lên đầu

        res.json({
            success: true,
            orders
        });
    } catch (error) {
        console.error("Get All Orders Error:", error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};

module.exports = {
    getAllOrders
};
