"use client";
import PostItem from "@/app/(private)/_components/post-item";
import { UserType } from "@/interfaces";
import { getPostsOfUserByType } from "@/server-actions/posts";
import useUsersStore, { UsersStoreType } from "@/store/users";
import { Tabs, message } from "antd";
import React, { useEffect } from "react";

function UserRelatedPosts({ user }: { user: UserType }) {
  const { loggedInUserData }: UsersStoreType = useUsersStore();

  let canViewPosts = false;

  if (loggedInUserData?._id === user._id) {
    canViewPosts = true;
  }

  if (!user.isPrivateAccount) {
    canViewPosts = true;
  }

  if (user.followers.includes(loggedInUserData?._id!)) {
    canViewPosts = true;
  }

  if (!canViewPosts) {
    return (
      <div className="mt-10">
        <span className="text-gray-700 text-sm">
          This account is private. Follow to see their posts.
        </span>
      </div>
    );
  }

  const [data, setData] = React.useState<any>({
    uploaded: [],
    tagged: [],
    saved: [],
    archived: [],
  });
  const [loading, setLoading] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState("1");
  const tabsAndTheirValues: any = {
    1: "Uploaded",
    2: "Tagged",
    3: "Saved",
    4: "Archived",
  };

  const getData = async () => {
    try {
      setLoading(true);
      const response = await getPostsOfUserByType({
        userId: user._id,
        type: tabsAndTheirValues[Number(activeTab)].toLowerCase(),
      });

      if (response.success) {
        const newData: any = { ...data };
        const tabName = tabsAndTheirValues[Number(activeTab)].toLowerCase();
        newData[tabName] = response.data;
        setData(newData);
      } else {
        message.error(response.message);
      }
    } catch (error: any) {
      message.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getData();
  }, [activeTab]);

  const renderPostsOfSelectedTab = () => {
    const tabName = tabsAndTheirValues[Number(activeTab)].toLowerCase();
    const dataOfTab: any[] = data[tabName];

    if (dataOfTab.length === 0) {
      return <div className="text-center text-gray-500">No posts found</div>;
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {dataOfTab.map((post: any) => (
          <PostItem
            key={post._id}
            post={post}
            type="uploaded"
            reloadData={getData}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="mt-8">
      <Tabs
        activeKey={activeTab}
        onChange={(key) => setActiveTab(key)}
        color="blue"
      >
        <Tabs.TabPane tab="Uploaded" key="1">
          {renderPostsOfSelectedTab()}
        </Tabs.TabPane>

        <Tabs.TabPane tab="Tagged" key="2">
          {renderPostsOfSelectedTab()}
        </Tabs.TabPane>

        <Tabs.TabPane tab="Saved" key="3">
          {renderPostsOfSelectedTab()}
        </Tabs.TabPane>

        {loggedInUserData?._id === user._id && (
          <Tabs.TabPane tab="Archived" key="4">
            {renderPostsOfSelectedTab()}
          </Tabs.TabPane>
        )}
      </Tabs>
    </div>
  );
}

export default UserRelatedPosts;