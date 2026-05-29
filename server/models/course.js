import mongoose from "mongoose";

const CourseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    minlength: 5,
    maxlength: 30,
  },
  level: {
    type: String,
    enum: ["Beginner", "Intermediate", "Advanced"],
    required: true,
  },
  description: {
    type: String,
  },
  image_url: String,
});

export default mongoose.model("Course", CourseSchema);
