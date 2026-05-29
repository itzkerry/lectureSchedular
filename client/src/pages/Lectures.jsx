import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../api";

export default function Lectures() {
  const { courseId } = useParams();
  const navigate = useNavigate();

  const [lectures, setLectures] = useState([]);
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourseLectures = async () => {
      try {
        setLoading(true);
        const res = await API.get(`/schedule/course/${courseId}/lectures`);
        console.log(res.data);
        setLectures(res.data.lectures);
        setCourse(res.data.course);
      } catch (err) {
        console.error("Failed to load lectures for this track", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCourseLectures();
  }, [courseId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white">
        <div className="w-8 h-8 border-4 border-teal-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="text-slate-400 hover:text-teal-400 font-medium flex items-center gap-2 mb-6 transition-colors"
        >
          ← Back to Dashboard
        </button>

        {/* 📘 EXPLICIT COURSE DETAILS HEADER */}
        <div className="mb-8">
          <span className="text-xs font-bold uppercase tracking-wider text-teal-400 px-2.5 py-1 rounded bg-teal-500/10">
            {course?.level || "Batch Track"}
          </span>
          <h1 className="text-3xl font-extrabold mt-3">
            {course?.name || "Course Details"}{" "}
          </h1>
          <p className="text-slate-400 mt-2">
            {course?.description || "description"}
          </p>
        </div>

        {lectures.length === 0 ? (
          <div className="bg-slate-800 border border-slate-700 rounded-xl p-8 text-center text-slate-400">
            <p className="italic">
              No lectures have been scheduled for this course yet.
            </p>
            <p className="text-sm text-slate-500 mt-1">
              add schedule from the Dashboard
            </p>
          </div>
        ) : (
          <div className="relative border-l border-slate-700 ml-4 space-y-6">
            {lectures.map((lecture, index) => {
              const lectureDate = new Date(lecture.date);

              return (
                <div key={lecture._id} className="relative pl-8 group">
                  <div className="absolute -left-1.5 top-1.5 w-3 h-3 rounded-full bg-slate-700 group-hover:bg-teal-400 border border-slate-900 transition-colors"></div>

                  <div className="bg-slate-800 border border-slate-700 hover:border-slate-600 transition-all rounded-xl p-5 shadow-md flex items-center justify-between">
                    <div>
                      <span className="text-xs text-teal-400 font-bold uppercase tracking-wide">
                        Batch #{index + 1}
                      </span>

                      <h3 className="text-xl font-bold text-white mt-0.5">
                        {lectureDate.toLocaleDateString("en-IN", {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </h3>

                      <p className="text-slate-400 text-sm mt-1 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                        Instructor:{" "}
                        <strong className="text-slate-200">
                          {lecture.instructorId?.name || "Unassigned"}
                        </strong>
                      </p>
                    </div>

                    <div className="text-right hidden sm:block">
                      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-slate-700 text-slate-300">
                        Active
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
