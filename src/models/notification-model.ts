import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    text: {
      type: String,
      required: true,
    },
    onClickPath: {
      type: String,
      required: false,
      default: "",
    },
    read: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  { timestamps: true }
);

if (mongoose.models && mongoose.models["notifications"]) {
  delete mongoose.models["notifications"];
}

const NotificationModel = mongoose.model("notifications", notificationSchema);

export default NotificationModel;