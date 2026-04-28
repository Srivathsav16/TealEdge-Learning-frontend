import Navbar from "../components/Navbar";
import { useState, useEffect } from "react";
import { apiFetch } from "../utils/api";

function Admin() {
  const [courses, setCourses] = useState([]);
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");

  const [selectedCourseId, setSelectedCourseId] = useState("");
  const [taskTitle, setTaskTitle] = useState("");
  const [deadline, setDeadline] = useState("");


  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const data = await apiFetch("/api/courses");
      setCourses(data);
    } catch (e) {
      console.error(e);
    }
  };


  const handleCreateCourse = async () => {
    if (!title || !desc) {
      alert("Fill all fields");
      return;
    }

    try {
      await apiFetch("/api/courses", {
        method: "POST",
        body: JSON.stringify({ title, description: desc })
      });
      setTitle("");
      setDesc("");
      alert("Course created successfully!");
      fetchCourses();
    } catch (err) {
      alert("Failed to create course");
    }
  };


  const handleAddTask = async () => {
    if (!selectedCourseId) {
      alert("Select a course");
      return;
    }

    if (!taskTitle || !deadline) {
      alert("Fill all task fields");
      return;
    }

    try {
      await apiFetch(`/api/courses/${selectedCourseId}/tasks`, {
        method: "POST",
        body: JSON.stringify({ title: taskTitle, deadline })
      });
      setTaskTitle("");
      setDeadline("");
      alert("Task added successfully!");
      fetchCourses();
    } catch (err) {
      alert("Failed to add task");
    }
  };

  return (
    <>
      <Navbar />
      <div className="container">


        <div className="card">
          <h2>Create Course</h2>

          <input
            type="text"
            placeholder="Course Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <textarea
            placeholder="Course Description"
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
          />

          <button className="btn" onClick={handleCreateCourse}>
            Create Course
          </button>
        </div>


        <div className="card">
          <h2>Add Task (Date + Time)</h2>

          <select
            value={selectedCourseId}
            onChange={(e) => setSelectedCourseId(e.target.value)}
          >
            <option value="">Select Course</option>
            {courses.map((course) => (
              <option key={course.id} value={course.id}>
                {course.title}
              </option>
            ))}
          </select>

          <input
            type="text"
            placeholder="Task Title"
            value={taskTitle}
            onChange={(e) => setTaskTitle(e.target.value)}
          />

          <input
            type="datetime-local"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
          />

          <button className="btn" onClick={handleAddTask}>
            Add Task
          </button>
        </div>

      </div>
    </>
  );
}

export default Admin;