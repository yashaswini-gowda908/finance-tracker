import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import "./App.css";

export default function Signup() {
  const [form, setForm]       = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const navigate              = useNavigate();

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post("http://localhost:5000/api/auth/signup", form);
      alert("Account created! Please log in.");
      navigate("/login");
    } catch (err) {
      alert(err.response?.data?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">💰</div>
        <h1 className="auth-title">Finance Tracker</h1>
        <p className="auth-subtitle">Create your account to get started</p>

        <form onSubmit={onSubmit}>
          <div className="form-group">
            <label>Full Name</label>
            <input name="name" type="text" placeholder="John Doe"
              value={form.name} onChange={onChange} required />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input name="email" type="email" placeholder="john@example.com"
              value={form.email} onChange={onChange} required />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input name="password" type="password" placeholder="Min 6 characters"
              value={form.password} onChange={onChange} required minLength={6} />
          </div>
          <button className="btn btn-primary" type="submit" disabled={loading}>
            {loading ? "Creating account…" : "Create Account"}
          </button>
        </form>

        <p className="auth-footer">
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
