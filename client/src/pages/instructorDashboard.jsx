import { useEffect, useState } from "react";
import API from "../api";

export default function InstructorDashboard() {
  const [lectures, setLectures] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInstructorSchedule = async () => {
      try {
        setLoading(true);
        const res = await API.get("/schedule/lecture/myLecture");
        setLectures(res.data);
      } catch (err) {
        console.error("Failed to load your lecture timetable", err);
      } finally {
        setLoading(false);
      }
    };

    fetchInstructorSchedule();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white">
        <div className="w-8 h-8 border-4 border-teal-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col">
      <nav className="bg-slate-800 border-b border-slate-700 px-8 py-4 flex justify-between items-center">
        <div>
          <h1 className="text-xl font-black tracking-wider text-teal-400">
            INSTRUCTOR PORTAL
          </h1>
          <p className="text-xs text-slate-400">Your Timetable</p>
        </div>

        <button
          onClick={async () => {
            await API.post("/auth/logout");
            window.location.reload();
          }}
          className="bg-slate-700 hover:bg-red-500/20 hover:text-red-400 text-slate-300 font-semibold px-4 py-2 rounded-lg text-sm transition-all"
        >
          Log Out
        </button>
      </nav>

      <main className="flex-1 p-8 max-w-4xl w-full mx-auto">
        <div className="mb-8">
          <h2 className="text-3xl font-extrabold tracking-tight">
            Your Scheduled Batches
          </h2>
        </div>

        {lectures.length === 0 ? (
          <div className="bg-slate-800 border border-slate-700 rounded-xl p-10 text-center text-slate-400 shadow-xl">
            <p className="text-sm text-slate-500 mt-2">
              No sessions are allocated to you yet.
            </p>
          </div>
        ) : (
          <div className="relative border-l-2 border-slate-700 ml-4 space-y-6">
            {lectures.map((lecture, index) => {
              const lectureDate = new Date(lecture.date);

              return (
                <div key={lecture._id} className="relative pl-8 group">
                  <div className="absolute -left-2 top-2 w-3.5 h-3.5 rounded-full bg-slate-700 group-hover:bg-teal-400 border-2 border-slate-900 transition-colors"></div>

                  <div className="bg-slate-800 border border-slate-700 hover:border-slate-600 transition-all rounded-xl p-6 shadow-md flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="space-y-1">
                      <span className="text-xs text-teal-400 font-bold uppercase tracking-widest">
                        Session #{index + 1}
                      </span>

                      <h3 className="text-2xl font-bold text-white tracking-tight">
                        {lecture.courseId?.name || "Loading Course Details..."}
                      </h3>

                      {lecture.courseId?.level && (
                        <span className="inline-block px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wide rounded bg-slate-700/50 text-slate-300">
                          {lecture.courseId.level}
                        </span>
                      )}
                    </div>

                    <div className="bg-slate-900/50 border border-slate-700/60 rounded-xl px-5 py-3 text-left md:text-right min-w-55">
                      <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                        Lecture Date
                      </p>
                      <p className="text-lg font-bold text-teal-300 mt-0.5">
                        {lectureDate.toLocaleDateString("en-IN", {
                          weekday: "short",
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
