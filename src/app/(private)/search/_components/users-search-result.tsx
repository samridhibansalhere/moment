import { UserType } from "@/interfaces";
import React from "react";
import { useRouter } from "next/navigation";

function UsersSearchResults({ users }: { users: UserType[] }) {
  const router = useRouter();
  return (
    <div className="flex flex-col gap-5 mt-7">
      {users.map((user) => (
        <div
          key={user._id}
          className="bg-gray-100 rounded p-3 flex gap-5 items-center 
          border border-solid border-gray-300 cursor-pointer"
          onClick={() => router.push(`/profile/${user._id}`)}
        >
          <div>
            <img
              src={user.profilePic}
              alt="profile"
              className="w-12 h-12 rounded-full"
            />
          </div>
          <div>
            <span className="font-bold text-sm">{user.name}</span>

            <div className="flex gap-5">
              <span className="text-xs">{user.email}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default UsersSearchResults;