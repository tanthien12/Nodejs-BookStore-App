
const productModel = require("../../models/productModel");

const getCategoryWiseProduct = async (req, res) => {
  try {
    let { category } = req?.body || req?.query;

    // Đảm bảo category luôn là mảng
    if (!category) {
      return res.status(400).json({
        message: "Thiếu category",
        error: true,
        success: false
      });
    }

    // Nếu là string (chỉ 1 category), convert sang mảng
    if (!Array.isArray(category)) {
      category = [category];
    }

    // Tìm những sản phẩm có ít nhất 1 category trùng khớp
    const product = await productModel.find({
      category: { $in: category }
    });

    res.json({
      data: product,
      message: "Product",
      success: true,
      error: false
    });
  } catch (err) {
    res.status(400).json({
      message: err.message || err,
      error: true,
      success: false
    });
  }
};

module.exports = getCategoryWiseProduct;
