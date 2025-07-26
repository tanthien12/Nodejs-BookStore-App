const userModel = require('../../models/userModel');
const bcrypt = require('bcryptjs'); // Sử dụng bcryptjs thay vì bcrypt

const updatePasswordController = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;

        // Kiểm tra xem req.userId có tồn tại không
        if (!req.userId) {
            return res.status(400).json({ message: 'User không được xác thực.' });
        }

        // Tìm người dùng theo userId
        const user = await userModel.findById(req.userId);
        if (!user) {
            return res.status(404).json({ message: 'Không tìm thấy người dùng.' });
        }

        // So sánh mật khẩu hiện tại với mật khẩu lưu trữ trong database
        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Mật khẩu hiện tại không đúng.' });
        }

        // Kiểm tra độ dài mật khẩu mới (ví dụ tối thiểu 6 ký tự)
        if (newPassword.length < 6) {
            return res.status(400).json({ message: 'Mật khẩu mới phải có ít nhất 6 ký tự.' });
        }

        // Mã hóa mật khẩu mới và lưu lại
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        await user.save();

        res.json({ message: 'Cập nhật mật khẩu thành công.' });
    } catch (error) {
        console.error('Lỗi khi cập nhật mật khẩu:', error);
        res.status(500).json({ message: 'Lỗi khi cập nhật mật khẩu.' });
    }
};

module.exports = updatePasswordController;
