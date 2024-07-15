import Spinner from "@/components/spinner";
import { UserType } from "@/interfaces";
import { getFollowersOfUser, rejectFollower } from "@/server-actions/users"; 
import { Modal, message, Button } from "antd";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

function FollowersModal({
  showFollowersModal,
  setShowFollowersModal,
  user,
}: {
  showFollowersModal: boolean;
  setShowFollowersModal: (value: boolean) => void;
  user: UserType;
}) {
  const [loading, setLoading] = useState<boolean>(false);
  const [followers, setFollowers] = useState<UserType[]>([]);
  const router = useRouter();

  const getData = async () => {
    try {
      setLoading(true);
      const response = await getFollowersOfUser(user._id);
      if (response.success) {
        setFollowers(response.data);
      } else {
        message.error(response.message);
      }
    } catch (error: any) {
      message.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRejectFollower = async (followerId: string) => {
    try {
      setLoading(true);
      const response = await rejectFollower(user._id, followerId);
      if (response.success) {
        message.success("Follower rejected successfully");
        setFollowers(followers.filter(follower => follower._id !== followerId));
        window.location.reload(); // Reload the page
      } else {
        message.error(response.message);
      }
    } catch (error: any) {
      message.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    if (showFollowersModal) {
      getData();
    }
  }, [showFollowersModal]);

  return (
    <Modal
      title="FOLLOWERS"
      open={showFollowersModal}
      onCancel={() => setShowFollowersModal(false)}
      centered
      footer={null}
    >
      {loading && (
        <div className="h-40 flex justify-center items-center">
          <Spinner />
        </div>
      )}

      {!loading && followers.length === 0 && (
        <p className="text-center text-gray-500">No followers</p>
      )}

      <div className="flex flex-col gap-5">
        {followers.map((follower) => (
          <div
            className="flex gap-5 items-center border border-gray-300 border-solid p-3 rounded cursor-pointer"
            key={follower._id}
            onClick={() => router.push(`/profile/${follower._id}`)}

          >
            <img
              src={follower.profilePic}
              alt="profile-pic"
              className="w-10 h-10 rounded-full"
            />
            <div className="flex-1 text-sm">
              <p className="font-semibold">{follower.name}</p>
              <p className="text-sm text-gray-500">{follower.email}</p>
            </div>
            <Button
              type="primary"
              danger
              onClick={(e) => {
                e.stopPropagation();
                handleRejectFollower(follower._id);
              }}
            >
              Reject
            </Button>
          </div>
        ))}
      </div>
    </Modal>
  );
}

export default FollowersModal;
