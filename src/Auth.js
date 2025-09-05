import { useState } from "react";
import { auth } from "./firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  fetchSignInMethodsForEmail,
} from "firebase/auth";
import "./Auth.css";

function Auth({ setUser }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const signup = async () => {
    try {
      const methods = await fetchSignInMethodsForEmail(auth, email);

      if (methods.length > 0) {
        alert("⚠️ This email is already registered. Please log in.");
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
        alert("🎉 Signup successful! You can now log in.");
      }
    } catch (error) {
      if (error.code === "auth/invalid-email") {
        alert("❌ Invalid email format.");
      } else if (error.code === "auth/weak-password") {
        alert("🔒 Password should be at least 6 characters.");
      } else {
        alert("❌ " + error.message);
      }
    }
  };

  const login = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      setUser(userCredential.user);
    } catch (error) {
      if (error.code === "auth/user-not-found") {
        alert("🚫 No such email exists. Please sign up first.");
      } else if (error.code === "auth/wrong-password") {
        alert("❌ Incorrect password. Try again.");
      } else if (error.code === "auth/invalid-email") {
        alert("⚠️ Invalid email format.");
      } else {
        alert("❌ " + error.message);
      }
    }
  };

  const logout = async () => {
    await signOut(auth);
    setUser(null);
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <h2 className="auth-title">Inventory Management System 🛒</h2>
        <p className="auth-subtitle">Login or create an account</p>

        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="auth-input"
        />
        <input
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="auth-input"
        />

        <div className="auth-buttons">
          <button className="auth-btn signup" onClick={signup}>
            Sign Up
          </button>
          <button className="auth-btn login" onClick={login}>
            Log In
          </button>
          <button className="auth-btn logout" onClick={logout}>
            Log Out
          </button>
        </div>
      </div>
    </div>
  );
}

export default Auth;
