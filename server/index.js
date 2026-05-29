import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/authRoutes.js";
import scheduleRoutes from "./routes/scheduleRoutes.js";
dotenv.config();

const app = express();
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/schedule", scheduleRoutes);

const PORT = process.env.port || 5000;
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("connect to MongoDB");
    app.listen(PORT, () => console.log("server is running on port : ", PORT));
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB: ", err);
  });
