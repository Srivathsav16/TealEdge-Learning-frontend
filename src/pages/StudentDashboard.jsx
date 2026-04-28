import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";
import { apiFetch } from "../utils/api";

function StudentDashboard() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("currentUser"));
  const [myCourses, setMyCourses] = useState([]);
  const [submissions, setSubmissions] = useState([]);

  useEffect(() => {
    fetchMyCourses();
    fetchSubmissions();
  }, []);

  const fetchSubmissions = async () => {
    if (user?.role === 'student') {
      try {
        const data = await apiFetch('/api/submissions/my');
        setSubmissions(data);
      } catch (e) {
        console.error("Failed to fetch submissions", e);
      }
    }
  };

  const fetchMyCourses = async () => {
    try {
      const data = await apiFetch("/api/enrollments/my");
      setMyCourses(data);
    } catch (e) {
      console.error("Failed to fetch my courses", e);
    }
  };

  const getProgress = (course) => {
    const totalTasks = course.tasks?.length || 0;
    const completedTasks = submissions.filter(
      (s) => s.taskId && course.tasks?.some(t => t.id === s.taskId)
    ).length;
    if (totalTasks === 0) return 0;
    return Math.round((completedTasks / totalTasks) * 100);
  };

  return (
    <>
      <Navbar />
      <div className="container">
        <div className="card glass-card">
          <h2 className="text-gradient">Student Dashboard</h2>
          <p style={{ color: "var(--text-muted)", marginTop: "0.5rem" }}>
            Welcome back, <strong style={{ color: "var(--text-main)" }}>{user?.name}</strong>! Ready to continue your learning journey?
          </p>
        </div>

        <h3 style={{ margin: "2rem 0 1rem 0", fontSize: "1.5rem" }}>My Enrolled Courses</h3>

        {myCourses.length === 0 && (
          <div className="card" style={{ textAlign: "center", padding: "3rem" }}>
            <p style={{ color: "var(--text-muted)" }}>You have not enrolled in any courses yet.</p>
            <button className="btn" style={{ marginTop: "1rem" }} onClick={() => navigate("/courses")}>Browse Courses</button>
          </div>
        )}

        <div className="course-grid">
          {myCourses.map((course) => {
            const progress = getProgress(course);
            const totalTasks = course.tasks?.length || 0;

            return (
              <div
                key={course.id}
                className="course-card"
                onClick={() => navigate(`/course/${course.id}`)}
                style={{ cursor: "pointer" }}
              >
                <h3 style={{ marginBottom: "0.5rem", color: "var(--text-main)" }}>{course.title}</h3>
                <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", height: "3rem", overflow: "hidden" }}>{course.description}</p>

                {course.referenceMaterial && (
                  <div style={{ marginTop: "0.5rem", marginBottom: "0.5rem" }}>
                    <a 
                      href={course.referenceMaterial} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      style={{ color: "var(--primary)", fontSize: "0.9rem" }}
                      onClick={(e) => e.stopPropagation()}
                    >
                      View Reference Material
                    </a>
                  </div>
                )}

                <div style={{ marginTop: "1.5rem", display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "0.85rem" }}>
                  <span style={{ color: "var(--text-muted)" }}>{totalTasks} Tasks</span>
                  <span style={{ color: "var(--primary)", fontWeight: "600" }}>{progress}% Complete</span>
                </div>

                <div
                  style={{
                    background: "rgba(255, 255, 255, 0.05)",
                    borderRadius: "10px",
                    overflow: "hidden",
                    height: "8px",
                    marginTop: "0.5rem",
                    marginBottom: "1.5rem"
                  }}
                >
                  <div
                    style={{
                      width: `${progress}%`,
                      background: progress === 100 ? "var(--success)" : "linear-gradient(90deg, var(--primary), var(--secondary))",
                      height: "100%",
                      transition: "width 1s ease-in-out",
                      boxShadow: progress > 0 ? "0 0 10px rgba(0, 210, 255, 0.5)" : "none"
                    }}
                  />
                </div>
                <button className="btn" style={{ width: "100%" }}>Continue Learning</button>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}

export default StudentDashboard;