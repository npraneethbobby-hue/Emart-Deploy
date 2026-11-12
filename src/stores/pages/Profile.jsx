
import { useState } from "react";
import { Navigate } from "react-router-dom";
import { sendPasswordResetEmail } from "firebase/auth";

import { auth } from "../../firebase";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import "./Auth.css";

export default function Profile() {
  const { user, loading, setPassword } = useAuth();

  const [password, setPasswordValue] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [busy, setBusy] = useState(false);
  const [resetBusy, setResetBusy] = useState(false);

  if (loading) return <p>Loading...</p>;
  if (!user) return <Navigate to="/login" replace />;

  const hasPassword = user.providerData.some(
    (provider) => provider.providerId === "password"
  );

  // Create an E-Mart password
  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setMessage("");

    if (password.length < 6) {
      setError("Password must contain at least 6 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setBusy(true);

    try {
      await setPassword(password);

      setMessage(
        "E-Mart password created successfully! You can now log in using your email and password."
      );

      setPasswordValue("");
      setConfirmPassword("");
    } catch (err) {
      setError(
        err.code === "auth/requires-recent-login"
          ? "Please log out and log in again before setting your password."
          : "Unable to set password. Please try again."
      );
    } finally {
      setBusy(false);
    }
  };

  // Send password reset email
  const handleResetPassword = async () => {
    setError("");
    setMessage("");
    setResetBusy(true);

    try {
      await sendPasswordResetEmail(auth, user.email);

      setMessage(
        "Password reset email sent! Check your inbox and spam folder."
      );
    } catch (err) {
      const errorMessages = {
        "auth/invalid-email": "Your account email address is invalid.",
        "auth/too-many-requests": "Too many attempts. Please try again later.",
        "auth/network-request-failed": "Network error. Check your internet connection.",
      };

      setError(
        errorMessages[err.code] ||
        "Unable to send reset email. Please try again."
      );
    } finally {
      setResetBusy(false);
    }
  };

  return (
    <>
      <Navbar />

      <div className="auth-container">
        <div className="auth-form">
          <h2>My Account</h2>

          <p><strong>Email:</strong> {user.email}</p>

          {error && (
            <p className="auth-error">{error}</p>
          )}

          {message && (
            <p className="auth-success">{message}</p>
          )}

          {hasPassword ? (
            <>
              <h3>Password Settings</h3>

              <p>
                Your E-Mart email and password login is enabled.
              </p>

              <button
                type="button"
                onClick={handleResetPassword}
                disabled={resetBusy}
              >
                {resetBusy ? "Sending Email..." : "Reset Password"}
              </button>
            </>
          ) : (
            <>
              <h3>Set E-Mart Password</h3>

              <p>
                Your account currently uses Google login.
                Create a password to also log in using your email.
              </p>

              <form onSubmit={handleSubmit}>
                <input
                  type="password"
                  placeholder="New password"
                  value={password}
                  onChange={(e) => setPasswordValue(e.target.value)}
                  minLength={6}
                  required
                />

                <input
                  type="password"
                  placeholder="Confirm password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  minLength={6}
                  required
                />

                <button type="submit" disabled={busy}>
                  {busy ? "Saving..." : "Set Password"}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </>
  );
}
