"use client";
import { searchUsers } from "@/server-actions/users";
import { searchPosts } from "@/server-actions/posts";
import { Button, Input, Radio, message } from "antd";
import React, { useEffect, useState } from "react";
import UsersSearchResults from "./_components/users-search-result";
import PostsSearchResults from "./_components/posts-search-results";
import { debounce } from "lodash";

function SearchPage() {
  const [searchFor, setSearchFor] = useState<"users" | "posts">("users");
  const [users, setUsers] = useState([]);
  const [posts, setPosts] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [loading, setLoading] = useState(false);

  // Fetch data when the component mounts or searchFor state changes
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        let response = null;
        if (searchFor === "users") {
          response = await searchUsers("");
          if (response.success) {
            setUsers(response.data);
          } else {
            message.error(response.message);
          }
        } else if (searchFor === "posts") {
          response = await searchPosts("");
          if (response.success) {
            setPosts(response.data);
          } else {
            message.error(response.message);
          }
        }
      } catch (error) {
        message.error(`Failed to fetch ${searchFor}`);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [searchFor]);

  // Debounce search handler to avoid excessive API calls
  const debounceSearchHandler = debounce(async (value) => {
    try {
      setLoading(true);
      let response = null;
      if (searchFor === "users") {
        response = await searchUsers(value);
      } else {
        response = await searchPosts(value);
      }
      if (response.success) {
        if (searchFor === "users") {
          setUsers(response.data);
        } else {
          setPosts(response.data);
        }
      } else {
        message.error(response.message);
      }
    } catch (error) {
      message.error("Search failed");
    } finally {
      setLoading(false);
    }
  }, 500); // 500ms debounce delay

  // Handle input change and trigger debounce search
  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchValue(value);
    debounceSearchHandler(value);
  };

  return (
    <div>
      <h1 className="text-xl font-bold text-primary">
        Search Users, Posts, Hashtags
      </h1>

      <div className="flex gap-5 mt-5">
        <Input
          value={searchValue}
          onChange={handleInputChange}
          placeholder="Search Users, Posts, Hashtags"
        />
        <Button type="primary" onClick={() => debounceSearchHandler(searchValue)} loading={loading}>
          Search
        </Button>
      </div>

      <div className="mt-5 flex gap-5 items-center">
        <span>Search For</span>
        <Radio.Group
          onChange={(e) => setSearchFor(e.target.value)}
          value={searchFor}
        >
          <Radio value="users">Users</Radio>
          <Radio value="posts">Posts</Radio>
        </Radio.Group>
      </div>

      {searchFor === "users" ? (
        <UsersSearchResults users={users} />
      ) : (
        <PostsSearchResults posts={posts} />
      )}
    </div>
  );
}

export default SearchPage;
