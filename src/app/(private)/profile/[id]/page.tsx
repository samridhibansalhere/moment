import { getUserInfoById } from "@/server-actions/users";
import React from "react";
import UserBasicDetails from "./_components/user-basic-details";
import PendingFollowRequests from "./_components/pending-follow-requests";
import UserRelatedPosts from "./_components/users-related-posts";


async function ProfilePage({
  params,
}: {
  params: {
    id: string;
  };
}) {
  const userInfoResponse = await getUserInfoById(params.id);
  const userInfo = userInfoResponse.data;
  return (
    <div>
      <UserBasicDetails user={userInfo} />

      <PendingFollowRequests user={userInfo} />

      <UserRelatedPosts user={userInfo} />
    </div>
  );
}

export default ProfilePage;