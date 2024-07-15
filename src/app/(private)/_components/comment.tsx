import { getDateTimeFormat } from "@/helpers/date-time-formats";
import { CommentType } from "@/interfaces";
import {
  getRepliesOfAComment,
  replyToAComment,
} from "@/server-actions/comments";
import { addNewNotification } from "@/server-actions/notifications";
import useUsersStore, { UsersStoreType } from "@/store/users";
import { Button, message } from "antd";
import React from "react";

function Comment({ comment }: { comment: CommentType }) {
  const { loggedInUserData }: UsersStoreType = useUsersStore();
  const [showReplyInput, setShowReplyInput] = React.useState(false);
  const [replyText, setReplyText] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [repliesCount, setRepliesCount] = React.useState(
    comment.repliesCount || 0
  );
  const [showReplys, setShowReplys] = React.useState(false);
  const [replys, setReplys] = React.useState<CommentType[]>([]);

  const handleAddReply = async () => {
    try {
      setLoading(true);
      const payload = {
        user: loggedInUserData?._id!,
        post: comment.post,
        content: replyText,
        isReply: true,
        replyTo: comment._id,
      };

      const response: any = await replyToAComment({
        payload,
        postId: comment.post,
      });
      if (response?.success) {
        message.success(response.message);
        setReplyText("");
        setShowReplyInput(false);
        setRepliesCount(repliesCount + 1);
        addNewNotification({
          user : comment.user._id,
          type : "comment",
          text : `@${loggedInUserData?.name} replied to your comment`,
          onClickPath : `/post/${comment.post}`,
          read : false
        })
      } else {
        message.error(response.message);
      }
    } catch (error: any) {
      message.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const getReplies = async () => {
    try {
      setLoading(true);
      const response = await getRepliesOfAComment(comment._id);
      if (response?.success) {
        setReplys(response.data);
      } else {
        message.error(response.message);
      }
    } catch (error: any) {
      message.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const getShowHideReplyText = () => {
    if (!loading && !showReplys) {
      return `--- View replies (${repliesCount})`;
    }

    if (loading) {
      return "Loading replies...";
    }

    return "--- Hide replies";
  };

  return (
    <div className="flex gap-5">
      <img src={comment.user.profilePic} className="w-10 h-10 rounded-full" />
      <div className="flex flex-col gap-1 w-full">
        <div className="flex gap-1">
          <span className="font-bold text-sm text-primary">
            @{comment.user.name}
          </span>
          <span className="text-gray-600 text-sm">{comment.content}</span>
        </div>

        <div className="flex gap-5">
          <span className="text-gray-500 text-xs">
            {getDateTimeFormat(comment.createdAt)}
          </span>

          <span
            className="text-xs text-gray-500 cursor-pointer"
            onClick={() => {
              setShowReplyInput(!showReplyInput);
              setShowReplys(false);
            }}
          >
            {showReplyInput ? "Cancel" : "Reply"}
          </span>
        </div>

        {showReplyInput && (
          <div className="flex gap-5 w-full">
            <input
              type="text"
              placeholder="Reply to this comment"
              className="bg-gray-200 px-5 py-3 border-none focus:outline-none w-[60%] rounded"
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
            />

            {replyText && (
              <Button onClick={handleAddReply} loading={loading} type="text">
                Post
              </Button>
            )}
          </div>
        )}

        {repliesCount > 0 && (
          <span
            className="text-xs text-gray-500 cursor-pointer mt-2"
            onClick={() => {
              if (!showReplys) {
                getReplies();
                setShowReplys(true);
              } else {
                setShowReplys(false);
                setReplys([]);
              }
            }}
          >
            {getShowHideReplyText()}
          </span>
        )}

        {showReplys && (
          <div className="flex flex-col gap-5  mt-5">
            {replys.map((reply) => (
              <Comment key={reply._id} comment={reply} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Comment;