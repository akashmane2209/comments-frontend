import mongoose, { Schema } from "mongoose";

export const schema = new Schema({
  user: {
    type: Schema.ObjectId,
    ref: "User"
  },
  reply: [{ type: Schema.ObjectId, ref: "Comment" }],
  content: String,
  created: { type: Date, default: Date.now },
  type: String,
  likes: [{ type: Schema.ObjectId, ref: "User", default: [] }]
});

export default mongoose.model("Comment", schema);
