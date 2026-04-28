import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("currentUser"));

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };


  if (!user) {
    return null;
  }


  const dashboardLink =
    user.role === "faculty"
      ? "/faculty-dashboard"
      : "/student-dashboard";

  return (
    <nav className="navbar">

      <div
        className="logo"
        style={{ cursor: "pointer", display: "flex", alignItems: "center" }}
        onClick={() => navigate(dashboardLink)}
      >
        <img src="/logo.png" alt="TealEdge Logo" style={{ height: "40px", objectFit: "contain" }} />
      </div>


      <div className="nav-links">
        <Link to={dashboardLink}>Dashboard</Link>

        <Link to="/courses">Courses</Link>


        {user.role === "faculty" && (
          <>
            <Link to="/admin">Faculty Panel</Link>
            <Link to="/faculty-submissions">
              Submissions
            </Link>
          </>
        )}


        {user.role === "student" && (
          <Link to="/assignments">
            My Assignments
          </Link>
        )}

        <Link to="/profile">Profile</Link>

        <button
          className="logout-btn"
          onClick={handleLogout}
        >
          Sign Out
        </button>
      </div>
    </nav>
  );
}

export default Navbar;