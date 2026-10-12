import React from "react";
import { soundManager } from "../soundEffects";

export default function Navbar({
  streak,
  points,
  currency,
  onOpenWallet,
  onOpenStreakModal,
  isMuted,
  onToggleMute,
  backendConnected,
  currentUser,
  onOpenAccountModal,
  onOpenAuthModal
}) {
  const cashAmount = (points * currency.rate).toFixed(2);

  return (
    <header className="top-navbar" id="main-header">
      <div className="brand-section">
        <div className="brand-logo-icon">🎙️</div>
        <div>
          <span className="brand-name">SpeakDaily</span>
          <span className="brand-badge">MicroVoice</span>
          {backendConnected && (
            <span
              style={{
                fontSize: "9px",
                color: "#38bdf8",
                background: "rgba(56, 189, 248, 0.15)",
                border: "1px solid rgba(56, 189, 248, 0.3)",
                padding: "1px 5px",
                borderRadius: "4px",
                marginLeft: "4px",
                fontWeight: 700
              }}
              title="Python FastAPI Backend Online"
            >

            </span>
          )}
        </div>
      </div>

      <div className="top-pills-row">
        {/* User Account / Login Button */}
        {currentUser ? (
          <button
            className="streak-pill"
            id="btn-user-profile"
            onClick={() => {
              soundManager.playCoin();
              onOpenAccountModal();
            }}
            style={{
              background: "rgba(99, 102, 241, 0.15)",
              borderColor: "rgba(99, 102, 241, 0.35)",
              color: "#c7d2fe"
            }}
            title="My Account"
          >
            <span>👤</span>
            <span>{currentUser.username}</span>
          </button>
        ) : (
          <button
            className="streak-pill"
            id="btn-auth-login"
            onClick={() => {
              soundManager.playRecordBeep(true);
              onOpenAuthModal();
            }}
            style={{
              background: "rgba(16, 185, 129, 0.15)",
              borderColor: "rgba(16, 185, 129, 0.35)",
              color: "#34d399"
            }}
            title="Log In or Register"
          >
            <span>🔑</span>
            <span>Sign In</span>
          </button>
        )}

        <button
          className="streak-pill"
          id="btn-streak-pill"
          onClick={() => {
            soundManager.playCoin();
            onOpenStreakModal();
          }}
          title="Daily Streak"
        >
          <span>🔥</span>
          <span>{streak}d</span>
        </button>

        <button
          className="wallet-pill"
          id="btn-wallet-pill"
          onClick={() => {
            soundManager.playCoin();
            onOpenWallet();
          }}
          title="Cash Balance"
        >
          <span>💰</span>
          <span>
            {currency.symbol}{cashAmount}
          </span>
        </button>

        <button
          className="sound-toggle-btn"
          id="btn-sound-toggle"
          onClick={onToggleMute}
          title={isMuted ? "Unmute Sounds" : "Mute Sounds"}
        >
          {isMuted ? "🔇" : "🔊"}
        </button>
      </div>
    </header>
  );
}
