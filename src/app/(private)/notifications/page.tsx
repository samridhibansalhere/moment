import React from "react";
import NotificationItem from "./notification-item";
import { NotificationType } from "@/interfaces";
import { getNotificationsOfCurrentUser } from "@/server-actions/notifications";

async function NotificationsPage() {
  const notificationsResponse = await getNotificationsOfCurrentUser();
  if (notificationsResponse.data.length === 0) {
    return (
      <div className="flex flex-col gap-5">
        <h1 className="text-2xl text-primary font-bold">Notifications</h1>
        <span className="text-gray-500 text-sm">
          You have no notifications yet!
        </span>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl text-primary font-bold">Notifications</h1>

      <div className="flex gap-5 flex-col mt-7">
        {notificationsResponse.data.map((notification: NotificationType) => (
          <NotificationItem
            key={notification._id}
            notification={notification}
          />
        ))}
      </div>
    </div>
  );
}

export default NotificationsPage;