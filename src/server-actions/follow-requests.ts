"use server";

import { connectToMongoDB } from "@/config/database";
import UserModel from "@/models/user-model";
import { revalidatePath } from "next/cache";

connectToMongoDB();

export const sendFollowRequest = async ({
  followRequestReceiverId,
  followRequestSenderId,
}: {
  followRequestSenderId: string;
  followRequestReceiverId: string;
}) => {
  try {
    // add receiver id to senders followRequestsSent
    const newSenderDoc = await UserModel.findByIdAndUpdate(
      followRequestSenderId,
      {
        $push: { followRequestsSent: followRequestReceiverId },
      },
      { new: true }
    );

    // add sender id to receivers followRequestsReceived
    await UserModel.findByIdAndUpdate(followRequestReceiverId, {
      $push: { followRequestsReceived: followRequestSenderId },
    });

    revalidatePath(`/profile/${followRequestReceiverId}`);

    return {
      success: true,
      message: "Follow request sent successfully",
      data: JSON.parse(JSON.stringify(newSenderDoc)),
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message,
    };
  }
};

export const acceptFollowRequest = async ({
  followRequestReceiverId,
  followRequestSenderId,
}: {
  followRequestSenderId: string;
  followRequestReceiverId: string;
}) => {
  try {
    // add senderid to receiver's followers and remove from followRequestsReceived
    await UserModel.findByIdAndUpdate(followRequestReceiverId, {
      $push: { followers: followRequestSenderId },
      $pull: { followRequestsReceived: followRequestSenderId },
    });

    // add receiverid to sender's following and remove from followRequestsSent
    await UserModel.findByIdAndUpdate(followRequestSenderId, {
      $push: { following: followRequestReceiverId },
      $pull: { followRequestsSent: followRequestReceiverId },
    });

    return {
      success: true,
      message: "Follow request accepted successfully",
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message,
    };
  }
};

export const rejectFollowRequest = async ({
  followRequestReceiverId,
  followRequestSenderId,
}: {
  followRequestSenderId: string;
  followRequestReceiverId: string;
}) => {
  try {
    // remove senderid from receiver's followRequestsReceived
    await UserModel.findByIdAndUpdate(followRequestReceiverId, {
      $pull: { followRequestsReceived: followRequestSenderId },
    });

    // remove receiverid from sender's followRequestsSent
    await UserModel.findByIdAndUpdate(followRequestSenderId, {
      $pull: { followRequestsSent: followRequestReceiverId },
    });

    return {
      success: true,
      message: "Follow request rejected successfully",
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message,
    };
  }
};

export const cancelFollowRequest = async ({
  followRequestReceiverId,
  followRequestSenderId,
}: {
  followRequestSenderId: string;
  followRequestReceiverId: string;
}) => {
  try {
    // remove receiverid from sender's followRequestsSent
    const newSenderDoc = await UserModel.findByIdAndUpdate(
      followRequestSenderId,
      {
        $pull: { followRequestsSent: followRequestReceiverId },
      },
      { new: true }
    );

    // remove senderid from receiver's followRequestsReceived
    await UserModel.findByIdAndUpdate(followRequestReceiverId, {
      $pull: { followRequestsReceived: followRequestSenderId },
    });

    return {
      success: true,
      message: "Follow request cancelled successfully",
      data: JSON.parse(JSON.stringify(newSenderDoc)),
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message,
    };
  }
};

export const unfollowUser = async ({
  senderId = "",
  receiverId = "",
}: {
  senderId: string;
  receiverId: string;
}) => {
  try {
    // remove receiverid from sender's following
    const newSenderDoc = await UserModel.findByIdAndUpdate(
      senderId,
      {
        $pull: { following: receiverId },
      },
      { new: true }
    );

    // remove senderid from receiver's followers
    await UserModel.findByIdAndUpdate(receiverId, {
      $pull: { followers: senderId },
    });

    return {
      success: true,
      message: "Unfollowed user successfully",
      data: JSON.parse(JSON.stringify(newSenderDoc)),
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message,
    };
  }
};