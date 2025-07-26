const uploadProductPermission = require('../../helpers/permission');
const productModel = require('../../models/productModel');

async function deleteProductController(req, res) {
    try {
        // Kiểm tra quyền của user
        if (!uploadProductPermission(req.userId)) {
            throw new Error("Permission denied");
        }

        const { _id } = req.body;

        // Kiểm tra nếu không có _id
        if (!_id) {
            throw new Error("Missing product _id");
        }

        // Xóa sản phẩm theo _id
        const deletedProduct = await productModel.findByIdAndDelete(_id);

        // Kiểm tra nếu không tìm thấy sản phẩm để xóa
        if (!deletedProduct) {
            throw new Error("Product not found");
        }

        // Trả kết quả thành công
        res.json({
            message: "Product deleted successfully",
            data: deletedProduct,
            success: true,
            error: false,
        });

    } catch (err) {
        res.status(400).json({
            message: err.message || "Something went wrong",
            error: true,
            success: false,
        });
    }
}

module.exports = deleteProductController;
