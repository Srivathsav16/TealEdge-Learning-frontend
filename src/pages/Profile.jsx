import Navbar from "../components/Navbar";
import { useState } from "react";

function Profile() {
  const storedUser = JSON.parse(localStorage.getItem("currentUser"));

  const [name, setName] = useState(storedUser?.name || "");
  const [phone, setPhone] = useState(storedUser?.phone || "");
  const [message, setMessage] = useState("");

  const handleSave = () => {
    if (!name || !phone) {
      setMessage("Please fill all fields");
      return;
    }

    const updatedUser = {
      ...storedUser,
      name,
      phone,
    };

    localStorage.setItem("user", JSON.stringify(updatedUser));
    setMessage("Profile updated successfully!");
  };

  return (
    <>
      <Navbar />
      <div className="container">
        <div className="card">
          <h2>My Profile</h2>

          <label>Full Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <label>Email</label>
          <input
            type="email"
            value={storedUser?.email}
            disabled
          />

          <label>Role</label>
          <input
            type="text"
            value={storedUser?.role}
            disabled
          />

          <label>Phone Number</label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Enter phone number"
          />

          <button className="btn" onClick={handleSave}>
            Save Changes
          </button>

          {message && (
            <p style={{ marginTop: "15px", color: "green" }}>
              {message}
            </p>
          )}
        </div>
      </div>
    </>
  );
}

export default Profile;