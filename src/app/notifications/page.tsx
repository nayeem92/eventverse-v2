// 'use client';

// import React, { useEffect, useState } from 'react';

// const NotificationsPage = () => {
//   const [notifications, setNotifications] = useState<any[]>([]);

//   // Fetch notifications from the JSON file
//   useEffect(() => {
//     const fetchNotifications = async () => {
//       try {
//         const response = await fetch('/notifications.json');  // path to your JSON file
//         const data = await response.json();
//         setNotifications(data);
//       } catch (error) {
//         console.error('Error fetching notifications:', error);
//       }
//     };

//     fetchNotifications();
//   }, []);

//   const toggleReadStatus = (id: string) => {
//     setNotifications((prev) =>
//       prev.map((notification) =>
//         notification.id === id ? { ...notification, isRead: !notification.isRead } : notification
//       )
//     );
//   };

//   return (
//     <div className="page-container" style={{ minHeight: '100vh', backgroundColor: 'inherit', padding: '20px' }}>
//       <div
//         className="notifications-container"
//         style={{
//           padding: '2rem',
//           backgroundColor: '#fff',
//           borderRadius: '8px',
//           boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
//         }}
//       >
//         <div className="notifications-header mb-4">
//           <h2 style={{ color: '#333', fontSize: '24px' }}>Notifications</h2>
//           <p style={{ color: '#555', fontSize: '14px' }}>{notifications.length} Notifications</p>
//         </div>

//         <div className="notifications-list">
//           {notifications.length ? (
//             notifications.map((notification) => (
//               <div
//                 key={notification.id}
//                 className={`notification-item mb-3 p-3 rounded`}
//                 onClick={() => toggleReadStatus(notification.id)}
//                 style={{
//                   cursor: 'pointer',
//                   backgroundColor: notification.isRead ? '#f0f4f8' : '#4FC3F7', // Light blue for unread notifications
//                   color: notification.isRead ? '#555' : 'white', // Dark gray for read, white for unread
//                   transition: 'background-color 0.3s ease',
//                 }}
//                 onMouseEnter={(e) => e.currentTarget.style.backgroundColor = notification.isRead ? '#f0f4f8' : '#0288d1'}
//                 onMouseLeave={(e) => e.currentTarget.style.backgroundColor = notification.isRead ? '#f0f4f8' : '#4FC3F7'}
//               >
//                 <div className="d-flex justify-content-between">
//                   <p className="mb-0" style={{ marginBottom: '0' }}>{notification.message}</p>
//                   <small className="text-muted" style={{ fontSize: '12px' }}>{new Date(notification.timestamp).toLocaleString()}</small>
//                 </div>
//                 <div className="notification-status mt-2">
//                   <span
//                     className={`badge ${notification.isRead ? 'bg-success' : 'bg-warning'}`}
//                     style={{
//                       padding: '5px 10px',
//                       fontSize: '12px',
//                       borderRadius: '5px',
//                       backgroundColor: notification.isRead ? '#4CAF50' : '#FF9800',
//                       color: 'white',
//                     }}
//                   >
//                     {notification.isRead ? 'Read' : 'Unread'}
//                   </span>
//                 </div>
//               </div>
//             ))
//           ) : (
//             <p className="text-center" style={{ color: '#888' }}>No notifications available.</p>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default NotificationsPage;


'use client';

import React, { useEffect, useState } from 'react';

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState<any[]>([]);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await fetch('/api/notifications');
        const data = await res.json();
        setNotifications(data);
      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
    };
    fetchNotifications();
  }, []);

  const toggleReadStatus = (id: string) => {
    setNotifications((prev) =>
      prev.map((notification) =>
        notification._id === id ? { ...notification, isRead: !notification.isRead } : notification
      )
    );
  };

  return (
    <div className="page-container" style={{ minHeight: '100vh' }}>
      <div className="notifications-container" style={{ padding: '2rem' }}>
        <div className="notifications-header mb-4">
          <h2 className="text-light">Notifications</h2>
          <p className="text-light">{notifications.length} Notifications</p>
        </div>

        <div className="notifications-list">
          {notifications.length ? (
            notifications.map((notification) => (
              <div
                key={notification._id}
                className={`notification-item mb-3 p-3 rounded ${notification.isRead ? 'bg-light' : 'bg-lightblue'}`}
                onClick={() => toggleReadStatus(notification._id)}
                style={{
                  cursor: 'pointer',
                  backgroundColor: notification.isRead ? '#f0f4f8' : '#4FC3F7', // Light blue for unread notifications
                  color: notification.isRead ? '#555' : 'white', // Dark gray for read, white for unread
                  transition: 'background-color 0.3s ease',
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = notification.isRead ? '#f0f4f8' : '#0288d1'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = notification.isRead ? '#f0f4f8' : '#4FC3F7'}
              >
                <div className="d-flex justify-content-between">
                  <p className="mb-0">{notification.message}</p>
                  <small className="text-muted">{new Date(notification.timestamp).toLocaleString()}</small>
                </div>
                <div className="notification-status mt-2">
                  <span className={`badge ${notification.isRead ? 'bg-success' : 'bg-warning'}`}>
                    {notification.isRead ? 'Read' : 'Unread'}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center">No notifications available.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationsPage;
