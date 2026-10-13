import React, { useState } from "react";
import { loginAPI, registerAPI } from "../apiService";
import { soundManager } from "../soundEffects";
import { triggerConfetti } from "../confetti";

export default function AuthModal({ isOpen, onClose, onAuthSuccess, fullScreen = false }) {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [country, setCountry] = useState("🇮🇳 India");
  const [errorMsg, setErrorMsg] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setIsSubmitting(true);
    soundManager.playRecordBeep(true);

    if (isLogin) {
      const res = await loginAPI(username, password);
      setIsSubmitting(false);
      if (res.success) {
        soundManager.playSuccess();
        triggerConfetti();
        onAuthSuccess(res.user);
        onClose();
      } else {
        setErrorMsg(res.message);
        soundManager.playRecordBeep(false);
      }
    } else {
      const res = await registerAPI(username, password, fullName, country);
      setIsSubmitting(false);
      if (res.success) {
        soundManager.playCashout();
        triggerConfetti();
        onAuthSuccess(res.user);
        onClose();
      } else {
        setErrorMsg(res.message);
        soundManager.playRecordBeep(false);
      }
    }
  };

  const handleDemoLogin = async () => {
    setIsSubmitting(true);
    soundManager.playRecordBeep(true);
    const res = await loginAPI("prakash", "password123");
    setIsSubmitting(false);
    if (res.success) {
      soundManager.playSuccess();
      triggerConfetti();
      onAuthSuccess(res.user);
      onClose();
    }
  };

  // ── Full-Screen Login Gate (for unauthenticated visitors) ──
  if (fullScreen) {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          padding: "24px 16px",
          background: "linear-gradient(165deg, #0a0f1d 0%, #0f172a 50%, #1a1035 100%)",
          overflowY: "auto"
        }}
      >
        {/* App Branding */}
        <div style={{ textAlign: "center", marginBottom: "28px" }}>
          <div style={{ fontSize: "48px", marginBottom: "8px" }}>🎙️</div>
          <h1
            style={{
              fontSize: "26px",
              fontWeight: 800,
              color: "#fff",
              margin: "0 0 4px 0",
              letterSpacing: "-0.5px"
            }}
          >
            SpeakDaily
          </h1>
          <div
            style={{
              display: "inline-block",
              background: "linear-gradient(135deg, #6366f1, #a855f7)",
              padding: "3px 12px",
              borderRadius: "20px",
              fontSize: "10px",
              fontWeight: 700,
              color: "#fff",
              letterSpacing: "1.5px",
              textTransform: "uppercase",
              marginBottom: "10px"
            }}
          >
            MICROVOICE
          </div>
          <p
            style={{
              fontSize: "13px",
              color: "#94a3b8",
              margin: "8px 0 0 0",
              maxWidth: "300px",
              lineHeight: "1.5"
            }}
          >
            Speak 30 seconds daily. Earn real money.
            <br />
            Practice pronunciation & build your streak! 🔥
          </p>
        </div>

        {/* Auth Card */}
        <div
          style={{
            width: "100%",
            maxWidth: "400px",
            background: "rgba(15, 23, 42, 0.85)",
            border: "1px solid rgba(99, 102, 241, 0.2)",
            borderRadius: "18px",
            padding: "24px 20px",
            backdropFilter: "blur(12px)"
          }}
        >
          {/* Tab switch */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "6px",
              background: "rgba(255, 255, 255, 0.05)",
              padding: "4px",
              borderRadius: "10px",
              marginBottom: "16px"
            }}
          >
            <button
              type="button"
              onClick={() => {
                setIsLogin(true);
                setErrorMsg("");
              }}
              style={{
                background: isLogin ? "#6366f1" : "transparent",
                color: "#fff",
                border: "none",
                borderRadius: "8px",
                padding: "10px",
                fontSize: "13px",
                fontWeight: 700,
                cursor: "pointer",
                transition: "all 0.2s ease"
              }}
            >
              🔑 Sign In
            </button>
            <button
              type="button"
              onClick={() => {
                setIsLogin(false);
                setErrorMsg("");
              }}
              style={{
                background: !isLogin ? "#10b981" : "transparent",
                color: "#fff",
                border: "none",
                borderRadius: "8px",
                padding: "10px",
                fontSize: "13px",
                fontWeight: 700,
                cursor: "pointer",
                transition: "all 0.2s ease"
              }}
            >
              ✨ Register (+50 PTS)
            </button>
          </div>

          {/* 1-Click Demo Login */}
          <div style={{ marginBottom: "16px" }}>
            <button
              type="button"
              onClick={handleDemoLogin}
              disabled={isSubmitting}
              style={{
                width: "100%",
                background:
                  "linear-gradient(135deg, rgba(99, 102, 241, 0.18) 0%, rgba(168, 85, 247, 0.18) 100%)",
                border: "1px dashed rgba(99, 102, 241, 0.4)",
                color: "#c7d2fe",
                padding: "10px",
                borderRadius: "10px",
                fontSize: "12px",
                fontWeight: 700,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "6px"
              }}
            >
              <span>⚡</span>
              <span>1-Click Evaluator Demo Login</span>
            </button>
          </div>

          {errorMsg && (
            <div
              style={{
                background: "rgba(244, 63, 94, 0.15)",
                border: "1px solid rgba(244, 63, 94, 0.3)",
                color: "#fb7185",
                padding: "8px 12px",
                borderRadius: "8px",
                fontSize: "12px",
                marginBottom: "12px"
              }}
            >
              ⚠️ {errorMsg}
            </div>
          )}

          {/* Auth Form */}
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {!isLogin && (
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "11px",
                    color: "#94a3b8",
                    marginBottom: "4px"
                  }}
                >
                  Full Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Prakash Kumar"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  style={{
                    width: "100%",
                    background: "rgba(0, 0, 0, 0.3)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: "8px",
                    padding: "10px 12px",
                    color: "#fff",
                    fontSize: "13px",
                    outline: "none",
                    boxSizing: "border-box"
                  }}
                />
              </div>
            )}

            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "11px",
                  color: "#94a3b8",
                  marginBottom: "4px"
                }}
              >
                Username
              </label>
              <input
                type="text"
                required
                placeholder="e.g. prakash"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                style={{
                  width: "100%",
                  background: "rgba(0, 0, 0, 0.3)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: "8px",
                  padding: "10px 12px",
                  color: "#fff",
                  fontSize: "13px",
                  outline: "none",
                  boxSizing: "border-box"
                }}
              />
            </div>

            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "11px",
                  color: "#94a3b8",
                  marginBottom: "4px"
                }}
              >
                Password
              </label>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{
                  width: "100%",
                  background: "rgba(0, 0, 0, 0.3)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: "8px",
                  padding: "10px 12px",
                  color: "#fff",
                  fontSize: "13px",
                  outline: "none",
                  boxSizing: "border-box"
                }}
              />
            </div>

            {!isLogin && (
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "11px",
                    color: "#94a3b8",
                    marginBottom: "4px"
                  }}
                >
                  Country
                </label>
                <select
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  style={{
                    width: "100%",
                    background: "#1e293b",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: "8px",
                    padding: "10px 12px",
                    color: "#fff",
                    fontSize: "13px",
                    outline: "none",
                    boxSizing: "border-box"
                  }}
                >
                  <option value="🇮🇳 India">🇮🇳 India</option>
                  <option value="🇵🇭 Philippines">🇵🇭 Philippines</option>
                  <option value="🇮🇩 Indonesia">🇮🇩 Indonesia</option>
                  <option value="🇳🇬 Nigeria">🇳🇬 Nigeria</option>
                  <option value="🇰🇪 Kenya">🇰🇪 Kenya</option>
                  <option value="🇲🇽 Mexico">🇲🇽 Mexico</option>
                </select>
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="cashout-action-btn"
              style={{
                marginTop: "8px",
                background: isLogin
                  ? "linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)"
                  : "linear-gradient(135deg, #10b981 0%, #059669 100%)"
              }}
            >
              {isSubmitting
                ? "Connecting..."
                : isLogin
                ? "Log In to Account ➔"
                : "Register & Claim +50 PTS 🎁"}
            </button>
          </form>
        </div>

        {/* Footer */}
        <div
          style={{
            marginTop: "20px",
            textAlign: "center",
            fontSize: "11px",
            color: "#475569"
          }}
        >
          © 2026 SpeakDaily MicroVoice · Built for Kenpath Labs
        </div>
      </div>
    );
  }

  // ── Standard Modal Mode (for in-app sign-in / switch account) ──
  return (
    <div className="modal-overlay" onClick={onClose} id="auth-modal-overlay">
      <div className="modal-sheet" onClick={(e) => e.stopPropagation()} style={{ maxWidth: "440px" }}>
        <div className="modal-handle-bar"></div>

        <div className="modal-header">
          <div className="modal-title">
            <span>{isLogin ? "🔑 Sign In" : "✨ Create Account"}</span>
          </div>
          <button className="modal-close-btn" onClick={onClose} aria-label="Close">
            ✕
          </button>
        </div>

        {/* Tab switch */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "6px",
            background: "rgba(255, 255, 255, 0.05)",
            padding: "4px",
            borderRadius: "10px",
            marginBottom: "16px"
          }}
        >
          <button
            type="button"
            onClick={() => {
              setIsLogin(true);
              setErrorMsg("");
            }}
            style={{
              background: isLogin ? "#6366f1" : "transparent",
              color: "#fff",
              border: "none",
              borderRadius: "8px",
              padding: "8px",
              fontSize: "12px",
              fontWeight: 700,
              cursor: "pointer",
              transition: "all 0.2s ease"
            }}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              setIsLogin(false);
              setErrorMsg("");
            }}
            style={{
              background: !isLogin ? "#10b981" : "transparent",
              color: "#fff",
              border: "none",
              borderRadius: "8px",
              padding: "8px",
              fontSize: "12px",
              fontWeight: 700,
              cursor: "pointer",
              transition: "all 0.2s ease"
            }}
          >
            Register (+50 PTS Gift)
          </button>
        </div>

        {/* 1-Click Fast Demo Login Pill */}
        <div style={{ marginBottom: "16px" }}>
          <button
            type="button"
            onClick={handleDemoLogin}
            disabled={isSubmitting}
            style={{
              width: "100%",
              background: "linear-gradient(135deg, rgba(99, 102, 241, 0.18) 0%, rgba(168, 85, 247, 0.18) 100%)",
              border: "1px dashed rgba(99, 102, 241, 0.4)",
              color: "#c7d2fe",
              padding: "10px",
              borderRadius: "10px",
              fontSize: "12px",
              fontWeight: 700,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "6px"
            }}
          >
            <span>⚡</span>
            <span>1-Click Evaluator Login as Prakash (Streak: 5)</span>
          </button>
        </div>

        {errorMsg && (
          <div
            style={{
              background: "rgba(244, 63, 94, 0.15)",
              border: "1px solid rgba(244, 63, 94, 0.3)",
              color: "#fb7185",
              padding: "8px 12px",
              borderRadius: "8px",
              fontSize: "12px",
              marginBottom: "12px"
            }}
          >
            ⚠️ {errorMsg}
          </div>
        )}

        {/* Auth Form */}
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {!isLogin && (
            <div>
              <label style={{ display: "block", fontSize: "11px", color: "var(--text-secondary)", marginBottom: "4px" }}>
                Full Name
              </label>
              <input
                type="text"
                placeholder="e.g. Prakash Kumar"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                style={{
                  width: "100%",
                  background: "rgba(0, 0, 0, 0.3)",
                  border: "1px solid var(--border-subtle)",
                  borderRadius: "8px",
                  padding: "10px 12px",
                  color: "#fff",
                  fontSize: "13px",
                  outline: "none"
                }}
              />
            </div>
          )}

          <div>
            <label style={{ display: "block", fontSize: "11px", color: "var(--text-secondary)", marginBottom: "4px" }}>
              Username
            </label>
            <input
              type="text"
              required
              placeholder="e.g. prakash"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              style={{
                width: "100%",
                background: "rgba(0, 0, 0, 0.3)",
                border: "1px solid var(--border-subtle)",
                borderRadius: "8px",
                padding: "10px 12px",
                color: "#fff",
                fontSize: "13px",
                outline: "none"
              }}
            />
          </div>

          <div>
            <label style={{ display: "block", fontSize: "11px", color: "var(--text-secondary)", marginBottom: "4px" }}>
              Password
            </label>
            <input
              type="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                width: "100%",
                background: "rgba(0, 0, 0, 0.3)",
                border: "1px solid var(--border-subtle)",
                borderRadius: "8px",
                padding: "10px 12px",
                color: "#fff",
                fontSize: "13px",
                outline: "none"
              }}
            />
          </div>

          {!isLogin && (
            <div>
              <label style={{ display: "block", fontSize: "11px", color: "var(--text-secondary)", marginBottom: "4px" }}>
                Country
              </label>
              <select
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                style={{
                  width: "100%",
                  background: "#1e293b",
                  border: "1px solid var(--border-subtle)",
                  borderRadius: "8px",
                  padding: "10px 12px",
                  color: "#fff",
                  fontSize: "13px",
                  outline: "none"
                }}
              >
                <option value="🇮🇳 India">🇮🇳 India</option>
                <option value="🇵🇭 Philippines">🇵🇭 Philippines</option>
                <option value="🇮🇩 Indonesia">🇮🇩 Indonesia</option>
                <option value="🇳🇬 Nigeria">🇳🇬 Nigeria</option>
                <option value="🇰🇪 Kenya">🇰🇪 Kenya</option>
                <option value="🇲🇽 Mexico">🇲🇽 Mexico</option>
              </select>
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="cashout-action-btn"
            style={{
              marginTop: "8px",
              background: isLogin
                ? "linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)"
                : "linear-gradient(135deg, #10b981 0%, #059669 100%)"
            }}
          >
            {isSubmitting
              ? "Connecting..."
              : isLogin
              ? "Log In to Account ➔"
              : "Register & Claim +50 PTS 🎁"}
          </button>
        </form>
      </div>
    </div>
  );
}
