# 📅 Lecture Scheduler Application

This is a full-stack web application built using the MERN stack (MongoDB, Express, React, Node.js). It helps educational institutes manage course catalogs and schedule lectures for instructors without any calendar date clashes.

## ✨ What this app does
* **Secure Login:** Separate access for Admins and Instructors using secure, browser-saved cookies.
* **Admin Dashboard:** Admins can view active courses, add new courses to the catalog, and schedule upcoming lectures by assigning an instructor and a date.
* **Instructor Dashboard:** Instructors get a clean, simple timeline view showing only their personal scheduled lectures.
* **No Conflicts:** The system automatically checks dates so an instructor cannot be scheduled for two different lectures on the exact same day.

---

## 📁 Project Structure
```text
my-project/
├──  client/         # React application (Vite + Tailwind CSS)
|   ├── src/
|   │   ├── pages/    # Login, Admin Dashboard, Instructor Dashboard, Lectures list
|   │   └── api.js    # Axios connection setup with the backend
|   └── vercel.json   # Fixes 404 page-reload issues when deployed
└── server/          # Node.js + Express API server
    ├── controllers/  # Code for login, logout, courses, and lectures logic
    ├── models/       # Database structure schemas (User, Course, Lecture)
    └── index.js      # Server entry point
```

### 🖥️ Client-Side Paths (React Router)
| Application Path | Route Behavior & Layout View | Access Guard Layer |
| :--- | :--- | :--- |
| `https://lecture-schedular.vercel.app/` | Bypasses layout, detects `user` object state, redirects to dashboard or `/login`. | Dynamic Fallback |
| `https://lecture-schedular.vercel.app/login` | Displays the login form layout. Bypasses if cookie session is active. | Open Public |
| `https://lecture-schedular.vercel.app/admin/dashboard` | Main operational dashboard with Schedule Overview, Add Course, and Schedule forms. | Admin Profile Only |
| `https://lecture-schedular.vercel.app/course/:courseId/lecture` | View displaying batch lectures for a single course. | Admin Profile Only |
| `https://lecture-schedular.vercel.app/instructor/dashboard` | View listing allocated lectures assigned to the logged-in user profile. | Instructor Only |



### ⚡ Server-Side Endpoints (Express API)
| Method | Endpoint Path | Payload / Parameter Targets | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/login` | `{ userName, password, role }` | Validates credential, generates token, appends HTTP-Only cookie. |
| `POST` | `/api/auth/logout` | None | Overwrites, clears, and expires browser context tokens instantly. |
| `GET` | `/api/auth/getMe` | Extracted from Header Cookie | Resolves session token status. |
| `GET` | `/api/schedule/course` | None | Pulls all courses inside the admin dashboard. |
| `POST` | `/api/schedule/course` | `{ name, level, description, image_url }` | Add course to the database. |
| `GET` | `/api/schedule/instructors` | None | Pulls user accounts who's role is `"instructor"`. |
| `POST` | `/api/lectures` | `{ courseId, instructorId, date }` | Creates a new lecture schedule after executing date-conflict checks. |
| `GET` | `/api/course/:courseId/lectures` | URL Parameter `:courseId` | Return that batches of that perticular course |
| `GET` | `/api/schedule/lecture/myLecture` | Extracted from Header Cookie | Queries the database matching `req.user.id` to return personal timetables. |


### 💻 How to run it on your computer
**1. Set up the Backend Server**

1. Go into the backend folder: `cd server`

2. Install dependencies: `npm install`

3. Create a .env file in the backend root folder and add your variables:

```
PORT=5000
MONGO_URI=your_mongodb_link
JWT_SECRET=any_random_secret_password_string
NODE_ENV=development
```
4. Start the server using nodemon: `npm run dev`


**2. Set up the Frontend Client**
1. Open a new terminal window.

2. Go into the frontend folder: `cd client`

3. Install dependencies: `npm install`

4. Make sure your src/api.js points to http://localhost:5000/api.

5. Start the frontend interface: `npm run dev`
