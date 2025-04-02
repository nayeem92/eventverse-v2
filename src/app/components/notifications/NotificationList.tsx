import { FC } from 'react';
import NotificationItem from './NotificationItem';
import { Notification } from '@/types/notifications';

interface NotificationListProps {
  notifications: Notification[];
  toggleReadStatus: (id: string) => void;
}

const NotificationList: FC<NotificationListProps> = ({ notifications, toggleReadStatus }) => {
  return (
    <div className="card dashboard-card">
      <div className="card-body">
        {notifications.length > 0 ? (
          notifications.map((notification) => (
            <NotificationItem
              key={notification._id} // Fixed `_id` usage
              id={notification._id} // Ensured `_id` consistency
              message={notification.message}
              timestamp={notification.timestamp}
              isRead={notification.isRead}
              toggleReadStatus={toggleReadStatus}
            />
          ))
        ) : (
          <p className="no-notifications">No notifications available.</p>
        )}
      </div>
    </div>
  );
};

export default NotificationList;
