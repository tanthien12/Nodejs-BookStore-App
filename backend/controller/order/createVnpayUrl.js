const moment = require('moment');
const qs = require('qs');
const crypto = require('crypto');
const { v4: uuidv4 } = require('uuid');

const createVnpayUrl = async (req, res) => {
    try {
        const { orderId, amount, orderInfo } = req.body;

        console.log("Received Order Info:", { orderId, amount, orderInfo }); // Log thông tin đơn hàng nhận được

        if (!orderId || !amount || !orderInfo) {
            return res.json({ success: false, message: "Thiếu thông tin đơn hàng" });
        }

        const tmnCode = process.env.VNP_TMN_CODE;
        const secretKey = process.env.VNP_HASH_SECRET;
        const vnpUrl = process.env.VNP_URL;
        const returnUrl = process.env.VNP_RETURN_URL;

        console.log("VNP_TMN_CODE:", tmnCode); // Log thông tin mã TMN
        console.log("VNP_HASH_SECRET:", secretKey); // Log thông tin Secret Key

        let createDate = moment().format('YYYYMMDDHHmmss');
        let orderIdGen = uuidv4().replace(/-/g, '');
        let ipAddr = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

        console.log("Generated Order ID:", orderIdGen); // Log Order ID đã tạo ra
        console.log("IP Address:", ipAddr); // Log địa chỉ IP người dùng

        let vnp_Params = {
            vnp_Version: '2.1.0',
            vnp_Command: 'pay',
            vnp_TmnCode: tmnCode,
            vnp_Locale: 'vn',
            vnp_CurrCode: 'VND',
            vnp_TxnRef: orderIdGen,
            vnp_OrderInfo: orderInfo,
            vnp_OrderType: 'billpayment',
            vnp_Amount: amount * 100, // nhân 100 vì VNPay tính theo đồng
            vnp_ReturnUrl: `${returnUrl}?orderId=${orderId}`,
            vnp_IpAddr: ipAddr,
            vnp_CreateDate: createDate
        };

        console.log("VNP Params before sorting:", vnp_Params); // Log trước khi sắp xếp

        vnp_Params = sortObject(vnp_Params);

        console.log("VNP Params after sorting:", vnp_Params); // Log sau khi sắp xếp

        let signData = qs.stringify(vnp_Params, { encode: false });
        let hmac = crypto.createHmac("sha512", secretKey);
        let signed = hmac.update(Buffer.from(signData, 'utf-8')).digest("hex");

        console.log("Signature:", signed); // Log chữ ký (hmac)

        vnp_Params.vnp_SecureHash = signed;

        const paymentUrl = `${vnpUrl}?${qs.stringify(vnp_Params, { encode: false })}`;

        console.log("Generated VNPay URL:", paymentUrl); // Log URL thanh toán

        res.json({ success: true, url: paymentUrl });
    } catch (err) {
        console.error("Lỗi tạo URL thanh toán:", err); // Log lỗi nếu có
        res.status(500).json({ success: false, message: "Lỗi tạo URL thanh toán VNPay" });
    }
};

function sortObject(obj) {
    const sorted = {};
    Object.keys(obj).sort().forEach(key => {
        sorted[key] = obj[key];
    });
    return sorted;
}

module.exports = createVnpayUrl;
