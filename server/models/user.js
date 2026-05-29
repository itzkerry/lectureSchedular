import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    userName: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true,
      minlength: 1,
      maxlength: 15,
    },
    password: {
      type: String,
      required: true,
      trim: true,
    },
    name: {
      type: String,
      required: true,
      minlength: 1,
      maxlength: 15,
    },
    role: {
      type: String,
      enum: ["admin", "instructor"],
      default: "instructor",
    },
  },
  { timestamps: true },
);

export default mongoose.model("User", UserSchema);
