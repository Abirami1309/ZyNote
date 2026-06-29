import React from "react";
import { useNavigate } from "react-router-dom";

function Profile() {
  const user =
    JSON.parse(localStorage.getItem("user")) || {};

  const navigate = useNavigate();

  return (
    <div className="profile-container">
      <h2>👤 My Profile</h2>

      <button
        className="back-btn"
        onClick={() => navigate("/")}
      >
        ← Back to Dashboard
      </button>

      <div className="profile-card">

        <div className="profile-item">
          <label>Name</label>
          <p>{user.name}</p>
        </div>

        <div className="profile-item">
          <label>Email</label>
          <p>{user.email}</p>
        </div>

        <button
          className="profile-btn"
          onClick={() => navigate("/edit-profile")}
        >
          ✏️ Edit Profile
        </button>

      </div>
    </div>
  );
}

export default Profile;