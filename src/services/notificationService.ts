import axios from "axios";
import authService from "./AuthService";
import { toast } from "react-toastify";

interface NotificationData {
  id: number;
  userId: number;
  message: string;
  seen: boolean;
  sendDate: string;
}

/**
 * Shows the notifications to the user
 */
const showNotifications = async () => {
  try {
    const userId = authService.getUserIdFromToken();
    const token = authService.getToken();
    const notifications = await axios.get(
      "http://localhost:8080/api/v1/notifications/by-user/" + userId,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (notifications.data && notifications.data.data) {
      notifications.data.data.forEach((notification: NotificationData) => {
        toast.info(notification.message);
        markNotificationAsSeen(notification.id);
      });
    }
  } catch (error) {
    console.error("Error al obtener las notificaciones:", error);
    throw error;
  }
};

/**
 * Marks a notification as seen
 * @param id The id of the notification to be marked as seen
 */
const markNotificationAsSeen = async (id: number) => {
  try {
    const token = authService.getToken();
    const response = await axios.patch(
      "http://localhost:8080/api/v1/notifications/" + id + "/mark-as-seen",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.data && response.data.data) {
      return response.data.data as NotificationData;
    } else {
      console.warn(
        "La respuesta de la API no tiene la estructura esperada (response.data.data).",
        response.data
      );
      return null;
    }
  } catch (err) {
    console.error("Error al marcar la notificación como vista:", err);
    throw err;
  }
};

const notificationService = {
  showNotifications,
  markNotificationAsSeen,
};

export default notificationService;
