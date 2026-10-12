import React from "react";
import { soundManager } from "../soundEffects";

export default function AccountModal({
  isOpen,
  onClose,
  currentUser,
  points,
  streak,
  xp,
  currency,
  onLogout
}) {
  if (!isOpen) return null;

  const cashVal = (points * currency.rate).toFixed(2);

  return (
    <div className="modal-overlay" onClick={onClose} id="account-modal-overlay">
      <div className="modal-sheet" onClick={(e) => e.stopPropagation()} style={{ maxWidth: "440px" }}>
        <div className="modal-handle-bar"></div>

        <div className="modal-header">
          <div className="modal-title">
            <span>👤</span>
            <span>My Account Profile</span>
          </div>
          <button className="modal-close-btn" onClick={onClose} aria-label="Close">
            ✕
          </button>
        </div>

        {/* User Profile Card */}
        <div
          style={{
            background: "linear-gradient(135deg, rgba(99, 102, 241, 0.15) 0%, rgba(16, 185, 129, 0.1) 100%)",
            border: "1px solid rgba(99, 102, 241, 0.3)",
            borderRadius: "16px",
            padding: "20px",
            textAlign: "center",
            marginBottom: "16px"
          }}
        >
          <div
            style={{
              width: "60px",
              height: "60px",
              borderRadius: "50%",
              background: "linear-gradient(135deg, #6366f1 0%, #a855f7 100%)",
              color: "#fff",
              fontSize: "24px",
              fontWeight: "800",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 10px auto",
              boxShadow: "0 4px 15px rgba(99, 102, 241, 0.4)"
            }}
          >
            {currentUser?.fullName?.charAt(0) || currentUser?.username?.charAt(0) || "P"}
          </div>

          <div style={{ fontSize: "16px", fontWeight: "800", color: "#fff" }}>
            {currentUser?.fullName || currentUser?.username || "Prakash Kumar"}
          </div>
          <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>
            @{currentUser?.username || "prakash"} • {currentUser?.country || "🇮🇳 India"}
          </div>

          <div
            style={{
              display: "inline-block",
              marginTop: "8px",
              fontSize: "10px",
              background: "rgba(16, 185, 129, 0.2)",
              color: "#34d399",
              border: "1px solid rgba(16, 185, 129, 0.4)",
              padding: "2px 8px",
              borderRadius: "12px",
              fontWeight: "700"
            }}
          >
            ✓ Verified Micro-Earner
          </div>
        </div>

        {/* Account Stats Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "10px",
            marginBottom: "16px"
          }}
        >
          <div
            style={{
              background: "rgba(255, 255, 255, 0.04)",
              border: "1px solid var(--border-subtle)",
              borderRadius: "12px",
              padding: "12px",
              textAlign: "center"
            }}
          >
            <div style={{ fontSize: "11px", color: "var(--text-muted)", marginBottom: "4px" }}>
              Wallet Value
            </div>
            <div style={{ fontSize: "18px", fontWeight: "800", color: "#34d399" }}>
              {currency.symbol}{cashVal}
            </div>
            <div style={{ fontSize: "10px", color: "var(--text-secondary)" }}>
              {points} Points
            </div>
          </div>

          <div
            style={{
              background: "rgba(255, 255, 255, 0.04)",
              border: "1px solid var(--border-subtle)",
              borderRadius: "12px",
              padding: "12px",
              textAlign: "center"
            }}
          >
            <div style={{ fontSize: "11px", color: "var(--text-muted)", marginBottom: "4px" }}>
              Daily Streak
            </div>
            <div style={{ fontSize: "18px", fontWeight: "800", color: "#fbbf24" }}>
              🔥 {streak} Days
            </div>
            <div style={{ fontSize: "10px", color: "var(--text-secondary)" }}>
              +{Math.min(50, streak * 10)}% Cash Boost
            </div>
          </div>
        </div>

        {/* Member Info */}
        <div
          style={{
            background: "rgba(0, 0, 0, 0.25)",
            borderRadius: "10px",
            padding: "12px",
            fontSize: "12px",
            display: "flex",
            flexDirection: "column",
            gap: "6px",
            marginBottom: "16px"
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span style={{ color: "var(--text-muted)" }}>Member ID:</span>
            <span style={{ fontFamily: "monospace", color: "#38bdf8" }}>
              #KP-USR-{currentUser?.username?.toUpperCase() || "DEMO"}
            </span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span style={{ color: "var(--text-muted)" }}>Total Experience:</span>
            <span style={{ color: "#fff", fontWeight: "700" }}>{xp} XP</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span style={{ color: "var(--text-muted)" }}>Member Since:</span>
            <span style={{ color: "#fff" }}>{currentUser?.createdAt || "October 2026"}</span>
          </div>
        </div>

        {/* Logout / Switch Account Button */}
        <button
          type="button"
          onClick={() => {
            soundManager.playRecordBeep(false);
            onLogout();
            onClose();
          }}
          style={{
            width: "100%",
            background: "rgba(244, 63, 94, 0.12)",
            border: "1px solid rgba(244, 63, 94, 0.3)",
            color: "#fb7185",
            padding: "12px",
            borderRadius: "10px",
            fontSize: "13px",
            fontWeight: "700",
            cursor: "pointer",
            transition: "all 0.2s ease"
          }}
        >
          🚪 Sign Out / Switch Account
        </button>
      </div>
    </div>
  );
}
