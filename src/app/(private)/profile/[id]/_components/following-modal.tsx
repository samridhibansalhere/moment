import Spinner from "@/components/spinner";
import { UserType } from "@/interfaces";
import { getFollowingOfUser, rejectFollower } from "@/server-actions/users";
import { Modal, message } from "antd";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

function FollowingModal({
  showFollowingModal,
  setShowFollowingModal,
  user,
}: {
  showFollowingModal: boolean;
  setShowFollowingModal: (value: boolean) => void;
  user: UserType;
}) {
  const [loading, setLoading] = useState<boolean>(false);
  const [following, setFollowing] = useState<UserType[]>([]);
  const router = useRouter();

  const getData = async () => {
    try {
      setLoading(true);
      const response = await getFollowingOfUser(user._id);
      if (response.success) {
        setFollowing(response.data);
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
        // Reload the page after successful rejection
        window.location.reload();
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
    if (showFollowingModal) {
      getData();
    }
  }, [showFollowingModal]);

  return (
    <Modal
      title="FOLLOWING"
      open={showFollowingModal}
      onCancel={() => setShowFollowingModal(false)}
      centered
      footer={null}
    >
      {loading && (
        <div className="h-40 flex justify-center items-center">
          <Spinner />
        </div>
      )}

      {!loading && following.length === 0 && (
        <p className="text-center text-gray-500">
          You are not following anyone
        </p>
      )}

      <div className="flex flex-col gap-5">
        {following.map((item) => (
          <div
            className="flex gap-5 items-center border border-gray-300 border-solid p-3 rounded cursor-pointer"
            key={item._id}
            onClick={() => router.push(`/profile/${item._id}`)}
          >
            <img
              src={item.profilePic}
              alt="profile-pic"
              className="w-10 h-10 rounded-full"
            />
            <div className="text-sm">
              <p className="font-semibold">{item.name}</p>
              <p className="text-sm text-gray-500">{item.email}</p>
            </div>
            <Button
              type="primary"
              danger
              onClick={(e) => {
                e.stopPropagation();
                handleRejectFollower(item._id);
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

export default FollowingModal;
