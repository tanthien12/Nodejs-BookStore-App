

const orderModel = require('../../models/orderModel');

const createOrder = async (req, res) => {
    try {
        const { products, shippingAddress, paymentMethod, shippingFee, totalAmount } = req.body;
        const userId = req.userId; // Lấy từ middleware xác thực

        // Kiểm tra xem userId có hợp lệ không
        if (!userId) {
            return res.status(400).json({ success: false, message: "User not authenticated" });
        }

        // Kiểm tra các trường bắt buộc
        if (!products || !Array.isArray(products) || products.length === 0) {
            return res.status(400).json({ success: false, message: "No products found in the order" });
        }

        if (!shippingAddress || typeof shippingAddress !== 'object') {
            return res.status(400).json({ success: false, message: "Invalid shipping address" });
        }

        if (typeof paymentMethod !== 'string' || !['cod', 'bank', 'zalopay'].includes(paymentMethod)) {
            return res.status(400).json({ success: false, message: "Invalid payment method" });
        }

        if (typeof shippingFee !== 'number' || shippingFee < 0) {
            return res.status(400).json({ success: false, message: "Invalid shipping fee" });
        }

        if (typeof totalAmount !== 'number' || totalAmount <= 0) {
            return res.status(400).json({ success: false, message: "Invalid total amount" });
        }

        

        // Tạo đơn hàng mới
        const newOrder = new orderModel({
            userId,
            products,
            shippingAddress,
            paymentMethod,
            shippingFee,
            totalAmount
        });

        console.log("👤 userId:", userId);
        console.log("📦 Dữ liệu products nhận vào:", products);
        products.forEach((p, i) => {
            console.log(`- Product[${i}]:`, p);
        });
        console.log("📮 shippingAddress:", shippingAddress);
        console.log("💳 paymentMethod:", paymentMethod);
        console.log("🚚 shippingFee:", shippingFee);
        console.log("💰 totalAmount:", totalAmount);

        // Lưu đơn hàng
        await newOrder.save();

        // Trả về thông tin đơn hàng cho frontend
        res.json({
            success: true,
            message: "Order placed successfully",
            order: newOrder
        });
    } catch (error) {
        console.error("Error saving order:", error);
        res.status(500).json({ success: false, message: "Order failed", error: error.message });
    }
}

module.exports = createOrder;
