"use client";
import { getDateTimeFormat } from "@/helpers/date-time-formats";
import { PostType } from "@/interfaces";
import { likePost, unlikePost } from "@/server-actions/likes";
import useUsersStore, { UsersStoreType } from "@/store/users";
import { Button, message } from "antd";
import {
  Bookmark,
  Heart,
  Share,
  CircleChevronLeft,
  CircleChevronRight,
} from "lucide-react";
import React from "react";
import LikesModal from "./likes-modal";
import { addNewComment } from "@/server-actions/comments";
import CommentsModal from "./comments-modal";
import { useRouter } from "next/navigation";
import {
  archivePost,
  savePost,
  unarchivePost,
  unsavePost,
  updatePost,
  deletePost,
} from "@/server-actions/posts";
import { addNewNotification } from "@/server-actions/notifications";
import EditPostModal from "./edit-post-modal";
import ShareMessage from "./share-message";

type postType = "feed" | "uploaded" | "tagged" | "saved" | "archived";

function PostItem({
  post,
  type = "feed",
  reloadData = () => {},
  onClick = () => {},
}: {
  post: PostType;
  type?: postType;
  reloadData?: any;
  onClick?: any;
}) {
  const router = useRouter();
  const { loggedInUserData }: UsersStoreType = useUsersStore();
  const [selectedMediaIndex, setSelectedMediaIndex] = React.useState(0);
  const [commentText, setCommentText] = React.useState("");
  const [likesCount, setLikesCount] = React.useState(post.likedBy.length || 0);
  const [commentsCount, setCommentsCount] = React.useState(
    post.commentsCount || 0
  );
  const [liked, setLiked] = React.useState(
    post.likedBy.includes(loggedInUserData?._id!)
  );
  const [saved, setSaved] = React.useState(
    post.savedBy.includes(loggedInUserData?._id!)
  );
  const [showLikesModal, setShowLikesModal] = React.useState(false);
  const [showCommentsModal, setShowCommentsModal] = React.useState(false);
  const [showEditModal, setShowEditModal] = React.useState(false);
  const [showShareModal, setShowShareModal] = React.useState(false); // Added state for ShareModal
  const [loading, setLoading] = React.useState(false);

  const likeHandler = async () => {
    try {
      const response = await likePost({
        postId: post._id,
        userId: loggedInUserData?._id!,
      });

      if (response.success) {
        setLiked(true);
        setLikesCount(likesCount + 1);
        addNewNotification({
          user: post.user._id,
          type: "like",
          text: `${loggedInUserData?.name} liked your post`,
          onClickPath: `/post/${post._id}`,
          read: false,
        });
      } else {
        message.error(response.message);
      }
    } catch (error: any) {
      message.error(error.message);
    }
  };

  const unlikeHandler = async () => {
    try {
      const response = await unlikePost({
        postId: post._id,
        userId: loggedInUserData?._id!,
      });
      if (response.success) {
        setLiked(false);
        setLikesCount(likesCount - 1);
      } else {
        message.error(response.message);
      }
    } catch (error: any) {
      message.error(error.message);
    }
  };

  const handleAddComment = async () => {
    try {
      setLoading(true);
      const payload = {
        post: post._id,
        user: loggedInUserData?._id!,
        content: commentText,
      };

      const response = await addNewComment({
        payload,
        postId: post._id,
      });

      if (response.success) {
        setCommentsCount(commentsCount + 1);
        setCommentText("");
        addNewNotification({
          user: post.user._id,
          type: "comment",
          text: `${loggedInUserData?.name} commented on your post`,
          onClickPath: `/post/${post._id}`,
          read: false,
        });
        message.success(response.message);
      } else {
        message.error(response.message);
      }
    } catch (error: any) {
      message.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const savePostHandler = async () => {
    try {
      const response = await savePost({
        postId: post._id,
        userId: loggedInUserData?._id!,
      });

      if (response.success) {
        setSaved(true);
      } else {
        message.error(response.message);
      }
    } catch (error: any) {
      message.error(error.message);
    }
  };

  const unsaveHandler = async () => {
    try {
      const response = await unsavePost({
        postId: post._id,
        userId: loggedInUserData?._id!,
      });

      if (response.success) {
        setSaved(false);
      } else {
        message.error(response.message);
      }
    } catch (error: any) {
      message.error(error.message);
    }
  };

  const archivePostHandler = async () => {
    try {
      setLoading(true);
      const response = await archivePost(post._id);
      if (response.success) {
        message.success(response.message);
        reloadData();
      } else {
        message.error(response.message);
      }
    } catch (error: any) {
      message.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const unarchiveHandler = async () => {
    try {
      setLoading(true);
      const response = await unarchivePost(post._id);
      if (response.success) {
        message.success(response.message);
        reloadData();
      } else {
        message.error(response.message);
      }
    } catch (error: any) {
      message.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePost = async (updatedPost: Partial<PostType>) => {
    try {
      setLoading(true);
      const response = await updatePost(post._id, updatedPost);
      if (response.success) {
        message.success("Post updated successfully");
        reloadData();
        setShowEditModal(false);
      } else {
        message.error(response.message);
      }
    } catch (error: any) {
      message.error("Failed to update post");
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePost = async () => {
    try {
      setLoading(true);
      const response = await deletePost(post._id);
      if (response.success) {
        message.success(response.message);
        reloadData();
      } else {
        message.error(response.message);
      }
    } catch (error: any) {
      message.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col border border-gray-300 border-solid">
      <div className="flex gap-5 bg-gray-100 p-3 items-center">
        <img src={post.user.profilePic} className="w-10 h-10 rounded-full" />

        <div
          className="flex flex-col cursor-pointer"
          onClick={() => router.push(`/profile/${post.user._id}`)}
        >
          <span className="tex-sm">{post.user.name}</span>
          <span className="text-xs text-gray-500">
            {getDateTimeFormat(post.createdAt)}
          </span>
        </div>
      </div>

      <div className="relative" onClick={onClick}>
        <img src={post.media[selectedMediaIndex]} className="w-full" />

        {post.media.length > 1 && (
          <div className="absolute inset-0 flex items-center justify-between px-2">
            <CircleChevronLeft
              className={`${selectedMediaIndex === 0 ? "opacity-0" : ""}`}
              onClick={() => setSelectedMediaIndex(selectedMediaIndex - 1)}
              color="white"
              fill="gray"
            />
            <CircleChevronRight
              color="white"
              fill="gray"
              className={`${
                selectedMediaIndex === post.media.length - 1 ? "opacity-0" : ""
              }`}
              onClick={() => setSelectedMediaIndex(selectedMediaIndex + 1)}
            />
          </div>
        )}
      </div>

      <div className="flex flex-col p-2">
        <p className="mt-5 text-sm text-gray-700">
          <b className="text-primary">@ {post.user.name}</b> {post.caption}
        </p>

        <p className="mt-2 text-xs text-gray-600">{post.hashTags.toString()}</p>

        <div className="flex justify-between mt-5">
          <div className="flex gap-5">
            <Heart
              size={16}
              fill={liked ? "red" : "none"}
              onClick={liked ? unlikeHandler : likeHandler}
            />
            <Share size={16} onClick={() => setShowShareModal(true)} /> {/* Share button opens ShareModal */}
          </div>

          <Bookmark
            size={16}
            fill={saved ? "blue" : "none"}
            onClick={saved ? unsaveHandler : savePostHandler}
          />
        </div>

        <div className="flex gap-10 mt-3">
          <p
            className="text-sm cursor-pointer font-semibold"
            onClick={() => {
              if (likesCount) {
                setShowLikesModal(true);
              }
            }}
          >
            {likesCount} Likes
          </p>
          <p
            className="text-sm font-semibold cursor-pointer"
            onClick={() => {
              if (commentsCount) {
                setShowCommentsModal(true);
              }
            }}
          >
            {" "}
            {commentsCount} Comments
          </p>
        </div>

        {type === "feed" && (
          <div className="flex gap-5 mt-3 items-center">
            <input
              type="text"
              placeholder="Add a comment..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              className="bg-gray-200 px-5 py-3 border-none focus:outline-none w-[85%] rounded"
            />
            {commentText && (
              <Button onClick={handleAddComment} loading={loading} type="text">
                Post
              </Button>
            )}
          </div>
        )}

        {type === "uploaded" && post.user._id === loggedInUserData?._id && (
          <div className="flex gap-5 mt-3 items-center">
            {!post.isArchived ? (
              <Button
                type="primary"
                size="small"
                onClick={archivePostHandler}
              >
                Archive
              </Button>
            ) : (
              <Button type="primary" size="small" onClick={unarchiveHandler}>
                Unarchive
              </Button>
            )}
            <Button
              size="small"
              type="primary"
              onClick={() => setShowEditModal(true)}
            >
              Edit
            </Button>
            <Button danger size="small" type="primary" onClick={handleDeletePost}>
              Delete
            </Button>
          </div>
        )}
      </div>

      {showLikesModal && (
        <LikesModal
          post={post}
          showLikesModal={showLikesModal}
          setShowLikesModal={setShowLikesModal}
        />
      )}

      {showCommentsModal && (
        <CommentsModal
          post={post}
          showCommentsModal={showCommentsModal}
          setShowCommentsModal={setShowCommentsModal}
        />
      )}
      {post.user && (
        <EditPostModal
          visible={showEditModal}
          onClose={() => setShowEditModal(false)}
          post={post}
          onUpdate={handleUpdatePost}
          user={post.user}
        />
      )}
      <ShareMessage
        open={showShareModal}
        setOpen={setShowShareModal}
        messageToShare={post._id} // Pass the post ID to the share message
      />
    </div>
  );
}

export default PostItem;
