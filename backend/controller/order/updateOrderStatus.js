const orderModel = require('../../models/orderModel');

const updateOrderStatus = async (req, res) => {
    try {
        const orderId = req.params.id; // Nhận orderId từ URL
        const { status } = req.body;  // Nhận trạng thái mới từ body

        const validStatuses = ["Đang xử lý", "Đã xác nhận", "Đang giao", "Đã giao", "Đã hủy"];

        // Kiểm tra trạng thái có hợp lệ không
        if (!validStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                message: 'Trạng thái không hợp lệ'
            });
        }

        // Tìm và cập nhật trạng thái đơn hàng
        const updatedOrder = await orderModel.findByIdAndUpdate(
            orderId,
            { status },
            { new: true } // Trả về đơn hàng đã được cập nhật
        );

        // Kiểm tra xem đơn hàng có tồn tại hay không
        if (!updatedOrder) {
            return res.status(404).json({
                success: false,
                message: 'Đơn hàng không tồn tại'
            });
        }

        // Trả về đơn hàng sau khi đã cập nhật
        res.status(200).json({
            success: true,
            message: 'Trạng thái đơn hàng đã được cập nhật',
            order: updatedOrder
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi cập nhật trạng thái đơn hàng',
            error
        });
    }
};

module.exports = updateOrderStatus;
