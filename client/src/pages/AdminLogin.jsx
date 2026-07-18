import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ADMIN_USERNAME = "abdul";
const ADMIN_PASSWORD = "4321";

export default function AdminLogin() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: "", password: "" });
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState("");
  const [loading, setLoading] = useState(false);

  // Check if already logged in
  React.useEffect(() => {
    // Simple localStorage simulation for session
    if (localStorage.getItem("adminToken") === "abdul") {
      navigate("/admin", { replace: true });
    }
  }, [navigate]);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
    setSubmitError("");
  };

  const validate = () => {
    const newErrors = {};
    if (!form.username) newErrors.username = "Username is required";
    if (!form.password) newErrors.password = "Password is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setSubmitError("");
    if (!validate()) return;

    setLoading(true);
    try {
      // Normally the validation would go to an API, but per spec:
      if (
        form.username === ADMIN_USERNAME &&
        form.password === ADMIN_PASSWORD
      ) {
        // Simulate token for session
        localStorage.setItem("adminToken", ADMIN_USERNAME);
        navigate("/admin", { replace: true });
      } else {
        setSubmitError("Incorrect username or password.");
      }
    } catch (err) {
      setSubmitError("Unexpected error, please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-page">
      <div className="admin-login-container">
        <h2 className="admin-login-title">Admin Login</h2>
        <form
          className="admin-login-form"
          autoComplete="off"
          onSubmit={handleSubmit}
        >
          <div className="admin-login-field">
            <label htmlFor="username" className="admin-login-label">
              Username
            </label>
            <input
              id="username"
              name="username"
              type="text"
              autoFocus
              className={
                "admin-login-input" +
                (errors.username ? " admin-login-input-error" : "")
              }
              value={form.username}
              onChange={handleChange}
              disabled={loading}
              autoComplete="username"
            />
            {errors.username && (
              <div className="admin-login-error">{errors.username}</div>
            )}
          </div>
          <div className="admin-login-field">
            <label htmlFor="password" className="admin-login-label">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              className={
                "admin-login-input" +
                (errors.password ? " admin-login-input-error" : "")
              }
              value={form.password}
              onChange={handleChange}
              disabled={loading}
              autoComplete="current-password"
            />
            {errors.password && (
              <div className="admin-login-error">{errors.password}</div>
            )}
          </div>
          <button
            type="submit"
            className="admin-login-submit"
            disabled={loading}
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
          {submitError && (
            <div className="admin-login-error">{submitError}</div>
          )}
        </form>
        <div className="admin-login-hint">
          <strong>Demo:</strong> Username <span className="admin-login-hint-code">abdul</span>,
          Password <span className="admin-login-hint-code">4321</span>
        </div>
      </div>
      <style>{`
        .admin-login-page {
          min-height: 90vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--bg-gradient, linear-gradient(135deg, #eef2fa 0%, #d0eafd 100%));
        }
        .admin-login-container {
          background: var(--card-bg, #fff);
          box-shadow: 0 6px 32px rgba(36,108,179,0.09), 0 1.5px 6px rgba(0,0,50,0.08);
          border-radius: 22px;
          max-width: 370px;
          width: 100%;
          padding: 42px 32px 22px 32px;
          display: flex;
          flex-direction: column;
          gap: 32px;
        }
        .admin-login-title {
          font-size: 2rem;
          font-weight: bold;
          color: var(--primary, #246CB3);
          text-align: center;
          margin: 0;
        }
        .admin-login-form {
          display: flex;
          flex-direction: column;
          gap: 22px;
        }
        .admin-login-field {
          display: flex;
          flex-direction: column;
          gap: 7px;
        }
        .admin-login-label {
          font-size: 1rem;
          color: var(--label, #444);
          font-weight: 500;
        }
        .admin-login-input {
          padding: 0.7rem 1.1rem;
          border: 1.5px solid var(--input-border, #c4d1e9);
          border-radius: 12px;
          font-size: 1rem;
          background: #f7fbff;
          transition: border 0.15s;
          outline: none;
        }
        .admin-login-input:focus {
          border-color: var(--primary, #246CB3);
          background: #fff;
        }
        .admin-login-input-error {
          border-color: #d84646;
        }
        .admin-login-error {
          margin-top: 4px;
          color: #d84646;
          font-size: 0.95rem;
        }
        .admin-login-submit {
          padding: 0.75rem 1rem;
          font-size: 1.08rem;
          border-radius: 14px;
          background: var(--primary, #246CB3);
          color: #fff;
          font-weight: bold;
          border: none;
          box-shadow: 0 2px 10px rgba(36,108,179,0.08);
          cursor: pointer;
          transition: background 0.12s, box-shadow 0.12s;
        }
        .admin-login-submit:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
        .admin-login-submit:hover:not(:disabled),
        .admin-login-submit:focus-visible {
          background: #1f5c97;
          box-shadow: 0 4px 18px rgba(36,108,179,0.1);
        }
        .admin-login-hint {
          margin-top: 16px;
          font-size: 0.95rem;
          text-align: center;
          color: #899cd0;
        }
        .admin-login-hint-code {
          background: #e7f2ff;
          color: var(--primary, #246CB3);
          font-weight: bold;
          padding: 2px 7px;
          border-radius: 6px;
          font-family: monospace;
        }
        @media (max-width: 500px) {
          .admin-login-container {
            padding: 24px 10px 16px 10px;
            border-radius: 16px;
            gap: 18px;
          }
        }
      `}</style>
    </div>
  );
}