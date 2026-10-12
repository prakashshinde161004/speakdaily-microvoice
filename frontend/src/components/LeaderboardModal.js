import React, { useState } from "react";
import { MOCK_LEADERBOARD } from "../constants";

export default function LeaderboardModal({ isOpen, onClose, userPoints, userStreak, userName }) {
  const [tab, setTab] = useState("daily");

  if (!isOpen) return null;

  // Combine mock leaderboard with the actual active user
  const combinedList = [
    ...MOCK_LEADERBOARD,
    {
      rank: 4,
      name: `${userName} (You)`,
      country: "🇮🇳",
      points: userPoints,
      streak: userStreak,
      avatar: "⭐",
      isUser: true
    }
  ].sort((a, b) => b.points - a.points).map((item, idx) => ({ ...item, rank: idx + 1 }));

  return (
    <div className="modal-overlay" onClick={onClose} id="leaderboard-modal-overlay">
      <div className="modal-sheet" onClick={(e) => e.stopPropagation()}>
        <div className="modal-handle-bar"></div>

        <div className="modal-header">
          <div className="modal-title">
            <span>🏆</span>
            <span>Global Earners Leaderboard</span>
          </div>
          <button className="modal-close-btn" onClick={onClose}>
            ✕
          </button>
        </div>

        {/* Tab switcher */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "6px",
            background: "rgba(255, 255, 255, 0.05)",
            padding: "4px",
            borderRadius: "10px",
            marginBottom: "14px"
          }}
        >
          <button
            type="button"
            onClick={() => setTab("daily")}
            style={{
              background: tab === "daily" ? "#6366f1" : "transparent",
              color: "#fff",
              border: "none",
              borderRadius: "8px",
              padding: "6px",
              fontSize: "12px",
              fontWeight: 700,
              cursor: "pointer"
            }}
          >
            Today's Challengers
          </button>
          <button
            type="button"
            onClick={() => setTab("weekly")}
            style={{
              background: tab === "weekly" ? "#6366f1" : "transparent",
              color: "#fff",
              border: "none",
              borderRadius: "8px",
              padding: "6px",
              fontSize: "12px",
              fontWeight: 700,
              cursor: "pointer"
            }}
          >
            Weekly Champions
          </button>
        </div>

        <p style={{ fontSize: "11px", color: "var(--text-secondary)", marginBottom: "12px" }}>
          Top 3 earners every Sunday win a <strong>+250 PTS Cash Bonus pool</strong>!
        </p>

        {/* List of ranks */}
        <div className="leaderboard-list">
          {combinedList.map((item) => {
            const isTop1 = item.rank === 1;
            const isTop2 = item.rank === 2;
            const isTop3 = item.rank === 3;

            return (
              <div
                key={item.name}
                className={`leaderboard-row ${item.isUser ? "user-row" : ""}`}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <div
                    className={`rank-badge ${
                      isTop1 ? "top-1" : isTop2 ? "top-2" : isTop3 ? "top-3" : ""
                    }`}
                  >
                    {item.rank}
                  </div>
                  <div style={{ fontSize: "18px" }}>{item.avatar}</div>
                  <div>
                    <div style={{ fontSize: "13px", fontWeight: "700", color: "#fff" }}>
                      {item.name} <span style={{ fontSize: "12px" }}>{item.country}</span>
                    </div>
                    <div style={{ fontSize: "11px", color: "#f59e0b" }}>
                      🔥 {item.streak} Day Streak
                    </div>
                  </div>
                </div>

                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: "14px", fontWeight: "800", color: "#34d399" }}>
                    {item.points} PTS
                  </div>
                  <div style={{ fontSize: "10px", color: "var(--text-muted)" }}>
                    Verified Voice
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
