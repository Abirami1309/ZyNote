import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function EditProfile() {
  const user =
    JSON.parse(localStorage.getItem("user")) || {};

  const [name, setName] = useState(user.name || "");
  const [email, setEmail] = useState(user.email || "");

  const [currentPassword, setCurrentPassword] =
    useState("");

  const [newPassword, setNewPassword] =
    useState("");

  const [confirmPassword, setConfirmPassword] =
    useState("");

  const navigate = useNavigate();

  const handleSave = async () => {
    try {
      await axios.put(
        "http://localhost:5000/auth/profile",
        { name, email },
        {
          headers: {
            Authorization:
              localStorage.getItem("token"),
          },
        }
      );

      const updatedUser = {
        ...user,
        name,
        email,
      };

      localStorage.setItem(
        "user",
        JSON.stringify(updatedUser)
      );

      toast.success("✅ Profile Updated Successfully");
    } catch (err) {
      console.error(err);
      toast.error("❌ Failed to Update Profile");
    }
  };

  const handlePasswordChange = async () => {
    if (!currentPassword) {
      alert("Please enter current password");
      return;
    }

    if (!newPassword) {
      toast.error("Please enter new password");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      await axios.put(
        "http://localhost:5000/auth/change-password",
        {
          currentPassword,
          newPassword,
        },
        {
          headers: {
            Authorization:
              localStorage.getItem("token"),
          },
        }
      );

      toast.success("✅ Password Updated Successfully");

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      console.error(err);

      toast.error(
        err.response?.data?.message ||
          "❌ Failed to Update Password"
      );
    }
  };

  return (
    <div className="profile-container">
      <h2>✏️ Edit Profile</h2>

      <div className="profile-card">
        <label>Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) =>
            setName(e.target.value)
          }
        />

        <label>Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) =>
            setEmail(e.target.value)
          }
        />

        <button
          className="save-btn"
          onClick={handleSave}
        >
          💾 Save Profile
        </button>

        <hr />

        <h3>🔒 Change Password</h3>

        <input
          type="password"
          placeholder="Current Password"
          value={currentPassword}
          onChange={(e) =>
            setCurrentPassword(e.target.value)
          }
        />

        <input
          type="password"
          placeholder="New Password"
          value={newPassword}
          onChange={(e) =>
            setNewPassword(e.target.value)
          }
        />

        <input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) =>
            setConfirmPassword(e.target.value)
          }
        />

        <button
          className="password-btn"
          onClick={handlePasswordChange}
        >
          🔑 Update Password
        </button>

        <button
          className="back-btn"
          onClick={() => navigate("/profile")}
        >
          ← Back
        </button>
      </div>
      <ToastContainer
  position="top-right"
  autoClose={3000}
/>
    </div>
    
  );
}

export default EditProfile;