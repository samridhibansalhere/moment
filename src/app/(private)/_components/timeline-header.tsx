"use client";
import useUsersStore, { UsersStoreType } from "@/store/users";
import { Button } from "antd";
import React from "react";
import UploadNewPostModal from "./upload-post-modal";

function TimelineHeader() {
  const { loggedInUserData }: UsersStoreType = useUsersStore();
  const [showNewPostModal, setShowNewPostModal] = React.useState(false);
  return (
    <div className="flex justify-between items-center">
      <h1 className="text-lg text-primary">
       Here is your meticulously crafted timeline{" "}
        <b className="text-info">{loggedInUserData?.name}</b>
      </h1>

      <Button
        type="primary"
        onClick={() => setShowNewPostModal(true)}
        size="small"
        className="h-8"
      >
        Upload Post
      </Button>

      {showNewPostModal && (
        <UploadNewPostModal
          showNewPostModal={showNewPostModal}
          setShowNewPostModal={setShowNewPostModal}
          user={loggedInUserData!}
        />
      )}
    </div>
  );
}

export default TimelineHeader;