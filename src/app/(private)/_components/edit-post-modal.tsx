"use client";
import React from "react";
import { Modal, Upload, Input, message, Select } from "antd";
import { PostType, UserType } from "@/interfaces";
import { updatePost } from "@/server-actions/posts";
import { getFollowingOfUser } from "@/server-actions/users";
import { uploadImageToFirebase } from "@/helpers/uploads";

interface EditPostModalProps {
  visible: boolean;
  onClose: () => void;
  post: PostType;
  user: UserType;
  onUpdate: (updatedPost: Partial<PostType>) => void;
}

const EditPostModal: React.FC<EditPostModalProps> = ({
  visible,
  onClose,
  post,
  user,
  onUpdate,
}) => {
  const [media, setMedia] = React.useState<any[]>([]);
  const [caption, setCaption] = React.useState<string>(post.caption || "");
  const [hashTags, setHashTags] = React.useState<string>(
    post.hashTags.join(", ") || ""
  );
  const [taggedUserIds, setTaggedUserIds] = React.useState<any[]>(
    post.tags || []
  );
  const [loading, setLoading] = React.useState<boolean>(false);
  const [following, setFollowing] = React.useState<any[]>([]);

  React.useEffect(() => {
    setMedia(post.media.map((url) => ({ uid: url, name: url, status: 'done', url })));
    getFollowing();
  }, [post.media]);

  const handleUpdate = async () => {
    try {
      setLoading(true);
      let mediaUrls = [];

      for (let i = 0; i < media.length; i++) {
        if (media[i].originFileObj) {
          const url = await uploadImageToFirebase(media[i].originFileObj);
          mediaUrls.push(url);
        } else {
          mediaUrls.push(media[i].url);
        }
      }

      const updatedPost: Partial<PostType> = {
        media: mediaUrls,
        caption,
        hashTags: hashTags.trim().split(","),
        tags: taggedUserIds,
      };

      const response = await updatePost(post._id, updatedPost);
      if (response.success) {
        message.success("Post updated successfully");
        onUpdate(updatedPost);
        onClose();
      } else {
        message.error(response.message);
      }
    } catch (error: any) {
      message.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const getFollowing = async () => {
    try {
      const response = await getFollowingOfUser(user._id);
      if (response.success) {
        const tempFollowing = response.data.map((user: any) => ({
          label: user.name,
          value: user._id,
        }));
        setFollowing(tempFollowing);
      } else {
        message.error(response.message);
      }
    } catch (error: any) {
      message.error(error.message);
    }
  };

  return (
    <Modal
      title="EDIT POST"
      visible={visible}
      onCancel={onClose}
      centered
      okText="Update"
      onOk={handleUpdate}
      okButtonProps={{ loading, disabled: media.length === 0 }}
    >
      <hr className="border border-gray-300 my-3 border-solid" />

      <div className="flex flex-col gap-5">
        <Upload
          listType="picture-card"
          fileList={media}
          beforeUpload={(file) => {
            setMedia((prev) => [
              ...prev,
              {
                uid: file.uid,
                name: file.name,
                status: 'done',
                url: URL.createObjectURL(file),
                originFileObj: file,
              },
            ]);
            return false;
          }}
          multiple
          onRemove={(file) => {
            setMedia((prev) => prev.filter((f) => f.uid !== file.uid));
          }}
        >
          <div className="span text-xs text-gray-500">Upload Media</div>
        </Upload>

        <div className="flex flex-col gap-1">
          <span className="text-sm text-gray-600">Caption</span>
          <Input.TextArea
            placeholder="Caption"
            value={caption}
            onChange={(e) => {
              setCaption(e.target.value);
            }}
          />
        </div>

        <div className="flex flex-col gap-1">
          <span className="text-sm text-gray-600">Tag Users</span>
          <Select
            mode="multiple"
            placeholder="Tag Users"
            value={taggedUserIds}
            onChange={(value) => {
              setTaggedUserIds(value);
            }}
            options={following}
          />
        </div>

        <div className="flex flex-col">
          <span className="text-sm text-gray-600">Hashtags</span>
          <Input.TextArea
            placeholder="Hash Tags (comma separated)"
            value={hashTags}
            onChange={(e) => {
              setHashTags(e.target.value);
            }}
          />
        </div>
      </div>
    </Modal>
  );
};

export default EditPostModal;
