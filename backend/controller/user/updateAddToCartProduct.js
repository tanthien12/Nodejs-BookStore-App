const addToCartModel = require("../../models/cartProduct")

const updateAddToCartProduct = async (req, res) => {
    try {
        const currentUserId = req.userId;
        const addToCartProductId = req?.body?._id;
        const qty = req.body.quantity;

        if (!addToCartProductId) {
            return res.status(400).json({
                message: "Product ID is required",
                error: true,
                success: false,
            });
        }

        if (!Number.isInteger(qty) || qty < 1) {
            return res.status(400).json({
                message: "Quantity must be a positive integer",
                error: true,
                success: false,
            });
        }

        const updateProduct = await addToCartModel.updateOne(
            { _id: addToCartProductId, userId: currentUserId },
            { quantity: qty }
        );

        if (updateProduct.modifiedCount === 0) {
            return res.status(404).json({
                message: "Product not found or already has this quantity",
                error: true,
                success: false,
            });
        }

        res.json({
            message: "Product Updated",
            data: updateProduct,
            error: false,
            success: true,
        });

    } catch (err) {
        res.status(500).json({
            message: err?.message || err,
            error: true,
            success: false,
        });
    }
};

module.exports = updateAddToCartProduct;
