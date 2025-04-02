import { FC } from 'react';
import { BsBell, BsCheckCircle } from 'react-icons/bs';

interface NotificationItemProps {
  message: string;
  timestamp: string;
  isRead: boolean;
  id: string;
  toggleReadStatus: (id: string) => void;
}

const NotificationItem: FC<NotificationItemProps> = ({
  message,
  timestamp,
  isRead,
  id,
  toggleReadStatus,
}) => {
  return (
    <div
      className={`p-3 mb-2 d-flex justify-content-between align-items-center border rounded shadow-sm transition-all duration-300 
        ${!isRead ? 'bg-warning text-dark border-start border-3 border-primary' : 'bg-light text-muted'}
      `}
      role="button"
      tabIndex={0}
      onClick={() => toggleReadStatus(id)}
      onKeyPress={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          toggleReadStatus(id);
        }
      }}
    >
      <div className="d-flex align-items-center">
        {/* Icon indicating read/unread status */}
        <div className="me-2">
          {isRead ? <BsCheckCircle size={20} color="green" /> : <BsBell size={20} color="orange" />}
        </div>
        <div>
          <span>{message}</span>
        </div>
      </div>
      <small>{new Date(timestamp).toLocaleString()}</small>
    </div>
  );
};

export default NotificationItem;
