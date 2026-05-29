import express from "express";
import { isAdmin } from "./../middleware/isAdmin.js";
import {
  addCoures,
  addLecture,
  getAllCourses,
  getAllInstructor,
  getAllMyLectures,
  getCourseLectures,
} from "../controllers/scheduling.js";

const router = express.Router();

router.post("/course", isAdmin, addCoures);
router.get("/course", isAdmin, getAllCourses);
router.post("/lecture", isAdmin, addLecture);
router.get("/instructors", isAdmin, getAllInstructor);
router.get("/course/:courseId/lectures", isAdmin, getCourseLectures);
router.get("/lecture/myLecture", getAllMyLectures);

export default router;
