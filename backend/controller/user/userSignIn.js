const userModel = require("../../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

async function userSignInController(req, res) {
    try {
        const { email, password } = req.body;

        // Kiểm tra xem user có tồn tại không
        const user = await userModel.findOne({ email });
        if (!user) {
            throw new Error("User not found.");
        }

        // Kiểm tra mật khẩu
        const checkPassword = bcrypt.compareSync(password, user.password);
        if (!checkPassword) {
            throw new Error("Invalid email or password.");
        }

        // Tạo dữ liệu cho token
        const tokenData = {
            _id: user._id,
            email: user.email,

        };

        // Tạo JWT Token
        const token = jwt.sign(tokenData, process.env.TOKEN_SECRET_KEY, { expiresIn: 60 * 60 * 8 }); // 8 giờ

        // Cấu hình cookie
        const tokenOption = {
            httpOnly: true, // Ngăn JavaScript truy cập cookie (tăng bảo mật)
            secure: true
        };

        // Lưu token vào cookie và trả về JSON response
        res.cookie("token", token, tokenOption)
            .status(200)
            .json({
                message: "Login successfully",
                data: token,
                success: true,
                error: false,
            });

    } catch (error) {
        res.status(400).json({
            success: false,
            error: true,
            message: error.message || "Login failed",
        });
    }
}

module.exports = userSignInController;
