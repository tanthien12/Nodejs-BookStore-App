const mongoose = require('mongoose')

const productSchema = mongoose.Schema({
    productName: String,
    author: String,
    category: {
        type: [String],
        required: true
    },
    productImage: {
        type: [String],
        default: []
      },
    description: String,
    price: Number,
    sellingPrice: Number
}, {
    timestamps: true
})


const productModel = mongoose.model("product", productSchema)

module.exports = productModel