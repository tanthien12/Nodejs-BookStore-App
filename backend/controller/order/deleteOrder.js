const orderModel = require('../../models/orderModel');

const deleteOrder = async (req, res) => {
    try {
        const orderId = req.params.id; // Nhận orderId từ URL

        // Tìm và xóa đơn hàng theo ID
        const deletedOrder = await orderModel.findByIdAndDelete(orderId);

        // Kiểm tra xem đơn hàng có tồn tại hay không
        if (!deletedOrder) {
            return res.status(404).json({
                success: false,
                message: 'Đơn hàng không tồn tại'
            });
        }

        // Trả về thông báo thành công
        res.status(200).json({
            success: true,
            message: 'Đơn hàng đã được xóa thành công',
            order: deletedOrder
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi xóa đơn hàng',
            error
        });
    }
};

module.exports = deleteOrder;
