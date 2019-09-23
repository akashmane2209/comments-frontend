import mongoose, { Schema } from "mongoose";

//Define model schema
export const schema = new Schema({
  name:String
});

export default mongoose.model("User", schema);
