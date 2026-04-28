import { BrowserRouter, Routes, Route } from "react-router-dom";
import FacultySubmissions from "./pages/FacultySubmissions";
import ProtectedRoute from "./components/ProtectedRoute";
import CourseDetails from "./pages/CourseDetails";
import Assignments from "./pages/Assignments";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import StudentDashboard from "./pages/StudentDashboard";
import FacultyDashboard from "./pages/FacultyDashboard";
import Courses from "./pages/Courses";
import Admin from "./pages/Admin";
import Profile from "./pages/Profile";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/student-dashboard" element={<StudentDashboard />} />
        <Route path="/faculty-dashboard" element={<FacultyDashboard />} />
        <Route path="/courses" element={<Courses />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/assignments" element={<Assignments />} />
        <Route path="/course/:id" element={<CourseDetails />} />
        <Route path="/faculty-submissions" element={<FacultySubmissions />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;