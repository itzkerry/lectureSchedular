import mongoose from "mongoose";
import User from "./models/user.js"; // Adjust the path to your User model
import dotenv from "dotenv";

dotenv.config();

const seedUsers = async () => {
  try {
    // 1. Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB for seeding...");

    // 2. Clear out existing users so you don't create duplicates
    await User.deleteMany({});

    // 3. Define your initial data array
    const dummyUsers = [
      {
        userName: "admin",
        password: "admin123",
        name: "Krishna",
        role: "admin",
      },
      {
        userName: "rahul",
        password: "instructor123",
        name: "Rahul",
        role: "instructor",
      },
      {
        userName: "amit",
        password: "instructor123",
        name: "Amit",
        role: "instructor",
      },
      {
        userName: "rohan",
        password: "instructor123",
        name: "rohan",
        role: "instructor",
      },
      {
        userName: "harsh",
        password: "instructor123",
        name: "harsh",
        role: "instructor",
      },
      {
        userName: "kiran",
        password: "instructor123",
        name: "kiran",
        role: "instructor",
      },
    ];

    // 4. Insert into the database
    await User.insertMany(dummyUsers);
    console.log("Database seeded successfully with Admin and Instructors!");

    // 5. Exit the script execution cleanly
    process.exit(0);
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }
};

seedUsers();
