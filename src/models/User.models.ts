import { Document ,Schema, model, ObjectId } from "mongoose";
import { noteSchema } from "./Note.models";

export const userSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  notes: [noteSchema],
});

export default model("User", userSchema);
