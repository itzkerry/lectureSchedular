import { useEffect, useState } from "react";
import "./App.css";
import { Routes, Route, Navigate } from "react-router-dom";
import API from "./api";
import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboard";
import Lectures from "./pages/Lectures";
import InstructorDashboard from "./pages/instructorDashboard";

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // 1. CRITICAL: Prevents flashing the login screen

  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await API.get("/auth/getMe");
        if (response.data.loggedIn) {
          setUser(response.data.user);
        }
      } catch (err) {
        console.log(err);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    checkSession();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center text-white space-y-3">
        <div className="w-10 h-10 border-4 border-teal-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-sm font-medium text-slate-400">Loading session...</p>
      </div>
    );
  }
  return (
    <>
      <Routes>
        <Route
          path="/"
          element={
            user ? (
              <Navigate
                to={
                  user.role === "admin"
                    ? "/admin/dashboard"
                    : "/instructor/dashboard"
                }
                replace
              />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route path="/login" element={<Login setUser={setUser} />} />
        <Route
          path="/admin/dashboard"
          element={user ? <AdminDashboard /> : <Login setUser={setUser} />}
        />
        <Route
          path="/course/:courseId/lecture"
          element={user ? <Lectures /> : <Login setUser={setUser} />}
        />

        {/* 🧑‍🏫 Instructor Dashboard Route */}
        <Route
          path="/instructor/dashboard"
          element={user ? <InstructorDashboard /> : <Login setUser={setUser} />}
        />

        {/* 🔄 Simple Fallback: Default to login if no specific route matches */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </>
  );
}

export default App;
