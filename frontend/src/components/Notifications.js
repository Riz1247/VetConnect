// frontend/src/components/Notifications.js
import { useEffect, useState } from "react";
import axios from "axios";

const Notifications = ({ userId }) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch notifications
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await axios.get(`/api/notifications/${userId}`);
        setNotifications(res.data);
      } catch (err) {
        setError("Failed to load notifications");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, [userId]);

  // Mark notification as read when clicked
  const handleNotificationClick = async (notificationId) => {
    try {
      await axios.put(`/api/notifications/read/${notificationId}`);
      setNotifications(notifications.map(note => 
        note._id === notificationId ? { ...note, read: true } : note
      ));
    } catch (err) {
      console.error("Failed to mark as read", err);
    }
  };

  if (loading) return <div>Loading notifications...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="max-w-md mx-auto mt-4">
      <h2 className="text-xl font-bold mb-4">Notifications</h2>
      {notifications.length === 0 ? (
        <p className="text-gray-500">No notifications yet</p>
      ) : (
        <div className="space-y-2">
          {notifications.map(note => (
            <div
              key={note._id}
              onClick={() => handleNotificationClick(note._id)}
              className={`p-3 rounded-lg cursor-pointer transition-colors ${
                note.read ? "bg-gray-50" : "bg-blue-50 border-l-4 border-blue-500"
              }`}
            >
              <p className={`${note.read ? "text-gray-600" : "font-semibold"}`}>
                {note.message}
              </p>
              <small className="text-gray-500 text-sm">
                {new Date(note.createdAt).toLocaleString()}
              </small>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Notifications;
