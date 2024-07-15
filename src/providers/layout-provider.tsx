"use client";
import React, { useEffect, useState } from "react";
import Sidebar from "./layout-components/sidebar";
import { usePathname } from "next/navigation";
import { message } from "antd";
import { getCurrentUserFromMongoDB } from "@/server-actions/users";
import useUsersStore, { UsersStoreType } from "@/store/users";
import Spinner from "@/components/spinner";

function LayoutProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  if (pathname.includes("sign-in") || pathname.includes("sign-up")) {
    return <>{children}</>;
  }

  const { setLoggedInUserData }: UsersStoreType = useUsersStore() as any;
  const [loading, setLoading] = useState<boolean>(false);
  const getCurrentUserData = async () => {
    try {
      setLoading(true);
      const response = await getCurrentUserFromMongoDB();
      if (response.success) {
        setLoggedInUserData(response.data);
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
    getCurrentUserData();
  }, []);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="flex lg:flex-row flex-col h-screen">
      <Sidebar/>
      <div className="py-10 flex-1 px-7 bg-gray-200 overflow-y-scroll">{children}</div>
    </div>
  );
}

export default LayoutProvider;