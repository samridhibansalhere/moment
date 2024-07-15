'use client'
import { PostType } from "@/interfaces";
import React from "react";
import PostItem from "../../_components/post-item";
import { useRouter } from "next/navigation";

function PostsSearchResults({ posts }: { posts: PostType[] }) {
  const router = useRouter();
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mt-7">
      {posts.map((post: any) => (
        <PostItem
          post={post}
          key={post._id}
          type="feed"
          reloadData={() => {}}
          onClick={() => {
            router.push(`/post/${post._id}`);
          }}
        />
      ))}
    </div>
  );
}

export default PostsSearchResults;