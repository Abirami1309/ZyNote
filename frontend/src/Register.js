import React, { useState } from "react";
import axios from "axios";
import logo from "./logo.png";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Register() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async (e) => {
  e.preventDefault();

  try {
    await axios.post(
      "http://localhost:5000/auth/register",
      {
        name,
        email,
        password,
      }
    );

    toast.success(
      "✅ Registration Successful!"
    );

    setTimeout(() => {
      navigate("/login");
    }, 1500);

  } catch (err) {
    toast.error(
      err.response?.data?.message ||
      "Registration Failed"
    );
  }
};

  return (
    <div className="auth-container">

      <div className="auth-left">
        <img
          src={logo}
          alt="logo"
          className="auth-logo"
        />

        <h2>Your Space. Your Thoughts.</h2>

        <p className="left-description">
          Capture ideas, organize better,
          and stay inspired every day.
        </p>

        <div className="left-footer">
          ✨ Organize your notes effortlessly
          <br />
          💜 Stay inspired every day
        </div>
      </div>

      <div className="auth-right">

        <h2>Create Account</h2>

        <p className="login-subtitle">
          Join ZyNote and start organizing
          your ideas
        </p>

        <form onSubmit={handleRegister}>

          <label>Name</label>
          <input
            type="text"
            placeholder="Enter your name"
            value={name}
            onChange={(e) =>
              setName(e.target.value)
            }
            required
          />

          <label>Email</label>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
            required
          />

          <label>Password</label>
          <input
            type="password"
            placeholder="Create a password"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
            required
          />

          <button type="submit">
            Create Account
          </button>

        </form>

        <div className="auth-link">
          Already have an account?

          <span
  className="auth-nav-link"
  onClick={() => navigate("/login")}
>
  Login Here
</span>
        </div>

      </div>
<ToastContainer
  position="top-right"
  autoClose={2000}
/>
    </div>
  );
}

export default Register;