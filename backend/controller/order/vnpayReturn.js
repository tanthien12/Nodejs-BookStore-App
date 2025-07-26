const crypto = require('crypto')
const Order = require('../../models/orderModel')

const vnpayReturn = async (req, res) => {
    const vnp_Params = req.query
    const secureHash = vnp_Params.vnp_SecureHash
    delete vnp_Params.vnp_SecureHash
    delete vnp_Params.vnp_SecureHashType

    const secretKey = process.env.VNP_HASH_SECRET
    const sortedParams = sortObject(vnp_Params)
    const signData = require('qs').stringify(sortedParams, { encode: false })
    const hash = crypto.createHmac('sha512', secretKey).update(signData).digest('hex')

    const orderId = vnp_Params.orderId

    if (hash === secureHash) {
        // Thanh toán hợp lệ
        await Order.findByIdAndUpdate(orderId, {
            isPaid: true,
            paidAt: new Date(),
            paymentResult: {
                transactionId: vnp_Params.vnp_TxnRef,
                responseCode: vnp_Params.vnp_ResponseCode,
                orderInfo: vnp_Params.vnp_OrderInfo
            },
            status: "Đã xác nhận"
        })

        res.redirect(`${process.env.CLIENT_URL}/order-success`)
    } else {
        res.status(400).send("Sai checksum!")
    }
}

function sortObject(obj) {
    const sorted = {}
    Object.keys(obj).sort().forEach(key => {
        sorted[key] = obj[key]
    })
    return sorted
}

module.exports = vnpayReturn
