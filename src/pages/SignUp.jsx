import { GoogleLogin } from "@react-oauth/google";
import { useNavigate, Link } from "react-router-dom";
import { useState } from "react";
import { API_BASE_URL } from "../utils/api";

function SignUp() {
  const navigate = useNavigate();
  const [role, setRole] = useState("");

  const handleGoogleSuccess = async (credentialResponse) => {
    if (!role) {
      alert("Please select a role first");
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/google`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
            token: credentialResponse.credential,
            role: role 
        })
      });

      if (!response.ok) {
        const err = await response.text();
        alert("Sign Up Failed: " + err);
        return;
      }

      const data = await response.json();
      localStorage.setItem("jwt_token", data.token);
      localStorage.setItem("currentUser", JSON.stringify(data.user));

      if (data.user.role === "faculty") {
        navigate("/faculty-dashboard");
      } else {
        navigate("/student-dashboard");
      }
    } catch (error) {
      console.error(error);
      alert("Network or Server Error");
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <img src="/logo.png" alt="TealEdge Logo" style={{ height: "50px", marginBottom: "1rem", objectFit: "contain" }} />

        <div style={{ display: "flex", flexDirection: "column", gap: "1rem", alignItems: "center" }}>
          <h3 style={{ color: "var(--text-main)", marginBottom: "0.5rem" }}>Create Account</h3>
          <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", marginBottom: "1rem" }}>Select your role to get started</p>

          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            style={{ marginBottom: "1rem", padding: "0.5rem", borderRadius: "5px", border: "1px solid #ccc" }}
          >
            <option value="">Select Role</option>
            <option value="student">Student</option>
            <option value="faculty">faculty</option>
          </select>

          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={() => alert("Google Login Failed")}
          />
        </div>

        <p style={{ marginTop: "2.5rem", color: "var(--text-muted)", fontSize: "0.9rem" }}>
          Already have an account? <Link to="/" style={{ color: "var(--primary)", fontWeight: "600", textDecoration: "none" }}>Sign In</Link>
        </p>
      </div>
    </div>
  );
}

export default SignUp;
