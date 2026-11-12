
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import "./Auth.css";

import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../../firebase";

// Convert Firebase errors into user-friendly messages
const getFriendlyError = (code) => {
  const errors = {
    "auth/invalid-credential":
      "Incorrect email or password. Please try again.",

    "auth/wrong-password":
      "Incorrect email or password. Please try again.",

    "auth/user-not-found":
      "Incorrect email or password. Please try again.",

    "auth/invalid-email":
      "Please enter a valid email address.",

    "auth/email-already-in-use":
      "This email is already registered. Please log in.",

    "auth/weak-password":
      "Your password must contain at least 6 characters.",

    "auth/user-disabled":
      "This account has been disabled. Contact support.",

    "auth/too-many-requests":
      "Too many attempts. Please try again later.",

    "auth/network-request-failed":
      "Network error. Check your internet connection.",

    "auth/popup-closed-by-user":
      "Google login was cancelled.",

    "auth/popup-blocked":
      "Your browser blocked the login popup. Allow popups and try again.",

    "auth/operation-not-allowed":
      "This login method is currently unavailable.",
  };

  return errors[code] || "Something went wrong. Please try again.";
};

export default function Login() {
  const [isSignup, setIsSignup] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const { signup, login, googleLogin } = useAuth();
  const navigate = useNavigate();

  // Email/password login and signup
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setBusy(true);

    try {
      if (isSignup) {
        await signup(name, email.trim(), password);
      } else {
        await login(email.trim(), password);
      }

      navigate("/");
    } catch (err) {
      setError(getFriendlyError(err.code));
    } finally {
      setBusy(false);
    }
  };

  // Google login
  const handleGoogleLogin = async () => {
    setError("");
    setBusy(true);

    try {
      await googleLogin();
      navigate("/");
    } catch (err) {
      if (err.code !== "auth/popup-closed-by-user") {
        setError(getFriendlyError(err.code));
      }
    } finally {
      setBusy(false);
    }
  };

  // Forgot password
  const handleForgotPassword = async () => {
    setError("");

    if (!email.trim()) {
      setError("Please enter your email address first.");
      return;
    }

    setBusy(true);

    try {
      await sendPasswordResetEmail(auth, email.trim());

      alert("If an account exists for this email, a password reset link will be sent.");
    } catch (err) {
      setError(getFriendlyError(err.code));
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <Navbar />

      <div className="auth-container">
        <div className="auth-form">
          <h2>{isSignup ? "Create Account" : "Welcome Back"}</h2>

          <p>
            {isSignup
              ? "Sign up to start shopping"
              : "Login to your E-Mart account"}
          </p>

          {error && <p className="auth-error">{error}</p>}

          <form onSubmit={handleSubmit}>
            {isSignup && (
              <input
                type="text"
                placeholder="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            )}

            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              minLength={6}
              required
            />

            {!isSignup && (
              <p style={{ textAlign: "right", margin: "8px 0" }}>
                <button
                  type="button"
                  onClick={handleForgotPassword}
                  disabled={busy}
                  style={{
                    background: "none",
                    border: "none",
                    color: "#f97316",
                    cursor: "pointer",
                    padding: 0,
                  }}
                >
                  Forgot Password?
                </button>
              </p>
            )}

            <button type="submit" disabled={busy}>
              {busy
                ? "Please wait..."
                : isSignup
                ? "Create Account"
                : "Login"}
            </button>
          </form>

          <div className="auth-divider">OR</div>

          <button
            type="button"
            className="google-btn"
            onClick={handleGoogleLogin}
            disabled={busy}
          >
            Continue with Google
          </button>

          <p className="auth-switch">
            {isSignup
              ? "Already have an account?"
              : "Don't have an account?"}

            <button
              type="button"
              disabled={busy}
              onClick={() => {
                setIsSignup(!isSignup);
                setError("");
              }}
            >
              {isSignup ? "Login" : "Sign Up"}
            </button>
          </p>
        </div>
      </div>
    </>
  );
}
