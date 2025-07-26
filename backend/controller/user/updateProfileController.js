const userModel = require('../../models/userModel');

const updateProfileController = async (req, res) => {
    try {
        const { name } = req.body;

        // Kiểm tra xem userId có tồn tại trong request không
        if (!req.userId) {
            return res.status(400).json({ message: 'User không được xác thực' });
        }

        // Tìm người dùng theo userId
        const user = await userModel.findById(req.userId);

        if (!user) {
            return res.status(404).json({ message: 'Không tìm thấy người dùng' });
        }

        // Cập nhật thông tin người dùng
        user.name = name || user.name;
        await user.save();

        res.status(200).json({
            message: 'Cập nhật thông tin người dùng thành công',
            user: user
        });

    } catch (error) {
        console.error('Lỗi khi cập nhật thông tin người dùng:', error);
        res.status(500).json({ message: 'Lỗi khi cập nhật thông tin người dùng' });
    }
};

module.exports = updateProfileController;
