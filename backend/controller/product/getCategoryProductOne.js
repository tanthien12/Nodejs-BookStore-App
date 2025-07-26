
const productModel = require("../../models/productModel");

const getCategoryProduct = async (req, res) => {
  try {
    // Lấy danh sách tất cả các category duy nhất
    const productCategory = await productModel.distinct("category");

    // Mảng để lưu sản phẩm đại diện cho mỗi category
    const productByCategory = [];

    for (const category of productCategory) {
      // Tìm 1 sản phẩm thuộc category đó
      const product = await productModel.findOne({ category: category });

      if (product) {
        // Gắn thêm field đại diện để dùng ở frontend
        productByCategory.push({
          ...product.toObject(),
          categoryRepresentative: category,
        });
      }
    }

    res.json({
      message: "Product by category",
      data: productByCategory,
      success: true,
      error: false,
    });
  } catch (err) {
    res.status(400).json({
      message: err.message || err,
      error: true,
      success: false,
    });
  }
};

module.exports = getCategoryProduct;


