import { GoogleLogin } from "@react-oauth/google";
import { useNavigate, Link } from "react-router-dom";

function SignIn() {
  const navigate = useNavigate();

  const handleSuccess = async (credentialResponse) => {
    try {
      const response = await fetch("http://localhost:8082/api/auth/google", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: credentialResponse.credential })
      });

      if (!response.ok) {
        alert("Sign In Failed. Have you signed up?");
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
          <p style={{ color: "var(--text-muted)", marginBottom: "1rem" }}>Sign in to access your courses</p>
          <GoogleLogin
            onSuccess={handleSuccess}
            onError={() => alert("Google Login Failed")}
          />
        </div>
        <p style={{ marginTop: "2rem", color: "var(--text-muted)" }}>
          New user? <Link to="/signup" style={{ color: "var(--primary)", fontWeight: "600", textDecoration: "none" }}>Sign Up</Link>
        </p>
      </div>
    </div>
  );
}

export default SignIn;