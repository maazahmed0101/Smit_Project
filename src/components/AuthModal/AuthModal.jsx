import { useEffect, useState } from "react";
import Modal from "../Modal/Modal.jsx";
import Button from "../Button/Button.jsx";
import { useAuth } from "../../context/AuthContext.jsx";
import "./AuthModal.css";

// Mock log in / sign up. No password and no server: it only creates a local profile.
export default function AuthModal() {
  const { authModal, closeAuth, login, loginAsDemo } = useAuth();
  const [mode, setMode] = useState(authModal.mode);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (authModal.open) {
      setMode(authModal.mode);
      setError("");
    }
  }, [authModal.open, authModal.mode]);

  if (!authModal.open) return null;

  const isSignup = mode === "signup";

  const submit = (e) => {
    e.preventDefault();
    const cleanEmail = email.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      setError("Enter a valid email address.");
      return;
    }
    if (isSignup && !name.trim()) {
      setError("Enter your name.");
      return;
    }
    setError("");
    login({ name: isSignup ? name : "", email: cleanEmail });
  };

  return (
    <Modal title={isSignup ? "Create your account" : "Log in to PLAY"} onClose={closeAuth}>
      {authModal.reason && <p className="auth__reason">{authModal.reason}</p>}
      <form className="auth__form" onSubmit={submit} noValidate>
        {isSignup && (
          <div className="field">
            <label htmlFor="auth-name">Name</label>
            <input id="auth-name" className="input" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" autoComplete="name" data-autofocus />
          </div>
        )}
        <div className="field">
          <label htmlFor="auth-email">Email</label>
          <input
            id="auth-email"
            className="input"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            autoComplete="email"
            data-autofocus={!isSignup ? true : undefined}
            aria-invalid={error ? "true" : undefined}
            aria-describedby={error ? "auth-error" : undefined}
          />
        </div>
        {error && (
          <p id="auth-error" className="auth__error" role="alert">
            {error}
          </p>
        )}
        <Button type="submit" shadow className="auth__submit">
          {isSignup ? "Sign up" : "Log in"}
        </Button>
      </form>

      <div className="auth__alt">
        <Button variant="secondary" className="auth__demo" onClick={loginAsDemo}>
          Continue as demo user (Yash Mittal)
        </Button>
        <p className="auth__switch">
          {isSignup ? "Already have an account?" : "New to PLAY?"}{" "}
          <button type="button" className="auth__link" onClick={() => setMode(isSignup ? "login" : "signup")}>
            {isSignup ? "Log in" : "Sign up"}
          </button>
        </p>
        <p className="auth__note">Demo mode: no password or server is used. Your profile and activity stay in this browser.</p>
      </div>
    </Modal>
  );
}
