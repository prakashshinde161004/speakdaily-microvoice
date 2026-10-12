import React from "react";
import { LEVELS } from "../constants";

export default function ProgressCard({ xp, currentStreak, taskCompletedToday }) {
  // Determine current level
  let currentLevel = LEVELS[0];
  let nextLevel = LEVELS[1];

  for (let i = LEVELS.length - 1; i >= 0; i--) {
    if (xp >= LEVELS[i].minXp) {
      currentLevel = LEVELS[i];
      nextLevel = LEVELS[i + 1] || null;
      break;
    }
  }

  const currentLevelMin = currentLevel.minXp;
  const nextLevelMin = nextLevel ? nextLevel.minXp : currentLevelMin + 200;
  const progressPercent = Math.min(
    100,
    Math.round(((xp - currentLevelMin) / (nextLevelMin - currentLevelMin)) * 100)
  );

  return (
    <div className="progress-card" id="user-progress-card">
      <div className="level-info">
        <div className="level-icon-badge">{currentLevel.icon}</div>
        <div className="level-title-group">
          <h3>
            Level {currentLevel.level}: {currentLevel.title}
            <span className="multiplier-tag">{currentLevel.multiplier}x Cash</span>
          </h3>
          <div className="level-xp-bar-container" title={`${xp} XP`}>
            <div
              className="level-xp-fill"
              style={{ width: `${progressPercent}%` }}
            ></div>
          </div>
        </div>
      </div>

      <div style={{ textAlign: "right" }}>
        <span
          style={{
            fontSize: "11px",
            fontWeight: "700",
            color: taskCompletedToday ? "#34d399" : "#fbbf24",
            display: "inline-flex",
            alignItems: "center",
            gap: "4px"
          }}
        >
          {taskCompletedToday ? "✓ Daily Goal Done" : "⏳ 1 Daily Task Due"}
        </span>
        <div style={{ fontSize: "10px", color: "var(--text-muted)", marginTop: "2px" }}>
          {nextLevel ? `${nextLevelMin - xp} XP to Level ${nextLevel.level}` : "Max Level Reached"}
        </div>
      </div>
    </div>
  );
}
