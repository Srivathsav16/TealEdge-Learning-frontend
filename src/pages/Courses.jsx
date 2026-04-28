import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import { apiFetch } from "../utils/api";

function Courses() {
  const [courses, setCourses] = useState([]);
  const [myEnrollments, setMyEnrollments] = useState([]);
  const user = JSON.parse(localStorage.getItem("currentUser"));

  useEffect(() => {
    fetchCourses();
    if (user?.role === "student") {
      fetchMyEnrollments();
    }
  }, [user?.role]);

  const fetchCourses = async () => {
    try {
      const data = await apiFetch("/api/courses");
      setCourses(data);
    } catch(e) { console.error(e) }
  };

  const fetchMyEnrollments = async () => {
    try {
      const data = await apiFetch("/api/enrollments/my");
      setMyEnrollments(data);
    } catch(e) { console.error(e) }
  };

  const isEnrolled = (courseId) => {
    return myEnrollments.some((c) => c.id === courseId);
  };

  const handleEnroll = async (courseId) => {
    if (isEnrolled(courseId)) return;
    try {
      await apiFetch("/api/enrollments", {
        method: "POST",
        body: JSON.stringify({ courseId })
      });
      fetchMyEnrollments();
    } catch (e) {
      alert("Failed to enroll");
    }
  };

  return (
    <>
      <Navbar />
      <div className="container">
        <h2>Available Courses</h2>
        <div className="course-grid">
          {courses.length === 0 && <p>No courses available.</p>}
          {courses.map((course) => {
            const enrolled = isEnrolled(course.id);
            return (
              <div className="course-card" key={course.id}>
                <h3 style={{ marginBottom: "0.5rem", color: "var(--text-main)" }}>{course.title}</h3>
                <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", marginBottom: "1.5rem" }}>{course.description}</p>
                {user?.role === "student" && (
                  <button
                    className={`btn ${enrolled ? "enrolled-btn" : ""}`}
                    onClick={() => handleEnroll(course.id)}
                    disabled={enrolled}
                    style={{ width: "100%", opacity: enrolled ? 0.6 : 1 }}
                  >
                    {enrolled ? "Enrolled" : "Enroll"}
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}

export default Courses;