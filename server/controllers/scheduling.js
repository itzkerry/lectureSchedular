import Course from "../models/course.js";
import Lecture from "../models/lecture.js";
import User from "../models/user.js";
import jwt from "jsonwebtoken";

const getAllCourses = async (req, res) => {
  try {
    const cources = await Course.find({});
    return res.status(200).json(cources);
  } catch (err) {
    return res.status(500).json({ error: "Internal server error" });
  }
};

const getAllInstructor = async (req, res) => {
  try {
    const instructors = await User.find({ role: "instructor" });
    return res.status(200).json(instructors);
  } catch (err) {
    return res.status(500).json({ error: "Internal server error" });
  }
};

const addCoures = async (req, res) => {
  try {
    const { name, level, description, image_url } = req.body;
    const exist = await Course.findOne({ name });
    if (exist) {
      return res.status(400).json({ message: "course already exist" });
    }

    const coures = await Course.create({ name, level, description, image_url });
    return res.status(200).json({ message: "course created" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

const addLecture = async (req, res) => {
  try {
    const { courseId, instructorId, date } = req.body;
    const normalDate = new Date(date);
    normalDate.setUTCHours(0, 0, 0, 0);

    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);

    if (normalDate < today) {
      return res.status(400).json({ message: "Past date selected" });
    }
    const dateConflict = await Lecture.findOne({
      instructorId,
      date: normalDate,
    }).populate("courseId", "name");

    if (dateConflict) {
      return res.status(400).json({
        message: `Instructor is already assingned to lecture on this date for ${dateConflict.courseId.name} course`,
      });
    }

    const lecture = await Lecture.create({
      courseId,
      instructorId,
      date: normalDate,
    });
    return res.status(200).json({ message: "lecture shedule successfully" });
  } catch (err) {
    return res.status(500).json({ error: "Internal server error" });
  }
};

const getAllMyLectures = async (req, res) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({ message: "Access denied." });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const lectures = await Lecture.find({ instructorId: decoded.id }).populate(
      "courseId",
      "name description level",
    );
    return res.status(200).json(lectures);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

const getCourseLectures = async (req, res) => {
  try {
    const { courseId } = req.params;
    const [course, lectures] = await Promise.all([
      Course.findById(courseId).select("name level description"),
      Lecture.find({ courseId }).populate("instructorId", "name").sort("date"),
    ]);

    return res.status(200).json({ course, lectures });
  } catch (err) {
    return res.status(500).json({ error: "Internal server error" });
  }
};

export {
  getAllCourses,
  getAllInstructor,
  addLecture,
  addCoures,
  getAllMyLectures,
  getCourseLectures,
};
