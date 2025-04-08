const express = require('express');
const router = express.Router();
const authenticateUser = require('../middleware/authenticate');
const {
  getUserNotifications,
  markAsRead,
  getUnreadCount,
  deleteNotification,
  createSampleNotifications
} = require('../controllers/notification.controller');

// Áp dụng middleware xác thực cho tất cả các route
router.use(authenticateUser);

// Tạo thông báo mẫu (chỉ dùng cho testing)
router.post('/create-samples', createSampleNotifications);

// Lấy tất cả thông báo của user
router.get('/', getUserNotifications);

// Lấy số lượng thông báo chưa đọc
router.get('/unread-count', getUnreadCount);

// Đánh dấu thông báo đã đọc
router.put('/:notificationId/mark-read', markAsRead);

// Xóa thông báo
router.delete('/:notificationId', deleteNotification);

module.exports = router; 