import Navbar from "../components/Navbar";
import { useState, useEffect } from "react";
import { apiFetch } from "../utils/api";

function FacultySubmissions() {
  const [submissions, setSubmissions] = useState([]);
  useEffect(() => {
    fetchSubmissions();
  }, []);

  const fetchSubmissions = async () => {
    try {
      const data = await apiFetch("/api/submissions/faculty");
      setSubmissions(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleGradeChange = async (index, grade) => {
    const updated = [...submissions];
    updated[index].grade = grade;
    setSubmissions(updated);
  };

  const handleSaveGrade = async (submissionId, grade) => {
    try {
      await apiFetch(`/api/submissions/${submissionId}/grade`, {
        method: "PUT",
        body: JSON.stringify({ grade })
      });
      alert("Grade saved!");
    } catch (err) {
      alert("Failed to save grade");
    }
  };

  const handleDelete = async (submissionId) => {
    try {
      await apiFetch(`/api/submissions/${submissionId}`, { method: "DELETE" });
      fetchSubmissions();
    } catch (err) {
      alert("Failed to delete submission");
    }
  };

  const handleViewFile = (fileData, fileType) => {
    if (!fileData || !fileData.startsWith('data:')) {
      alert("No file data available for this submission.");
      return;
    }

    try {
      const base64String = fileData.split(',')[1];
      const byteCharacters = atob(base64String);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: fileType || "application/octet-stream" });
      const blobUrl = URL.createObjectURL(blob);
      
      window.open(blobUrl, '_blank');
    } catch (e) {
      console.error("Error opening file:", e);
      alert("Failed to open file.");
    }
  };



  return (
    <>
      <Navbar />

      <div className="container">
        <div className="card">
          <h2>Faculty - Student Submissions</h2>
        </div>

        {submissions.length === 0 && (
          <div className="card">
            <p>No submissions yet.</p>
          </div>
        )}

        {submissions.map((submission, index) => {
          return (
            <div key={submission.id} className="card">
              <p>
                <strong>Student Email:</strong>{" "}
                {submission.student?.email}
              </p>

              <p>
                <strong>Student Name:</strong>{" "}
                {submission.student?.name}
              </p>

              <p>
                <strong>Submitted At:</strong>{" "}
                {new Date(
                  submission.submittedAt
                ).toLocaleString()}
              </p>

              {submission.fileName && (
                <p>
                  <strong>File:</strong>{" "}
                  {submission.fileName}
                </p>
              )}

              {submission.fileData && (
                <button
                  onClick={() => handleViewFile(submission.fileData, submission.fileType)}
                  className="btn"
                  style={{ marginRight: "10px", marginTop: "10px" }}
                >
                  View File
                </button>
              )}

              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginTop: "10px" }}>
                <input
                  type="number"
                  placeholder="Enter Grade"
                  value={submission.grade || ""}
                  onChange={(e) =>
                    handleGradeChange(
                      index,
                      e.target.value
                    )
                  }
                  style={{
                    width: "120px"
                  }}
                />

                <button
                  className="btn"
                  onClick={() =>
                    handleSaveGrade(submission.id, submission.grade)
                  }
                >
                  Save Grade
                </button>

                <button
                  className="logout-btn"
                  onClick={() =>
                    handleDelete(submission.id)
                  }
                >
                  Delete
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}

export default FacultySubmissions;