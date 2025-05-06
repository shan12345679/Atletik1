import React, { useState } from "react";
import supabase from "../helper/supabaseClient";
import { Link, useNavigate } from "react-router-dom";
import "./admin.css"; // Import the separate CSS file

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage("");

    const { data, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (error) {
      setMessage(error.message);
      setEmail("");
      setPassword("");
      return;
    }

    if (data) {
      navigate("/dashboard");
      return null;
    }
  };

  return (
    <div className="login-page-container">
      <form className="login" onSubmit={handleSubmit}>
        <h2 className="login-title">Login</h2>
        <br />
        {message && <span>{message}</span>}
        <div className="input-container">
          <input
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            type="email"
            placeholder="Email"
            required
          />
        </div>
        <div className="input-container">
          <input
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            type="password"
            placeholder="Password"
            required
          />
        </div>
        <button type="submit" className="submit">Log in</button>
      </form>
    </div>
  );
  
}

export default Login;


// tite
// summary basta description


// secret to basta oa