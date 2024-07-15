import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    media: {
      type: Array,
      default: [],
      required: true,
    },
    caption: {
      type: String,
      required: true,
    },
    hashTags: {
      type: Array,
      default: [],
      required: true,
    },
    tags: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "users",
      default: [],
    },
    likedBy: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "users",
      default: [],
      required: true,
    },
    savedBy : {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "users",
      default: [],
      required: true,
    },
    commentsCount: {
      type: Number,
      default: 0,
      required: true,
    },
    sharesCount: {
      type: Number,
      default: 0,
      required: true,
    },
    isArchived: {
      type: Boolean,
      default: false,
      required: true,
    },
  },
  { timestamps: true }
);

if (mongoose.models && mongoose.models["posts"]) {
  delete mongoose.models["posts"];
}

const PostModel = mongoose.model("posts", postSchema);
export default PostModel;