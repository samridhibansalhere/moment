import { PostType, UserType } from "@/interfaces";
import { getPostLikes } from "@/server-actions/likes";
import { Modal, message } from "antd";
import React from "react";
import { useRouter } from "next/navigation";

function LikesModal({
  showLikesModal,
  setShowLikesModal,
  post,
}: {
  showLikesModal: boolean;
  setShowLikesModal: (show: boolean) => void;
  post: PostType;
}) {
  const [loading, setLoading] = React.useState(false);
  const [usersLiked, setUsersLiked] = React.useState<UserType[]>([]);
  const router = useRouter();

  const getLikes = async () => {
    try {
      setLoading(true);
      const response: any = await getPostLikes(post._id);
      if (response.success) {
        setUsersLiked(response.data);
      } else {
        message.error(response.message);
      }
    } catch (error: any) {
      console.log(error.message);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    getLikes();
  }, [showLikesModal]);

  return (
    <Modal
      open={showLikesModal}
      onCancel={() => setShowLikesModal(false)}
      footer={null}
      centered
      title="LIKES"
    >
      <div className="flex flex-col gap-5">
        {usersLiked?.map((user) => (
          <div
            className="flex gap-5 items-center border border-gray-300 border-solid p-3 rounded cursor-pointer"
            key={user._id}
            onClick={() => router.push(`/profile/${user._id}`)}
          >
            <img
              src={user.profilePic}
              alt="profile-pic"
              className="w-10 h-10 rounded-full"
            />
            <div className="text-sm">
              <p className="font-semibold">{user.name}</p>
              <p className="text-sm text-gray-500">{user.email}</p>
            </div>
          </div>
        ))}
      </div>
    </Modal>
  );
}

export default LikesModal;