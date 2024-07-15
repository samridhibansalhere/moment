"use client"
import Spinner from "@/components/spinner";
import { UserType } from "@/interfaces";
import {
  acceptFollowRequest,
  rejectFollowRequest,
} from "@/server-actions/follow-requests";
import { addNewNotification } from "@/server-actions/notifications";
import { getFollowRequestReceived } from "@/server-actions/users";
import useUsersStore, { UsersStoreType } from "@/store/users";
import { Button, message } from "antd";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

type LoadingTypes = "accepting follow request" | "rejecting follow request" | "";

function PendingFollowRequests({ user }: { user: UserType }) {
  const [followRequests, setFollowRequests] = useState<UserType[]>([]);
  const { loggedInUserData }: UsersStoreType = useUsersStore();
  const [loading, setLoading] = useState<LoadingTypes>("");
  const router = useRouter();

  useEffect(() => {
    fetchFollowRequests();
  }, []);

  const fetchFollowRequests = async () => {
    try {
      const response = await getFollowRequestReceived(loggedInUserData?._id || "");
      if (response.success) {
        setFollowRequests(response.data);
      } else {
        message.error(response.message);
      }
    } catch (error: any) {
      message.error(error.message);
    }
  };

  const handleAcceptFollowRequest = async (senderId: string) => {
    try {
      setLoading("accepting follow request");
      const response = await acceptFollowRequest({
        followRequestReceiverId: loggedInUserData?._id || "",
        followRequestSenderId: senderId,
      });
      if (response.success) {
        message.success(response.message);
        addNewNotification({
          user: senderId,
          type: "follow-request",
          text: `${loggedInUserData?.name} accepted your follow request.`,
          onClickPath: `/profile/${senderId}`,
          read: false,
        });
        fetchFollowRequests();
      } else {
        message.error(response.message);
      }
    } catch (error: any) {
      message.error(error.message);
    } finally {
      setLoading("");
    }
  };

  const handleRejectFollowRequest = async (senderId: string) => {
    try {
      setLoading("rejecting follow request");
      const response = await rejectFollowRequest({
        followRequestReceiverId: loggedInUserData?._id || "",
        followRequestSenderId: senderId,
      });
      if (response.success) {
        message.success(response.message);
        fetchFollowRequests();
      } else {
        message.error(response.message);
      }
    } catch (error: any) {
      message.error(error.message);
    } finally {
      setLoading("");
    }
  };

  if (user._id !== loggedInUserData?._id) {
    return null;
  }

  return (
    <div className="mt-10 p-5 bg-gray-50 border border-gray-200 border-solid">
      <h1 className="text-sm text-primary">Pending Follow Requests</h1>

      {followRequests.length === 0 && !loading && (
        <span className="text-gray-500 text-sm">No pending follow requests</span>
      )}

      {followRequests.length > 0 && (
        <div className="flex flex-wrap gap-5 mt-7">
          {followRequests.map((sender: UserType) => (
            <div
              key={sender._id}
              className="flex gap-5 items-center bg-gray-200 p-2 border border-solid border-gray-300"
            >
              <img
                src={sender.profilePic}
                alt={sender.name}
                className="w-12 h-12 rounded-full object-cover"
              />

              <div className="flex flex-col gap-1">
                <span className="text-gray-700 text-sm">{sender.name}</span>
                <div className="flex gap-5">
                  <Button
                    size="small"
                    danger
                    onClick={() => handleRejectFollowRequest(sender._id)}
                    loading={loading === "rejecting follow request"}
                  >
                    Reject
                  </Button>
                  <Button
                    size="small"
                    onClick={() => router.push(`/profile/${sender._id}`)}
                  >
                    View Profile
                  </Button>
                  <Button
                    size="small"
                    type="primary"
                    onClick={() => handleAcceptFollowRequest(sender._id)}
                    loading={loading === "accepting follow request"}
                  >
                    Accept
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default PendingFollowRequests;
