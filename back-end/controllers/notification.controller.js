const Notification = require('../models/notification.model');

// Lấy tất cả thông báo của user
const getUserNotifications = async (req, res) => {
  try {
    const userId = req.user.id;
    const notifications = await Notification.find({ userId })
      .sort({ createdAt: -1 }); // Sắp xếp theo thời gian mới nhất
    
    return res.status(200).json({
      success: true,
      data: notifications
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Lỗi khi lấy thông báo',
      error: error.message
    });
  }
};

// Tạo thông báo mẫu cho testing
const createSampleNotifications = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const sampleNotifications = [
      {
        userId,
        type: 'system',
        title: 'Giao diện thân thiện',
        message: 'Website được thiết kế đẹp mắt, dễ sử dụng, tương thích trên mọi thiết bị.',
        isRead: false
      },
      {
        userId,
        type: 'promotion',
        title: 'Nạp/rút nhanh chóng, an toàn',
        message: 'Hỗ trợ nhiều phương thức thanh toán, đảm bảo giao dịch nạp/rút tiền nhanh chóng, an toàn và bảo mật.',
        isRead: false
      },
      {
        userId,
        type: 'game',
        title: 'Kho game đa dạng',
        message: 'Cung cấp kho game cá cược phong phú với nhiều lựa chọn hấp dẫn',
        isRead: false
      },
      {
        userId,
        type: 'promotion',
        title: 'Khuyến mãi hấp dẫn',
        message: 'Thường xuyên có các chương trình khuyến mãi giá trị cho cả thành viên mới và lâu năm.',
        isRead: false
      },
      {
        userId,
        type: 'system',
        title: 'Hỗ trợ chuyên nghiệp',
        message: 'Đội ngũ hỗ trợ khách hàng luôn sẵn sàng giải đáp mọi thắc mắc 24/7.',
        isRead: false
      }
    ];

    await Notification.insertMany(sampleNotifications);

    return res.status(201).json({
      success: true,
      message: 'Đã tạo thông báo mẫu thành công'
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Lỗi khi tạo thông báo mẫu',
      error: error.message
    });
  }
};

// Đánh dấu thông báo đã đọc
const markAsRead = async (req, res) => {
  try {
    const { notificationId } = req.params;
    const userId = req.user.id;

    const notification = await Notification.findOneAndUpdate(
      { _id: notificationId, userId },
      { isRead: true },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy thông báo'
      });
    }

    return res.status(200).json({
      success: true,
      data: notification
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Lỗi khi cập nhật thông báo',
      error: error.message
    });
  }
};

// Đếm số thông báo chưa đọc
const getUnreadCount = async (req, res) => {
  try {
    const userId = req.user.id;
    const count = await Notification.countDocuments({ 
      userId,
      isRead: false
    });

    return res.status(200).json({
      success: true,
      data: { count }
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Lỗi khi đếm thông báo chưa đọc',
      error: error.message
    });
  }
};

// Xóa thông báo
const deleteNotification = async (req, res) => {
  try {
    const { notificationId } = req.params;
    const userId = req.user.id;

    const notification = await Notification.findOneAndDelete({
      _id: notificationId,
      userId
    });

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy thông báo'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Đã xóa thông báo thành công'
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Lỗi khi xóa thông báo',
      error: error.message
    });
  }
};

module.exports = {
  getUserNotifications,
  markAsRead,
  getUnreadCount,
  deleteNotification,
  createSampleNotifications
}; 