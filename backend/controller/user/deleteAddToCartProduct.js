const addToCartModel = require("../../models/cartProduct");

const deleteAddToCartProduct = async (req, res) => {
    try {
        const currentUserId = req.userId;
        const addToCartProductId = req.body._id;

        if (!addToCartProductId) {
            return res.status(400).json({
                message: "Product ID is required",
                error: true,
                success: false,
            });
        }

        const deleteProduct = await addToCartModel.deleteOne({
            _id: addToCartProductId,
            userId: currentUserId,
        });

        if (deleteProduct.deletedCount === 0) {
            return res.status(404).json({
                message: "Product not found or not authorized to delete",
                error: true,
                success: false,
            });
        }

        res.json({
            message: "Product Deleted From Cart",
            error: false,
            success: true,
            data: deleteProduct,
        });

    } catch (err) {
        res.status(500).json({
            message: err?.message || err,
            error: true,
            success: false,
        });
    }
};

module.exports = deleteAddToCartProduct;
