import React, { useState } from "react";
import "./Loginpage.css";

const LoginPage = () => {
  const [isSignup, setIsSignup] = useState(false);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const url = isSignup
      ? "http://localhost:5000/api/auth/register"
      : "http://localhost:5000/api/auth/login";

    const body = isSignup
      ? { name: formData.name, email: formData.email, password: formData.password }
      : { email: formData.email, password: formData.password };

    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.msg || "Error occurred");
      } else {
        alert(
          isSignup
            ? `Signup successful for ${data.user.name}`
            : `Login successful for ${data.user.email}`
        );

        // Save token in localStorage for authenticated requests
        localStorage.setItem("token", data.token);

        // Optionally, reset form
        setFormData({ name: "", email: "", password: "" });
      }
    } catch (err) {
      console.error("Server error:", err);
      alert("Server error. Try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="form-box">
        <h2>{isSignup ? "Create Account" : "Welcome Back"}</h2>
        <p className="subtitle">
          {isSignup
            ? "Join us and start your healthcare journey"
            : "Sign in to continue to your dashboard"}
        </p>

        <form onSubmit={handleSubmit}>
          {isSignup && (
            <div className="input-group">
              <label>Name</label>
              <input
                type="text"
                name="name"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
          )}

          <div className="input-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" className="btn" disabled={loading}>
            {loading ? "Processing..." : isSignup ? "Sign Up" : "Sign In"}
          </button>
        </form>

        <p className="switch-text">
          {isSignup ? "Already have an account?" : "New to our platform?"}{" "}
          <span onClick={() => setIsSignup(!isSignup)}>
            {isSignup ? "Sign In" : "Sign Up"}
          </span>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
