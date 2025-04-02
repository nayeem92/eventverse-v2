export interface Notification {
    _id: string;
    userId: string;
    message: string;
    timestamp: string;
    isRead: boolean; // Add isRead property
  }
  