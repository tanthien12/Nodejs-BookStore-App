const express = require('express')

const router = express.Router()

const userSignUpController = require('../controller/user/userSignUp')
const userSignInController = require('../controller/user/userSignIn')
const authToken = require('../middleware/authToken')
const userDetailsController = require('../controller/user/userDetails')
const userLogout = require('../controller/user/userLogout')
const allUsers = require('../controller/user/allUsers')
const updateUser = require('../controller/user/updateUser')
const getProductController = require('../controller/product/getProduct')
const UploadProductController = require('../controller/product/uploadProduct')
const updateProductController = require('../controller/product/updateProduct')
const getCategoryProduct = require('../controller/product/getCategoryProductOne')
const getCategoryWiseProduct = require('../controller/product/getCategotyWiseProduct')
const getProductDetails = require('../controller/product/getProductDetails')
const addToCartController = require('../controller/user/addToCartController')
const countAddToCartProduct = require('../controller/user/countAddToCartProduct')
const addToCartViewProduct = require('../controller/user/addToCartViewProduct')
const updateAddToCartProduct = require('../controller/user/updateAddToCartProduct')
const deleteAddToCartProduct = require('../controller/user/deleteAddToCartProduct')
const searchProduct = require('../controller/product/searchProduct')
const filterProductController = require('../controller/product/filterProduct')
const deleteProductController = require('../controller/product/deleteProduct')
const { getAllOrders } = require('../controller/order/orderController')

const createOrder = require('../controller/order/createOrder')

const createVnpayUrl = require('../controller/order/createVnpayUrl')
const vnpayReturn = require('../controller/order/vnpayReturn')
const { getMyOrders } = require('../controller/order/orderUser')
const updateProfileController = require('../controller/user/updateProfileController')
const updatePasswordController = require('../controller/user/updatePasswordController')
const deleteOrder = require('../controller/order/deleteOrder')
const updateOrderStatus = require('../controller/order/updateOrderStatus')
const { createZaloPayUrl, payWithZaloPay } = require('../controller/order/paymentZalopayController')





router.post("/signup", userSignUpController)
router.post("/signin", userSignInController)
router.get("/user-details", authToken, userDetailsController)
router.get("/userLogout", userLogout)

//admin panel
router.get("/all-user", authToken, allUsers)
router.post("/update-user", authToken, updateUser)

//product
router.post('/upload-product', authToken, UploadProductController)
router.get("/get-product", getProductController)
router.post("/update-product", authToken, updateProductController)
router.get("/get-categoryProduct", getCategoryProduct)
router.post("/category-product", getCategoryWiseProduct)
router.post("/product-details", getProductDetails)
router.get("/search", searchProduct)
router.post("/filter-product", filterProductController)
router.post("/delete-product", authToken, deleteProductController)

// User add to cart
router.post("/addtocart", authToken, addToCartController)
router.get("/countAddTodCartProduct", authToken, countAddToCartProduct)
router.get("/view-card-product", authToken, addToCartViewProduct)
router.post("/update-cart-product", authToken, updateAddToCartProduct)
router.post("/delete-cart-product", authToken, deleteAddToCartProduct)
router.put('/update-profile', authToken, updateProfileController);
router.put('/update-password', authToken, updatePasswordController);

// Order product
router.post("/order", authToken, createOrder)
router.get("/admin/orders", authToken, getAllOrders)
router.get("/my-orders", authToken, getMyOrders)
// Xóa đơn hàng
router.delete("/admin/orders/delete/:id", deleteOrder);  // Cần quyền admin
// Cập nhật trạng thái đơn hàng
router.put("/admin/orders/update-status/:id", updateOrderStatus);  // Cần quyền admin
//Payment

// router.post('/order/create-vnpay-url', authToken, createVnpayUrl)
// router.get('/order/vnpay-return', vnpayReturn)
router.post("/payment/create-vnpay-url", createVnpayUrl)
router.get("/payment/vnpay-return", vnpayReturn)
router.post('/payment/zalopay', payWithZaloPay);




module.exports = router