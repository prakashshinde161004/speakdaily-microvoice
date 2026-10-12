import React from "react";

export default function StreakRoadmap({ currentStreak, hasStreakFreeze, onEquipFreeze }) {
  const days = [1, 2, 3, 4, 5, 6, 7];

  return (
    <div className="roadmap-container" id="streak-roadmap-card">
      <div className="roadmap-header">
        <div className="roadmap-title">
          <span>🔥</span>
          <span>7-Day Streak Journey (+15% to +50% Cash Boost)</span>
        </div>
        <div style={{ fontSize: "11px", color: "#f59e0b", fontWeight: 700 }}>
          Day {currentStreak} of 7
        </div>
      </div>

      <div className="streak-days-grid">
        {days.map((dayNum) => {
          const isDone = dayNum < currentStreak;
          const isCurrent = dayNum === currentStreak;
          const isGrandFinale = dayNum === 7;

          return (
            <div
              key={dayNum}
              className={`day-cell ${isDone ? "completed" : ""} ${isCurrent ? "current" : ""}`}
            >
              <div className="day-label">D{dayNum}</div>
              <div className="day-status-icon">
                {isDone ? "🔥" : isCurrent ? "⚡" : isGrandFinale ? "🎁" : "🔒"}
              </div>
              <div style={{ fontSize: "9px", color: isDone || isCurrent ? "#34d399" : "var(--text-muted)", marginTop: "2px" }}>
                {isGrandFinale ? "+100p" : `+${45 + dayNum * 5}p`}
              </div>
            </div>
          );
        })}
      </div>

      {/* Streak Protection / Freeze Info */}
      <div
        style={{
          marginTop: "12px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          background: "rgba(255, 255, 255, 0.03)",
          padding: "8px 12px",
          borderRadius: "8px",
          fontSize: "11px"
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <span>🛡️</span>
          <span>
            Streak Freeze: <strong>{hasStreakFreeze ? "Active (Shielded)" : "Not Equipped"}</strong>
          </span>
        </div>

        {!hasStreakFreeze && (
          <button
            type="button"
            onClick={onEquipFreeze}
            style={{
              background: "rgba(56, 189, 248, 0.15)",
              border: "1px solid rgba(56, 189, 248, 0.3)",
              color: "#38bdf8",
              fontSize: "10px",
              fontWeight: 700,
              padding: "3px 8px",
              borderRadius: "4px",
              cursor: "pointer"
            }}
          >
            Equip (Free)
          </button>
        )}
      </div>
    </div>
  );
}
