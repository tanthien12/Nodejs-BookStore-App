const productModel = require("../../models/productModel");

const filterProductController = async (req, res) => {
    try {
        const categoryList = Array.isArray(req.body.category) ? req.body.category : [];

        if (!categoryList.length) {
            return res.status(200).json({
                data: [],
                message: "No categories provided",
                error: false,
                success: true,
            });
        }

        const product = await productModel.find({
            category: {
                "$in": categoryList
            }
        });

        res.status(200).json({
            data: product,
            message: "Filtered product list",
            error: false,
            success: true,
        });
    } catch (err) {
        res.status(500).json({
            message: err.message || "Internal server error",
            error: true,
            success: false,
        });
    }
};

module.exports = filterProductController;
