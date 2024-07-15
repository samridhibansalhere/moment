"use client";
import { getDateTimeFormat } from "@/helpers/date-time-formats";
import { NotificationType } from "@/interfaces";
import React from "react";
import { useRouter } from "next/navigation";

function NotificationItem({
  notification,
}: {
  notification: NotificationType;
}) {
  const router = useRouter();
  return (
    <div
      className="p-5 bg-gray-100 border border-gray-200 border-solid flex lg:flex-row lg:justify-between flex-col gap-1 cursor-pointer"
      onClick={() => router.push(notification.onClickPath)}
    >
      <span className="text-gray-700 font-semibold text-sm">
        {notification.text}
      </span>
      <span className="text-gray-500 text-xs">
        {getDateTimeFormat(notification.createdAt)}
      </span>
    </div>
  );
}

export default NotificationItem;