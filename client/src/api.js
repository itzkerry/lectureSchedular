import axios from "axios";

const API = axios.create({
  baseURL: "https://lectureschedular-n3p6.onrender.com/api",
  withCredentials: true,

  headers: {
    "Content-Type": "application/json",
  },
});

export default API;
