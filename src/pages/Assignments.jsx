import Navbar from "../components/Navbar";
import { useState, useEffect } from "react";
import { apiFetch } from "../utils/api";

function Assignments() {
  const user = JSON.parse(localStorage.getItem("currentUser"));
  const [myCourses, setMyCourses] = useState([]);
  const [submissions, setSubmissions] = useState([]);

  useEffect(() => {
    fetchMyCourses();
    fetchMySubmissions();
  }, []);

  const fetchMySubmissions = async () => {
    if (user?.role === 'student') {
      try {
        const data = await apiFetch(`/api/submissions/my`);
        setSubmissions(data);
      } catch (err) {
        console.error(err);
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

  const handleSubmit = async (courseId, taskId) => {
    try {
      await apiFetch(`/api/submissions/task/${taskId}`, { method: "POST" });
      alert("Assignment submitted!");
      window.location.reload();
    } catch (e) {
      alert("Failed to submit");
    }
  };

  const isSubmitted = (courseId, taskId) => {
    return submissions.some(s => s.taskId === taskId);
  };

  return (
    <>
      <Navbar />
      <div className="container">
        <h2>My Assignments</h2>

        {myCourses.map((course) => (
          <div key={course.id} className="card">
            <h3>{course.title}</h3>

            {(!course.tasks || course.tasks.length === 0) && <p>No tasks added.</p>}

            {course.tasks && course.tasks.map((task) => {
              const expired =
                new Date(task.deadline) < new Date();

              const submitted = isSubmitted(
                course.id,
                task.id
              );

              return (
                <div key={task.id}>
                  <p>
                    <strong>{task.title}</strong>
                  </p>
                  <p>
  Deadline: {new Date(task.deadline).toLocaleString()}
</p>

                  {submitted ? (
                    <button className="btn enrolled-btn" disabled>
                      Submitted
                    </button>
                  ) : expired ? (
                    <button className="logout-btn" disabled>
                      Deadline Passed
                    </button>
                  ) : (
                    <button
                      className="btn"
                      onClick={() =>
                        handleSubmit(course.id, task.id)
                      }
                    >
                      Submit
                    </button>
                  )}

                  <hr />
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </>
  );
}

export default Assignments;