import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    clerkUserId: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    profilePic: {
      type: String,
      required: false,
    },
    bio: {
      type: String,
      required: false,
      default: "",
    },
    followers: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "users",
      default: [],
    },
    following: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "users",
      default: [],
    },
    followRequestsSent: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "users",
      default: [],
    },
    followRequestsReceived: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "users",
      default: [],
    },
    isPrivateAccount: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

if (mongoose.models && mongoose.models["users"]) {
  delete mongoose.models["users"];
}

const UserModel = mongoose.model("users", userSchema);
export default UserModel;