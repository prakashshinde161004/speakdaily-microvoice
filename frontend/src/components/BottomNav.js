import React from "react";
import { soundManager } from "../soundEffects";

export default function BottomNav({ activeTab, onSelectTab }) {
  const tabs = [
    { id: "tasks", label: "Daily Tasks", icon: "🎙️" },
    { id: "ai", label: "Aria AI", icon: "🤖" },
    { id: "ranks", label: "Ranks", icon: "🏆" },
    { id: "wallet", label: "Wallet", icon: "💳" }
  ];

  return (
    <nav className="bottom-nav" id="mobile-bottom-nav">
      {tabs.map((t) => {
        const isActive = activeTab === t.id;
        return (
          <button
            key={t.id}
            id={`nav-btn-${t.id}`}
            type="button"
            className={`nav-tab-btn ${isActive ? "active" : ""}`}
            onClick={() => {
              soundManager.playCoin();
              onSelectTab(t.id);
            }}
          >
            <span className="nav-tab-icon">{t.icon}</span>
            <span>{t.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
