import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import axios from 'axios';
import styles from '../styles/Notifications.module.css';
import Layout from '../components/Layout';
import Image from 'next/image';

const NotificationsPage = () => {
  const { data: session } = useSession();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  // Lấy danh sách thông báo
  const fetchNotifications = async () => {
    try {
      console.log('Session:', session); // Log session để debug
      console.log('Access Token:', session?.user?.accessToken); // Log token

      const response = await axios.get('http://localhost:8082/api/v1/notifications', {
        headers: {
          Authorization: `Bearer ${session?.user?.accessToken}`
        }
      });
      console.log('API Response:', response.data); // Log response
      setNotifications(response.data.data);
    } catch (error) {
      console.error('Lỗi khi lấy thông báo:', error);
    } finally {
      setLoading(false);
    }
  };

  // Tạo thông báo mẫu
  const createSampleNotifications = async () => {
    try {
      await axios.post(
        'http://localhost:8082/api/v1/notifications/create-samples',
        {},
        {
          headers: {
            Authorization: `Bearer ${session?.user?.accessToken}`
          }
        }
      );
      // Sau khi tạo xong, tải lại danh sách thông báo
      await fetchNotifications();
    } catch (error) {
      console.error('Lỗi khi tạo thông báo mẫu:', error);
    }
  };

  // Đánh dấu thông báo đã đọc
  const markAsRead = async (notificationId) => {
    try {
      await axios.put(
        `http://localhost:8082/api/v1/notifications/${notificationId}/mark-read`,
        {},
        {
          headers: {
            Authorization: `Bearer ${session?.user?.accessToken}`
          }
        }
      );
      // Cập nhật UI
      setNotifications(notifications.map(notif => 
        notif._id === notificationId ? { ...notif, isRead: true } : notif
      ));
    } catch (error) {
      console.error('Lỗi khi đánh dấu đã đọc:', error);
    }
  };

  // Xóa thông báo
  const deleteNotification = async (notificationId) => {
    try {
      await axios.delete(
        `http://localhost:8082/api/v1/notifications/${notificationId}`,
        {
          headers: {
            Authorization: `Bearer ${session?.user?.accessToken}`
          }
        }
      );
      // Cập nhật UI
      setNotifications(notifications.filter(notif => notif._id !== notificationId));
    } catch (error) {
      console.error('Lỗi khi xóa thông báo:', error);
    }
  };

  useEffect(() => {
    if (session?.user?.accessToken) {
      fetchNotifications();
    }
  }, [session]);

  if (loading) {
    return <div>Đang tải...</div>;
  }

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'system':
        return '🔔';
      case 'promotion':
        return '🎁';
      case 'game':
        return '🎮';
      default:
        return (
          <Image 
            src="/images/default-notification.jpg"
            alt="Default Notification"
            width={30}
            height={30}
          />
        );
    }
  };

  return (
    <Layout>
      <div className={styles.container}>
        <div className={styles.header}>
          <h1>
            <Image 
              src="/images/logo.png"
              alt="TK88"
              width={120}
              height={40}
              priority
            />
            Thông Báo
          </h1>
          <button 
            className={styles.createButton}
            onClick={createSampleNotifications}
          >
            Tạo thông báo mẫu
          </button>
        </div>
        {!session ? (
          <p>Vui lòng đăng nhập để xem thông báo</p>
        ) : notifications.length === 0 ? (
          <p>Không có thông báo nào</p>
        ) : (
          <div className={styles.notificationList}>
            {notifications.map((notification) => (
              <div
                key={notification._id}
                className={`${styles.notificationItem} ${
                  notification.isRead ? styles.read : styles.unread
                }`}
                onClick={() => !notification.isRead && markAsRead(notification._id)}
              >
                <div className={styles.notificationImage}>
                  <Image 
                    src="/images/default-notification.jpg"
                    alt="Notification Image"
                    width={80}
                    height={80}
                    className={styles.notificationThumbnail}
                  />
                </div>
                <div className={styles.notificationContent}>
                  <h3>{notification.title}</h3>
                  <p>{notification.message}</p>
                  <small>
                    {new Date(notification.createdAt).toLocaleString('vi-VN')}
                  </small>
                </div>
                <button
                  className={styles.deleteButton}
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteNotification(notification._id);
                  }}
                >
                  ❌
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default NotificationsPage; 