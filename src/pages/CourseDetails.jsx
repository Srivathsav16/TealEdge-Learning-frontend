import Navbar from "../components/Navbar";
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { apiFetch } from "../utils/api";

function CourseDetails() {
  const { id } = useParams();

  const user = JSON.parse(localStorage.getItem("currentUser"));
  const [course, setCourse] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const data = await apiFetch(`/api/courses/${id}`);
        setCourse(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    const fetchSubmissions = async () => {
      if (user?.role === 'student') {
        try {
          const data = await apiFetch(`/api/submissions/my`);
          setSubmissions(data);
        } catch (err) {
          console.error(err);
        }
      }
    };

    fetchCourse();
    fetchSubmissions();
  }, [id, user?.role]);

  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="container">
          <h2>Loading...</h2>
        </div>
      </>
    );
  }

  if (!course) {
    return (
      <>
        <Navbar />
        <div className="container">
          <h2>Course not found</h2>
        </div>
      </>
    );
  }


  const getSubmission = (taskId) => {
    return submissions.find(s => s.taskId === taskId);
  };

  const getTimeRemaining = (deadline) => {
    const diff = new Date(deadline) - new Date();
    if (diff <= 0) return "Deadline Passed";

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor(
      (diff / (1000 * 60 * 60)) % 24
    );
    const minutes = Math.floor(
      (diff / (1000 * 60)) % 60
    );

    return `${days}d ${hours}h ${minutes}m remaining`;
  };

  const handleSubmit = async (taskId) => {
    if (!selectedFile) {
      alert("Please select a file to submit!");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = async () => {
      const payload = {
        fileName: selectedFile.name,
        fileType: selectedFile.type,
        fileData: reader.result
      };

      try {
        await apiFetch(`/api/submissions/task/${taskId}`, { 
          method: "POST",
          body: JSON.stringify(payload)
        });
        alert("Assignment submitted successfully!");
        window.location.reload();
      } catch (err) {
        alert("Failed to submit assignment");
      }
    };
    reader.readAsDataURL(selectedFile);
  };

  const handleDelete = async (submissionId) => {
    try {
      await apiFetch(`/api/submissions/${submissionId}`, { method: "DELETE" });
      alert("Submission deleted!");
      window.location.reload();
    } catch (err) {
      alert("Failed to delete submission");
    }
  };

  return (
    <>
      <Navbar />
      <div className="container">

        <div className="card">
          <h2>{course.title}</h2>
          <p>{course.description}</p>
        </div>

        <h3>Assignments</h3>

        {(!course.tasks || course.tasks.length === 0) && (
          <p>No tasks available.</p>
        )}

        {course.tasks && course.tasks.map((task) => {
          const submission = getSubmission(task.id);
          const expired =
            new Date(task.deadline) < new Date();

          return (
            <div key={task.id} className="card">
              <h4>{task.title}</h4>

              <p>
                Deadline:{" "}
                {new Date(
                  task.deadline
                ).toLocaleString()}
              </p>

              <p style={{ color: "red" }}>
                {getTimeRemaining(task.deadline)}
              </p>


              {user?.role !== 'faculty' && (
                submission ? (
                  <>
                    <p style={{ color: "green", fontWeight: "bold" }}>
                      Submitted successfully
                    </p>

                    {submission.grade && (
                      <p>
                        <strong>Grade:</strong>{" "}
                        {submission.grade}
                      </p>
                    )}

                    <button
                      className="logout-btn"
                      onClick={() =>
                        handleDelete(submission.id)
                      }
                    >
                      Delete Submission
                    </button>
                  </>
                ) : expired ? (
                  <button
                    className="logout-btn"
                    disabled
                  >
                    Deadline Passed
                  </button>
                ) : (
                  <>
                    <input
                      type="file"
                      accept=".jpg,.jpeg,.png,.pdf"
                      onChange={handleFileChange}
                    />
                    
                    {selectedFile && (
                      <p>Selected: {selectedFile.name}</p>
                    )}

                    <button
                      className="btn"
                      onClick={() =>
                        handleSubmit(task.id)
                      }
                      style={{ marginTop: "10px" }}
                    >
                      Submit Assignment
                    </button>
                  </>
                )
              )}
            </div>
          );
        })}
      </div>
    </>
  );
}

export default CourseDetails;