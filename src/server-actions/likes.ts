"use server";
import { connectToMongoDB } from "@/config/database";
import PostModel from "@/models/post-model";

connectToMongoDB();

export const likePost = async ({
  postId = "",
  userId = "",
}: {
  postId: string;
  userId: string;
}) => {
  try {
    await PostModel.findByIdAndUpdate(postId, {
      $push: {
        likedBy: userId,
      },
    });

    return {
      success: true,
      message: "Post liked successfully!",
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message,
    };
  }
};

export const unlikePost = async ({
  postId = "",
  userId = "",
}: {
  postId: string;
  userId: string;
}) => {
  try {
    await PostModel.findByIdAndUpdate(postId, {
      $pull: {
        likedBy: userId,
      },
    });

    return {
      success: true,
      message: "Post unliked successfully!",
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message,
    };
  }
};

export const getPostLikes = async (postId: string) => {
  try {
    const postWithLikedUsers = await PostModel.findById(postId).populate(
      "likedBy"
    );

    return {
      success: true,
      data: JSON.parse(JSON.stringify(postWithLikedUsers?.likedBy)),
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message,
    };
  }
};