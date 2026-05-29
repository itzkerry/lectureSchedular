import mongoose from "mongoose";

const LectureSchema = new mongoose.Schema({
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
    require: true,
  },
  instructorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    require: true,
  },
  date: {
    type: Date,
    require: true,
  },
});

export default mongoose.model("Lecture", LectureSchema);
