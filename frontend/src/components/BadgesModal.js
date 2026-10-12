import React from "react";
import { BADGES } from "../constants";

export default function BadgesModal({ isOpen, onClose, unlockedBadges }) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose} id="badges-modal-overlay">
      <div className="modal-sheet" onClick={(e) => e.stopPropagation()}>
        <div className="modal-handle-bar"></div>

        <div className="modal-header">
          <div className="modal-title">
            <span>🎖️</span>
            <span>Badges & Achievements</span>
          </div>
          <button className="modal-close-btn" onClick={onClose}>
            ✕
          </button>
        </div>

        <p style={{ fontSize: "12px", color: "var(--text-secondary)", marginBottom: "14px" }}>
          Collect badges by reading sentences accurately and staying consistent every day!
        </p>

        <div className="badges-grid">
          {BADGES.map((b) => {
            const isUnlocked = unlockedBadges.includes(b.id);

            return (
              <div
                key={b.id}
                className={`badge-card ${isUnlocked ? "unlocked" : "locked"}`}
              >
                <div className="badge-icon-lg">{b.icon}</div>
                <div className="badge-name">{b.name}</div>
                <div className="badge-desc">{b.description}</div>
                <div
                  style={{
                    fontSize: "10px",
                    fontWeight: "700",
                    marginTop: "4px",
                    color: isUnlocked ? "#34d399" : "var(--text-muted)"
                  }}
                >
                  {isUnlocked ? "✓ Unlocked" : `Req: ${b.requirement}`}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
