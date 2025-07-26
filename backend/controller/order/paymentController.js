const moment = require('moment');
const qs = require('qs');
const crypto = require('crypto');
const { v4: uuidv4 } = require('uuid');



const Order = require('../../models/orderModel');

const createVnpayUrl = async (req, res) => {
    try {
        const { orderId, amount, orderInfo } = req.body;

        if (!orderId || !amount || !orderInfo) {
            return res.status(400).json({ success: false, message: "Thiếu thông tin đơn hàng" });
        }

        // const tmnCode = process.env.VNP_TMN_CODE;
        // const secretKey = process.env.VNP_HASH_SECRET;
        // const vnpUrl = process.env.VNP_URL;
        // const returnUrl = process.env.VNP_RETURN_URL;

        const tmnCode = 'IUZM1MPO';
        const secretKey = '8G601UG2RBJ59ZZIG2K8L0ZBJZWQM47I';
        const vnpUrl = 'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html';
        const returnUrl = 'http://localhost:8080/api/payment/vnpay-return';


        const createDate = moment().format('YYYYMMDDHHmmss');
        // const ipAddr = req.headers['x-forwarded-for'] || req.socket.remoteAddress || '127.0.0.1';


        // Dùng orderId làm TxnRef để sau có thể tra cứu đơn
        let vnp_Params = {
            vnp_Version: '2.1.0',
            vnp_Command: 'pay',
            vnp_TmnCode: tmnCode,
            vnp_Locale: 'vn',
            vnp_CurrCode: 'VND',
            vnp_TxnRef: orderId, // Dùng chính orderId
            vnp_OrderInfo: orderInfo,
            vnp_OrderType: 'other',
            vnp_Amount: Math.floor(Number(amount) * 100), // Phải là số nguyên
            vnp_ReturnUrl: returnUrl, // Không gắn thêm gì
            vnp_IpAddr: '127.0.0.1',
            vnp_CreateDate: createDate
        };

        // Sắp xếp key tăng dần
        vnp_Params = sortObject(vnp_Params);

        // Log các tham số VNPay để kiểm tra
        console.log("Tham số VNPay (vnp_Params):", vnp_Params);

        // Tạo chuỗi ký hash
        const signData = qs.stringify(vnp_Params, { encode: false });
        console.log("Chuỗi ký hash:", signData);

        // Tạo chữ ký
        const hmac = crypto.createHmac("sha512", secretKey);
        const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest("hex");
        console.log("Chữ ký tạo ra (vnp_SecureHash):", signed);

        // Gắn chữ ký vào tham số
        vnp_Params.vnp_SecureHash = signed;

        const paymentUrl = `${vnpUrl}?${qs.stringify(vnp_Params, { encode: true })}`;

        res.json({ success: true, url: paymentUrl });
        console.log("🔗 VNPay Payment URL:", paymentUrl);

    } catch (err) {
        console.error("Lỗi tạo URL thanh toán:", err);
        res.status(500).json({ success: false, message: "Lỗi khi tạo URL thanh toán VNPay" });
    }
};

const vnpayReturn = async (req, res) => {
    const vnp_Params = req.query;
    const secureHash = vnp_Params.vnp_SecureHash;

    // Xóa chữ ký khỏi tham số để tính lại chữ ký
    delete vnp_Params.vnp_SecureHash;
    delete vnp_Params.vnp_SecureHashType;

    // Log các tham số VNPay nhận được để kiểm tra
    console.log("Tham số VNPay nhận được (vnp_Params):", vnp_Params);

    const secretKey = process.env.VNP_HASH_SECRET;
    const sortedParams = sortObject(vnp_Params);
    const signData = qs.stringify(sortedParams, { encode: false });
    console.log("Chuỗi ký hash:", signData);

    // Tính toán chữ ký
    const hash = crypto.createHmac('sha512', secretKey).update(Buffer.from(signData, 'utf-8')).digest('hex');
    console.log("Chữ ký tính toán lại (hash):", hash);

    // Lấy lại orderId từ vnp_TxnRef
    const orderId = vnp_Params.vnp_TxnRef;

    if (hash === secureHash) {
        try {
            await Order.findByIdAndUpdate(orderId, {
                isPaid: true,
                paidAt: new Date(),
                paymentResult: {
                    transactionId: vnp_Params.vnp_TransactionNo,
                    responseCode: vnp_Params.vnp_ResponseCode,
                    orderInfo: vnp_Params.vnp_OrderInfo,
                },
                status: "Đã xác nhận"
            });
            return res.redirect(`http://localhost:3000/order-success`);
        } catch (error) {
            console.error("Lỗi khi cập nhật đơn hàng:", error);
            return res.status(500).send("Lỗi khi cập nhật đơn hàng.");
        }
    } else {
        return res.status(400).send("Sai chữ ký (checksum không hợp lệ)!");
    }
};

// Hàm sắp xếp tham số theo thứ tự tăng dần
function sortObject(obj) {
    const sorted = {};
    Object.keys(obj).sort().forEach(key => {
        sorted[key] = obj[key];
    });
    return sorted;
}

module.exports = {
    createVnpayUrl,
    vnpayReturn
};


