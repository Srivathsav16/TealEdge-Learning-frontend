import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";
import { apiFetch } from "../utils/api";

function FacultyDashboard() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("currentUser"));
  const [courses, setCourses] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [newCourse, setNewCourse] = useState({ title: "", description: "", referenceMaterial: "" });
  const [editingCourseId, setEditingCourseId] = useState(null);
  const [editCourseData, setEditCourseData] = useState({ title: "", description: "", referenceMaterial: "" });

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const data = await apiFetch("/api/courses");
      const myCourses = data.filter(c => c.faculty && c.faculty.id === user?.id);
      setCourses(myCourses);
    } catch (e) {
      console.error(e);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await apiFetch("/api/courses", {
        method: "POST",
        body: JSON.stringify({ 
          title: newCourse.title, 
          description: newCourse.description,
          referenceMaterial: newCourse.referenceMaterial 
        })
      });
      setShowForm(false);
      setNewCourse({ title: "", description: "", referenceMaterial: "" });
      fetchCourses();
    } catch (err) {
      alert("Failed to create course");
    }
  };

  const handleDelete = async (courseId) => {
    if (!window.confirm("Are you sure you want to delete this course and all its enrollments?")) return;
    try {
      await apiFetch(`/api/courses/${courseId}`, { method: "DELETE" });
      fetchCourses();
    } catch (err) {
      alert("Failed to delete course");
    }
  };

  const startEdit = (course) => {
    setEditingCourseId(course.id);
    setEditCourseData({
      title: course.title,
      description: course.description,
      referenceMaterial: course.referenceMaterial || ""
    });
  };

  const handleEdit = async (courseId) => {
    try {
      await apiFetch(`/api/courses/${courseId}`, {
        method: "PUT",
        body: JSON.stringify(editCourseData)
      });
      setEditingCourseId(null);
      fetchCourses();
    } catch (err) {
      alert("Failed to update course");
    }
  };

  return (
    <>
      <Navbar />
      <div className="container">
        <div className="card glass-card">
          <h2 className="text-gradient">Faculty Dashboard</h2>
          <p style={{ color: "var(--text-muted)", marginTop: "0.5rem" }}>
            Welcome back, <strong style={{ color: "var(--text-main)" }}>{user?.name}</strong>. Manage your courses.
          </p>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", margin: "2.5rem 0 1rem 0" }}>
          <h3 style={{ fontSize: "1.5rem" }}>Your Created Courses</h3>
          <button className="btn" onClick={() => setShowForm(!showForm)}>
            {showForm ? "Cancel" : "+ Create Course"}
          </button>
        </div>

        {showForm && (
          <div className="card glass-card" style={{ marginBottom: "2rem" }}>
             <h3>Create a new Course</h3>
             <form onSubmit={handleCreate} style={{ display: "flex", flexDirection: "column", gap: "10px", marginTop: "1rem" }}>
               <input required placeholder="Course Title" value={newCourse.title} onChange={e => setNewCourse({...newCourse, title: e.target.value})} />
               <textarea required placeholder="Course Description" value={newCourse.description} onChange={e => setNewCourse({...newCourse, description: e.target.value})} rows={3} />
               <input placeholder="Reference Material Link (Optional PDF/Video URL)" value={newCourse.referenceMaterial} onChange={e => setNewCourse({...newCourse, referenceMaterial: e.target.value})} />
               <button className="btn" type="submit">Submit</button>
             </form>
          </div>
        )}

        <div className="course-grid">
          {courses.length === 0 && !showForm && (
            <div className="card" style={{ gridColumn: "1 / -1", textAlign: "center", padding: "3rem" }}>
              <p style={{ color: "var(--text-muted)" }}>No courses created yet.</p>
            </div>
          )}

          {courses.map((course) => (
            <div className="course-card" key={course.id}>
              {editingCourseId === course.id ? (
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  <input required value={editCourseData.title} onChange={e => setEditCourseData({...editCourseData, title: e.target.value})} />
                  <textarea required value={editCourseData.description} onChange={e => setEditCourseData({...editCourseData, description: e.target.value})} rows={3} />
                  <input placeholder="Reference Link" value={editCourseData.referenceMaterial} onChange={e => setEditCourseData({...editCourseData, referenceMaterial: e.target.value})} />
                  <div style={{ display: "flex", gap: "10px" }}>
                    <button className="btn" onClick={() => handleEdit(course.id)}>Save</button>
                    <button className="btn" onClick={() => setEditingCourseId(null)}>Cancel</button>
                  </div>
                </div>
              ) : (
                <>
                  <h4 style={{ marginBottom: "0.5rem", color: "var(--text-main)" }}>{course.title}</h4>
                  <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>{course.description}</p>
                  {course.referenceMaterial && (
                    <p style={{ marginTop: "0.5rem", fontSize: "0.85rem" }}>
                      <a href={course.referenceMaterial} target="_blank" rel="noopener noreferrer" style={{ color: "var(--primary)" }}>View Reference Material</a>
                    </p>
                  )}
                  <div style={{ marginTop: "1rem", display: "flex", gap: "10px" }}>
                    <button className="btn" style={{ flex: 1, fontSize: "0.85rem" }} onClick={() => navigate(`/course/${course.id}`)}>View Details</button>
                    <button className="btn" style={{ flex: 1, fontSize: "0.85rem", background: "rgba(255, 165, 0, 0.2)", color: "#ffa500", border: "1px solid rgba(255, 165, 0, 0.4)" }} onClick={() => startEdit(course)}>Edit</button>
                    <button className="btn" style={{ flex: 1, fontSize: "0.85rem", background: "rgba(255, 60, 60, 0.2)", color: "#ff6b6b", border: "1px solid rgba(255, 60, 60, 0.4)" }} onClick={() => handleDelete(course.id)}>Delete</button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default FacultyDashboard;
