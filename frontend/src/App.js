import React, { useState } from "react";

const API = "http://localhost:5000/api";

function AuthForm({ onLogin }) {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setMsg("");
    const url = isLogin ? `${API}/login` : `${API}/register`;

    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password })
    });
    const data = await res.json();

    if (data.success) {
      if (isLogin) {
        localStorage.setItem("username", data.username);
        onLogin(data.username);
      } else {
        setMsg("Registered! You can login now.");
        setIsLogin(true);
      }
    } else {
      setMsg(data.message);
    }
  };

  return (
    <div style={styles.box}>
      <h2>{isLogin ? "Login" : "Register"}</h2>
      <form onSubmit={submit}>
        <input
          style={styles.input}
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          style={styles.input}
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button style={styles.button} type="submit">
          {isLogin ? "Login" : "Register"}
        </button>
      </form>
      {msg && <p style={styles.msg}>{msg}</p>}
      <p style={styles.toggle} onClick={() => { setIsLogin(!isLogin); setMsg(""); }}>
        {isLogin ? "No account? Register" : "Have an account? Login"}
      </p>
    </div>
  );
}

function Dashboard({ username, onLogout }) {
  return (
    <div style={styles.box}>
      <h2>Welcome, {username} 🎉</h2>
      <p>You are logged in.</p>
      <button style={{ ...styles.button, background: "#e74a4a" }} onClick={onLogout}>
        Logout
      </button>
    </div>
  );
}

export default function App() {
  const [username, setUsername] = useState(localStorage.getItem("username"));

  const handleLogout = () => {
    localStorage.removeItem("username");
    setUsername(null);
  };

  return (
    <div style={styles.page}>
      {username ? (
        <Dashboard username={username} onLogout={handleLogout} />
      ) : (
        <AuthForm onLogin={setUsername} />
      )}
    </div>
  );
}

const styles = {
  page: {
    fontFamily: "Arial, sans-serif",
    background: "#f2f2f2",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh"
  },
  box: {
    background: "#fff",
    padding: 30,
    borderRadius: 8,
    boxShadow: "0 0 10px rgba(0,0,0,0.1)",
    width: 300,
    textAlign: "center"
  },
  input: {
    width: "100%",
    padding: 8,
    margin: "8px 0",
    boxSizing: "border-box"
  },
  button: {
    width: "100%",
    padding: 10,
    background: "#4a63e7",
    color: "#fff",
    border: "none",
    borderRadius: 4,
    cursor: "pointer",
    marginTop: 5
  },
  msg: {
    color: "red",
    textAlign: "center"
  },
  toggle: {
    color: "#4a63e7",
    cursor: "pointer",
    marginTop: 10
  }
};
