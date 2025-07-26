const addToCartModel = require("../../models/cartProduct");

const addToCartController = async (req, res) => {
    try {
        const { productId, quantity = 1 } = req.body;
        const currentUser = req.userId;

        // Kiểm tra xem sản phẩm này đã có trong giỏ hàng của user chưa
        const isProductAvailable = await addToCartModel.findOne({
            productId,
            userId: currentUser
        });

        if (isProductAvailable) {
            // Nếu đã có, tăng số lượng theo giá trị mới
            isProductAvailable.quantity += quantity;
            const updatedProduct = await isProductAvailable.save();

            return res.json({
                data: updatedProduct,
                message: "Đã cập nhật số lượng sản phẩm trong giỏ hàng",
                success: true,
                error: false
            });
        }

        // Nếu chưa có, thêm mới vào giỏ hàng với quantity
        const payload = {
            productId,
            quantity,
            userId: currentUser
        };

        const newAddToCart = new addToCartModel(payload);
        const saveProduct = await newAddToCart.save();

        return res.json({
            data: saveProduct,
            message: "Đã thêm sản phẩm vào giỏ hàng",
            success: true,
            error: false
        });

    } catch (err) {
        res.json({
            message: err.message || err,
            error: true,
            success: false
        });
    }
};

module.exports = addToCartController;
