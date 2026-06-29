import React, { useState } from "react";
import axios from "axios";
import logo from "./logo.png";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();
  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        "http://localhost:5000/auth/login",
        {
          email,
          password,
        }
      );

      localStorage.setItem(
        "token",
        res.data.token
      );

      localStorage.setItem(
        "user",
        JSON.stringify(res.data.user)
      );

      toast.success("✅ Login Successful!");

setTimeout(() => {
  navigate("/");
}, 1500);} catch (err) {
      toast.error(
  err.response?.data?.message ||
  "Login Failed"
);
    }
  };

  return (
  <div className="auth-container">

    <div className="auth-left">
      <img src={logo} alt="logo" className="auth-logo" />

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

      <h2>Welcome Back!</h2>

      <p className="login-subtitle">
        Sign in to continue to your account
      </p>

      <label>Email</label>
      <input
        type="email"
        value={email}
        placeholder="Enter your email"
        onChange={(e) => setEmail(e.target.value)}
      />

      <label>Password</label>
      <input
        type="password"
        value={password}
        placeholder="Enter your password"
        onChange={(e) => setPassword(e.target.value)}
      />

      <button onClick={handleLogin}>
        Login
      </button>

      <div className="auth-link">
  Don't have an account?
  <span
    className="register-link"
    onClick={() => navigate("/register")}
  >
    Register Here
  </span>
</div>
    </div>
<ToastContainer
  position="top-right"
  autoClose={3000}
/>
  </div>
);
}

export default Login;