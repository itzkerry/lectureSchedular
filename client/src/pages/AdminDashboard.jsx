import { useState, useEffect } from "react";
import API from "../api";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("overview");

  const [courseData, setCourseData] = useState({
    name: "",
    level: "Beginner",
    description: "",
    image_url: "",
  });
  const [lectureData, setLectureData] = useState({
    courseId: "",
    instructorId: "",
    date: "",
  });

  const [courses, setCourses] = useState([]);
  const [instructors, setInstructors] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [coursesRes, instructorsRes] = await Promise.all([
          API.get("/schedule/course"),
          API.get("/schedule/instructors"),
        ]);
        console.log(coursesRes.data);
        setCourses(coursesRes.data);
        setInstructors(instructorsRes.data);
      } catch (err) {
        console.error("Error loading operational dashboard data", err);
      }
    };
    fetchData();
  }, []);

  const handleCourseSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post("/schedule/course", courseData);
      toast.success(res.data.message);
      setCourseData({
        name: "",
        level: "Beginner",
        description: "",
        image_url: "",
      });
    } catch (err) {
      console.log(err);
      toast.error(err.response?.data?.message || "Failed to create course");
    }
  };

  const handleLectureSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post("/schedule/lecture", lectureData);
      toast.success(res.data.message);
      setLectureData({ courseId: "", instructorId: "", date: "" });
    } catch (err) {
      toast.error(err.response?.data?.message || "Scheduling failed");
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white flex">
      {/* 🧭 SIDEBAR NAVIGATION */}
      <aside className="w-64 h-screen sticky top-0 bg-slate-800 border-r border-slate-700 p-6 flex flex-col justify-between">
        <div>
          <div className="mb-8">
            <h1 className="text-2xl font-black tracking-wider text-teal-400">
              ADMIN CONTROL
            </h1>
          </div>

          <nav className="space-y-2">
            <button
              onClick={() => {
                setActiveTab("overview");
              }}
              className={`w-full text-left py-3 px-4 rounded-lg font-medium transition-colors ${activeTab === "overview" ? "bg-teal-500 text-white" : "text-slate-400 hover:bg-slate-700/50 hover:text-slate-200"}`}
            >
              📊 Schedule Overview
            </button>
            <button
              onClick={() => {
                setActiveTab("addCourse");
              }}
              className={`w-full text-left py-3 px-4 rounded-lg font-medium transition-colors ${activeTab === "addCourse" ? "bg-teal-500 text-white" : "text-slate-400 hover:bg-slate-700/50 hover:text-slate-200"}`}
            >
              ➕ Add New Course
            </button>
            <button
              onClick={() => {
                setActiveTab("addLecture");
              }}
              className={`w-full text-left py-3 px-4 rounded-lg font-medium transition-colors ${activeTab === "addLecture" ? "bg-teal-500 text-white" : "text-slate-400 hover:bg-slate-700/50 hover:text-slate-200"}`}
            >
              📅 Schedule Lecture
            </button>
          </nav>
        </div>

        <button
          onClick={async () => {
            await API.post("/auth/logout");
            window.location.reload();
          }}
          className="w-full bg-slate-700 hover:bg-red-500/20 hover:text-red-400 transition-all py-2 rounded-lg font-semibold text-sm"
        >
          Log Out
        </button>
      </aside>

      <main className="flex-1 p-10 max-w-5xl mx-auto ">
        {activeTab === "overview" && (
          <div>
            <h2 className="text-3xl font-extrabold mb-4">
              Active Courses Catalog
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 ">
              {courses.length === 0 ? (
                <p className="text-slate-500 italic col-span-2">
                  No courses found in database.
                </p>
              ) : (
                courses.map((c) => (
                  <Link
                    to={`/course/${c._id}/lecture`}
                    key={c._id}
                    className="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden shadow-md"
                  >
                    <div className="relative w-full h-40 flex items-center justify-center text-2xl z-2 font-bold text-gray-500 ">
                      {c.name}
                      {c.image_url && (
                        <img
                          src={c.image_url}
                          alt={c.name}
                          className="absolute w-full h-40 object-cover text-xs z-10"
                        />
                      )}
                    </div>
                    <div className="p-5 flex items-center justify-between">
                      <div className="flex flex-col">
                        <h3 className="text-xl font-bold text-white mb-2">
                          {c.name}
                        </h3>
                        <p className="text-slate-400 text-sm line-clamp-3">
                          {c.description}
                        </p>
                      </div>
                      <span className="inline-block px-2.5 py-1 pb-1.5 text-xs font-bold rounded bg-teal-500/10 text-teal-400 mb-3">
                        {c.level}
                      </span>
                    </div>
                  </Link>
                ))
              )}
            </div>
          </div>
        )}

        {activeTab === "addCourse" && (
          <div className="max-w-xl bg-slate-800 p-8 rounded-xl border border-slate-700 shadow-xl">
            <h2 className="text-2xl font-bold mb-1">Create Course</h2>

            <form onSubmit={handleCourseSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-400 mb-1">
                  Course Title
                </label>
                <input
                  type="text"
                  required
                  value={courseData.name}
                  onChange={(e) =>
                    setCourseData({ ...courseData, name: e.target.value })
                  }
                  minLength={5}
                  maxLength={30}
                  placeholder="MERN Stack Masterclass"
                  className="w-full p-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-teal-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-400 mb-1">
                  Level
                </label>
                <select
                  value={courseData.level}
                  onChange={(e) =>
                    setCourseData({ ...courseData, level: e.target.value })
                  }
                  className="w-full p-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-teal-500"
                >
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-400 mb-1">
                  Description
                </label>
                <textarea
                  value={courseData.description}
                  onChange={(e) =>
                    setCourseData({
                      ...courseData,
                      description: e.target.value,
                    })
                  }
                  placeholder="write description about the project"
                  rows="4"
                  className="w-full p-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-teal-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-400 mb-1">
                  Course cover Image URL
                </label>
                <input
                  type="text"
                  value={courseData.image_url}
                  onChange={(e) =>
                    setCourseData({ ...courseData, image_url: e.target.value })
                  }
                  placeholder="https://images.unsplash.com/photo-..."
                  className="w-full p-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-teal-500"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-teal-500 py-3 rounded-lg font-bold hover:bg-teal-600 transition-all"
              >
                Publish New Course
              </button>
            </form>
          </div>
        )}

        {activeTab === "addLecture" && (
          <div className="max-w-xl bg-slate-800 p-8 rounded-xl border border-slate-700 shadow-xl">
            <h2 className="text-2xl font-bold mb-1">Schedule Batch Lecture</h2>

            <form onSubmit={handleLectureSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-400 mb-1">
                  Select Core Curriculum
                </label>
                <select
                  required
                  value={lectureData.courseId}
                  onChange={(e) =>
                    setLectureData({ ...lectureData, courseId: e.target.value })
                  }
                  className="w-full p-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-teal-500"
                >
                  <option value="">Choose course</option>
                  {courses.map((c) => (
                    <option key={c._id} value={c._id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-400 mb-1">
                  Assign Instructor
                </label>
                <select
                  required
                  value={lectureData.instructorId}
                  onChange={(e) =>
                    setLectureData({
                      ...lectureData,
                      instructorId: e.target.value,
                    })
                  }
                  className="w-full p-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-teal-500"
                >
                  <option value="">Choose Instructor</option>
                  {instructors.map((i) => (
                    <option key={i._id} value={i._id}>
                      {i.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-400 mb-1">
                  Date
                </label>
                <input
                  type="date"
                  required
                  min={new Date().toISOString().split("T")[0]}
                  value={lectureData.date}
                  onChange={(e) =>
                    setLectureData({ ...lectureData, date: e.target.value })
                  }
                  className="w-full p-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-teal-500"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-teal-500 py-3 rounded-lg font-bold hover:bg-teal-600 transition-all"
              >
                Add Schedule
              </button>
            </form>
          </div>
        )}
      </main>
    </div>
  );
}
