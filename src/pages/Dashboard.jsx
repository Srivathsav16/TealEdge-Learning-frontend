import Navbar from "../components/Navbar";

function Dashboard() {
  const user = JSON.parse(localStorage.getItem("currentUser"));

  return (
    <>
      <Navbar />
      <div className="container">
        <div className="card">
          <h2>Welcome, {user?.name}</h2>
          <p>Select a course to start learning.</p>
        </div>
      </div>
    </>
  );
}

export default Dashboard;
