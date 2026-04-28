import { GoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { useState } from "react";

function Login() {
  const navigate = useNavigate();
  const [role, setRole] = useState("");

  const handleSuccess = (credentialResponse) => {
    if (!role) {
      alert("Please select a role first!");
      return;
    }

    const user = jwtDecode(credentialResponse.credential);

    localStorage.setItem(
      "user",
      JSON.stringify({
        name: user.name,
        email: user.email,
        role: role,
      })
    );

    if (role === "faculty") {
  navigate("/faculty-dashboard");
} else {
  navigate("/student-dashboard");
}

  };

  return (
    <div className="container">
      <div className="card" style={{ textAlign: "center", marginTop: "120px" }}>
        <h1>TealEdge Learning</h1>
        <p>Sign in to continue</p>

        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
        >
          <option value="">Select Role</option>
          <option value="student">Student</option>
          <option value="faculty">Faculty</option>
        </select>

        <br /><br />

        <GoogleLogin
          onSuccess={handleSuccess}
          onError={() => console.log("Login Failed")}
        />
      </div>
    </div>
  );
}

export default Login;
