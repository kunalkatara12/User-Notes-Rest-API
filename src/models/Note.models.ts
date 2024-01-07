import { randomUUID } from "crypto";
import { Schema, model } from "mongoose";
export const noteSchema = new Schema(
  {
    
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

export default model("Note", noteSchema);
