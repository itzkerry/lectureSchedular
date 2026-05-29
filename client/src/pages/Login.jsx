import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";
import toast from "react-hot-toast";

const Login = ({ setUser }) => {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await API.post("/auth/signin", { userName, password, role });
      const loggedInUser = res.data.user;
      console.log(loggedInUser);
      setUser(loggedInUser);

      if (loggedInUser.role === "admin") {
        navigate("/admin/dashboard");
      } else if (loggedInUser.role === "instructor") {
        navigate("/instructor/dashboard");
      }
    } catch (err) {
      console.log(err);
      toast.error(
        err.response?.data?.message || "Invalid username or password",
      );
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-slate-800 p-8 rounded-xl shadow-lg border border-slate-700">
        <h2 className="text-3xl font-extrabold text-white text-center mb-2">
          Welcome
        </h2>
        <p className="text-slate-400 text-center mb-6 text-sm">
          Sign in to continue
        </p>

        <form onSubmit={handleLoginSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">
              Username
            </label>
            <input
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              placeholder="userName"
              className="w-full p-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-teal-500 transition-colors"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full p-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-teal-500 transition-colors"
              required
            />
          </div>
          <div className="">
            <p className="block text-sm font-medium text-slate-300 mb-1.5">
              Role
            </p>

            <input
              type="radio"
              name="role"
              id="Instructor"
              value="instructor"
              className="mr-1"
              required
              onChange={(e) => setRole(e.target.value)}
            />
            <label
              htmlFor="Instructor"
              className="text-sm text-slate-300 font-semibold mr-2"
            >
              Instructor
            </label>
            <input
              type="radio"
              name="role"
              id="admin"
              value="admin"
              className="mr-1"
              required
              onChange={(e) => setRole(e.target.value)}
            />
            <label
              htmlFor="admin"
              className="text-sm text-slate-300 font-semibold"
            >
              admin
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-teal-500 text-white font-bold py-3 px-4 rounded-lg hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
