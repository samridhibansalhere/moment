"use client"
import React, { useState, useEffect } from "react";
import { UserType } from "@/interfaces";
import useUsersStore, { UsersStoreType } from "@/store/users";
import { Button, message } from "antd";
import EditProfileModal from "./edit-profile-modal";
import {
  cancelFollowRequest,
  sendFollowRequest,
  unfollowUser,
} from "@/server-actions/follow-requests";
import FollowersModal from "./followers-modal";
import FollowingModal from "./following-modal";
import { addNewNotification } from "@/server-actions/notifications";
import { getUserInfoById } from "@/server-actions/users";

function UserBasicDetails({ user }: { user: UserType }) {
  const [loading, setLoading] = useState<
    | "sending-follow-request"
    | "cancelling-follow-request"
    | "unfollowing-user"
    | ""
  >("");
  const [showEditProfileModal, setShowEditProfileModal] = useState(false);
  const [showFollowersModal, setShowFollowersModal] = useState(false);
  const [showFollowingModal, setShowFollowingModal] = useState(false);
  const [postCount, setPostCount] = useState(0);
  const { loggedInUserData, setLoggedInUserData }: UsersStoreType =
    useUsersStore();

  useEffect(() => {
    const fetchPostCount = async () => {
      const response = await getUserInfoById(user._id);
      if (response.success) {
        setPostCount(response.data.postCount);
      } else {
        message.error(response.message);
      }
    };

    fetchPostCount();
  }, [user._id]);

  const showEditProfileBtn = user._id === loggedInUserData?._id;

  const followRequestSent = loggedInUserData?.followRequestsSent?.includes(
    user._id
  );

  const alreadyFollowing = loggedInUserData?.following?.includes(user._id);

  const showFollowBtn =
    user._id !== loggedInUserData?._id &&
    !followRequestSent &&
    !alreadyFollowing;

  const followHandler = async () => {
    try {
      setLoading("sending-follow-request");
      const response = await sendFollowRequest({
        followRequestReceiverId: user._id,
        followRequestSenderId: loggedInUserData?._id || "",
      });
      if (response.success) {
        message.success(response.message);
        addNewNotification({
          user: user._id,
          type: "follow-request",
          text: `${loggedInUserData?.name} sent you a follow request.`,
          onClickPath: `/profile/${user._id}`,
          read: false,
        });
        setLoggedInUserData(response.data);
      } else {
        message.error(response.message);
      }
    } catch (error: any) {
      message.error(error.message);
    } finally {
      setLoading("");
    }
  };

  const unfollowHandler = async () => {
    try {
      setLoading("unfollowing-user");
      const response = await unfollowUser({
        senderId: loggedInUserData?._id || "",
        receiverId: user._id,
      });

      if (response.success) {
        message.success(response.message);
        setLoggedInUserData(response.data);
      } else {
        message.error(response.message);
      }
    } catch (error: any) {
      message.error(error.message);
    } finally {
      setLoading("");
    }
  };

  const cancellFollowRequestHandler = async () => {
    try {
      setLoading("cancelling-follow-request");
      const response = await cancelFollowRequest({
        followRequestReceiverId: user._id,
        followRequestSenderId: loggedInUserData?._id || "",
      });
      if (response.success) {
        message.success(response.message);
        setLoggedInUserData(response.data);
      } else {
        message.error(response.message);
      }
    } catch (error: any) {
      message.error(error.message);
    } finally {
      setLoading("");
    }
  };

  const canSeeFollowersAndFollowing =
    loggedInUserData?._id === user._id ||
    (user.isPrivateAccount && alreadyFollowing) ||
    !user.isPrivateAccount;

  return (
    <div className="flex lg:flex-row flex-col gap-10 lg:items-center px-5">
      <div>
        <img
          src={user.profilePic}
          alt={user.name}
          className="w-32 h-32 rounded-full object-cover"
        />
      </div>
      <div className="flex flex-col gap-3">
        <div className="flex gap-5 items-center">
          <span className="font-bold text-xl text-primary">{user.name}</span>
          {showEditProfileBtn && (
            <Button
              type="primary"
              size="small"
              onClick={() => setShowEditProfileModal(true)}
            >
              Edit Profile
            </Button>
          )}

          {showFollowBtn && (
            <Button
              type="primary"
              size="small"
              loading={loading === "sending-follow-request"}
              onClick={followHandler}
            >
              Follow
            </Button>
          )}

          {followRequestSent && (
            <div className="flex items-center gap-5">
              <span className="text-gray-500 text-sm font-semibold">
                Follow Request Sent
              </span>
              <Button
                type="primary"
                size="small"
                onClick={cancellFollowRequestHandler}
                danger
                loading={loading === "cancelling-follow-request"}
              >
                Cancel Request
              </Button>
            </div>
          )}

          {alreadyFollowing && (
            <div className="flex items-center gap-5">
              <span className="text-gray-500 text-sm font-semibold">
                Following
              </span>
              <Button
                type="primary"
                size="small"
                onClick={unfollowHandler}
                danger
                loading={loading === "unfollowing-user"}
              >
                Unfollow
              </Button>
            </div>
          )}
        </div>

        <div className="flex gap-10 text-gray-500 text-sm font-bold">
          <div className="flex gap-1">
            <span>{postCount}</span>
            <span>Posts</span>
          </div>

          <div className="flex gap-1">
            <span>{user.followers.length}</span>
            <span
              className="underline cursor-pointer"
              onClick={() => {
                if (canSeeFollowersAndFollowing) setShowFollowersModal(true);
              }}
            >
              Followers
            </span>
          </div>

          <div className="flex gap-1">
            <span>{user.following.length}</span>
            <span
              className="underline cursor-pointer"
              onClick={() => {
                if (canSeeFollowersAndFollowing) setShowFollowingModal(true);
              }}
            >
              Following
            </span>
          </div>
        </div>

        <p className="text-gray-500 text-sm">
          {user.bio || "This user has no bio yet."}
        </p>
      </div>

      {showEditProfileModal && (
        <EditProfileModal
          user={user}
          showEditProfileModal={showEditProfileModal}
          setShowEditProfileModal={setShowEditProfileModal}
        />
      )}

      {showFollowersModal && (
        <FollowersModal
          user={user}
          showFollowersModal={showFollowersModal}
          setShowFollowersModal={setShowFollowersModal}
        />
      )}

      {showFollowingModal && (
        <FollowingModal
          showFollowingModal={showFollowingModal}
          setShowFollowingModal={setShowFollowingModal}
          user={user}
        />
      )}
    </div>
  );
}

export default UserBasicDetails;
