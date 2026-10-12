import React, { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import ProgressCard from "./components/ProgressCard";
import DailyTaskCard from "./components/DailyTaskCard";
import AudioQCTask from "./components/AudioQCTask";
import StreakRoadmap from "./components/StreakRoadmap";
import AICoachChatbot from "./components/AICoachChatbot";
import WalletModal from "./components/WalletModal";
import LeaderboardModal from "./components/LeaderboardModal";
import BadgesModal from "./components/BadgesModal";
import AuthModal from "./components/AuthModal";
import AccountModal from "./components/AccountModal";
import BottomNav from "./components/BottomNav";
import { DAILY_TASKS, CURRENCIES, LEVELS } from "./constants";
import { soundManager } from "./soundEffects";
import { triggerConfetti } from "./confetti";
import { checkBackendHealth, syncUserProgressAPI } from "./apiService";

export default function App() {
  // Current Authenticated User state
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem("speakdaily_active_user");
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return {
      username: "prakash",
      fullName: "Prakash Kumar",
      country: "🇮🇳 India",
      createdAt: "2026-10-01"
    };
  });

  // Persistent user state with fallback defaults
  const [streak, setStreak] = useState(() => {
    const saved = localStorage.getItem("speakdaily_streak");
    return saved !== null ? parseInt(saved, 10) : 5;
  });

  const [points, setPoints] = useState(() => {
    const saved = localStorage.getItem("speakdaily_points");
    return saved !== null ? parseInt(saved, 10) : 380;
  });

  const [xp, setXp] = useState(() => {
    const saved = localStorage.getItem("speakdaily_xp");
    return saved !== null ? parseInt(saved, 10) : 210;
  });

  const [currency, setCurrency] = useState(CURRENCIES.INR);
  const [hasStreakFreeze, setHasStreakFreeze] = useState(true);
  const [activeTab, setActiveTab] = useState("tasks"); // 'tasks' | 'ai' | 'ranks' | 'wallet'
  const [taskCompletedToday, setTaskCompletedToday] = useState(false);
  const [currentTaskIndex, setCurrentTaskIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [backendConnected, setBackendConnected] = useState(false);

  // Modals
  const [isWalletOpen, setIsWalletOpen] = useState(false);
  const [isLeaderboardOpen, setIsLeaderboardOpen] = useState(false);
  const [isBadgesOpen, setIsBadgesOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isAccountOpen, setIsAccountOpen] = useState(false);

  const [unlockedBadges, setUnlockedBadges] = useState([
    "first_voice",
    "streak_3",
    "clarity_master"
  ]);

  const [transactions, setTransactions] = useState([
    { id: "tx-1", title: "Day 3 Speaking Task", points: 65, type: "earn", date: "Yesterday, 6:30 PM" },
    { id: "tx-2", title: "Audio QC Verification", points: 20, type: "earn", date: "Yesterday, 6:32 PM" },
    { id: "tx-3", title: "Day 4 Speaking Task", points: 70, type: "earn", date: "Today, 9:15 AM" }
  ]);

  // Check Python Backend Health on Mount
  useEffect(() => {
    checkBackendHealth().then((res) => {
      setBackendConnected(res.connected);
    });
  }, []);

  // Sync state to localStorage & Python Backend
  useEffect(() => {
    localStorage.setItem("speakdaily_streak", streak);
    localStorage.setItem("speakdaily_points", points);
    localStorage.setItem("speakdaily_xp", xp);

    if (currentUser?.username) {
      syncUserProgressAPI(currentUser.username, {
        points,
        streak,
        xp,
        unlockedBadges,
        transactions
      });
    }
  }, [streak, points, xp, unlockedBadges, transactions, currentUser]);

  // Handle Authentication Success (Login or Register)
  const handleAuthSuccess = (userData) => {
    setCurrentUser(userData);
    localStorage.setItem("speakdaily_active_user", JSON.stringify(userData));

    if (userData.points !== undefined) setPoints(userData.points);
    if (userData.streak !== undefined) setStreak(userData.streak);
    if (userData.xp !== undefined) setXp(userData.xp);
    if (userData.unlockedBadges) setUnlockedBadges(userData.unlockedBadges);
    if (userData.transactions) setTransactions(userData.transactions);
  };

  // Handle Logout
  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem("speakdaily_active_user");
    // Reset to initial visitor state
    setPoints(50);
    setStreak(1);
    setXp(50);
  };

  // Determine current multiplier based on level
  let currentLevel = LEVELS[0];
  for (let i = LEVELS.length - 1; i >= 0; i--) {
    if (xp >= LEVELS[i].minXp) {
      currentLevel = LEVELS[i];
      break;
    }
  }

  // Handle task completion
  const handleTaskCompleted = (earnedPts, clarityScore) => {
    const newPoints = points + earnedPts;
    const newXp = xp + Math.round(earnedPts * 0.8);
    setPoints(newPoints);
    setXp(newXp);
    setTaskCompletedToday(true);

    if (!taskCompletedToday) {
      setStreak((prev) => prev + 1);
    }

    if (clarityScore >= 90 && !unlockedBadges.includes("clarity_master")) {
      setUnlockedBadges((prev) => [...prev, "clarity_master"]);
    }
    if (streak + 1 >= 7 && !unlockedBadges.includes("streak_7")) {
      setUnlockedBadges((prev) => [...prev, "streak_7"]);
    }

    const newTx = {
      id: `tx-${Date.now()}`,
      title: `Daily Speech: "${DAILY_TASKS[currentTaskIndex].sentence.substring(0, 22)}..."`,
      points: earnedPts,
      type: "earn",
      date: "Just now"
    };
    setTransactions((prev) => [newTx, ...prev]);
  };

  // Handle bonus QC reward
  const handleQCReward = (earnedPts, title) => {
    setPoints((prev) => prev + earnedPts);
    setXp((prev) => prev + 15);

    if (!unlockedBadges.includes("qc_master")) {
      setUnlockedBadges((prev) => [...prev, "qc_master"]);
    }

    const newTx = {
      id: `tx-${Date.now()}`,
      title: title || "QC Audio Verification",
      points: earnedPts,
      type: "earn",
      date: "Just now"
    };
    setTransactions((prev) => [newTx, ...prev]);
  };

  // Handle Cashout Execution
  const handlePerformCashout = (deductedPts, receipt) => {
    setPoints((prev) => Math.max(0, prev - deductedPts));
    if (!unlockedBadges.includes("cashout_ready")) {
      setUnlockedBadges((prev) => [...prev, "cashout_ready"]);
    }

    const newTx = {
      id: receipt.txId,
      title: `Cashout via ${receipt.method}`,
      points: deductedPts,
      type: "cashout",
      date: receipt.date
    };
    setTransactions((prev) => [newTx, ...prev]);
  };

  const handleToggleMute = () => {
    const muted = soundManager.toggleMute();
    setIsMuted(muted);
  };

  const handleEquipFreeze = () => {
    setHasStreakFreeze(true);
    soundManager.playSuccess();
    triggerConfetti();
  };

  const activeTask = DAILY_TASKS[currentTaskIndex];

  return (
    <div className="app-container">
      <div className="mobile-frame">
        {/* Top Sticky Navigation */}
        <Navbar
          streak={streak}
          points={points}
          currency={currency}
          onOpenWallet={() => setIsWalletOpen(true)}
          onOpenStreakModal={() => setActiveTab("tasks")}
          isMuted={isMuted}
          onToggleMute={handleToggleMute}
          backendConnected={backendConnected}
          currentUser={currentUser}
          onOpenAccountModal={() => setIsAccountOpen(true)}
          onOpenAuthModal={() => setIsAuthOpen(true)}
        />

        {/* Tab 1: Daily Tasks (Core Micro-Task Flow) */}
        {activeTab === "tasks" && (
          <main className="main-content" id="tasks-view">
            {/* Level & XP Progress Banner */}
            <ProgressCard
              xp={xp}
              currentStreak={streak}
              taskCompletedToday={taskCompletedToday}
            />

            {/* 7-Day Retention Roadmap */}
            <StreakRoadmap
              currentStreak={streak}
              hasStreakFreeze={hasStreakFreeze}
              onEquipFreeze={handleEquipFreeze}
            />

            {/* Main Daily Voice Recording Micro-Task */}
            <DailyTaskCard
              task={activeTask}
              userMultiplier={currentLevel.multiplier}
              streak={streak}
              currency={currency}
              onTaskCompleted={handleTaskCompleted}
              isCompletedToday={taskCompletedToday}
            />

            {/* Next Prompt Selector (Quick cycle for evaluation) */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "4px 8px"
              }}
            >
              <span style={{ fontSize: "11px", color: "var(--text-muted)" }}>
                Task {currentTaskIndex + 1} of {DAILY_TASKS.length}
              </span>
              <button
                type="button"
                onClick={() => {
                  soundManager.playRecordBeep(true);
                  setCurrentTaskIndex((prev) => (prev + 1) % DAILY_TASKS.length);
                }}
                style={{
                  background: "rgba(255, 255, 255, 0.05)",
                  border: "1px solid var(--border-subtle)",
                  color: "#38bdf8",
                  padding: "5px 12px",
                  borderRadius: "6px",
                  fontSize: "11px",
                  cursor: "pointer",
                  fontWeight: 600
                }}
              >
                Next Daily Prompt ➔
              </button>
            </div>

            {/* Secondary Micro-Task: Audio QC Verification */}
            <AudioQCTask
              onReward={handleQCReward}
              currency={currency}
            />

            {/* Quick Aria LLM Preview Card */}
            <div
              style={{
                background: "linear-gradient(135deg, rgba(99, 102, 241, 0.12) 0%, rgba(168, 85, 247, 0.12) 100%)",
                border: "1px solid rgba(99, 102, 241, 0.3)",
                borderRadius: "14px",
                padding: "14px 16px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                cursor: "pointer"
              }}
              onClick={() => setActiveTab("ai")}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <span style={{ fontSize: "24px" }}>🤖</span>
                <div>
                  <div style={{ fontSize: "13px", fontWeight: "700", color: "#fff" }}>
                    Need Pronunciation Help?
                  </div>
                  <div style={{ fontSize: "11px", color: "#c7d2fe" }}>
                    Chat with Aria, your AI speech coach {backendConnected ? "(FastAPI Active)" : ""}
                  </div>
                </div>
              </div>
              <span style={{ fontSize: "16px", color: "#a5b4fc" }}>➔</span>
            </div>
          </main>
        )}

        {/* Tab 2: Aria LLM AI Coach Chatbot */}
        {activeTab === "ai" && (
          <main className="main-content" id="ai-chat-view">
            <AICoachChatbot
              userName={currentUser?.fullName || "Prakash"}
              currentStreak={streak}
              points={points}
              currency={currency}
              activeTask={activeTask}
            />
          </main>
        )}

        {/* Tab 3: Ranks (Leaderboard & Badges) */}
        {activeTab === "ranks" && (
          <main className="main-content" id="ranks-view">
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "12px" }}>
              <button
                type="button"
                onClick={() => setIsLeaderboardOpen(true)}
                style={{
                  background: "rgba(245, 158, 11, 0.15)",
                  border: "1px solid rgba(245, 158, 11, 0.35)",
                  padding: "12px",
                  borderRadius: "12px",
                  color: "#fbbf24",
                  fontWeight: "700",
                  fontSize: "13px",
                  cursor: "pointer"
                }}
              >
                🏆 View Leaderboard
              </button>
              <button
                type="button"
                onClick={() => setIsBadgesOpen(true)}
                style={{
                  background: "rgba(99, 102, 241, 0.15)",
                  border: "1px solid rgba(99, 102, 241, 0.35)",
                  padding: "12px",
                  borderRadius: "12px",
                  color: "#a5b4fc",
                  fontWeight: "700",
                  fontSize: "13px",
                  cursor: "pointer"
                }}
              >
                🎖️ View Badges ({unlockedBadges.length}/6)
              </button>
            </div>

            {/* Embedded Leaderboard */}
            <div className="task-card" style={{ padding: "16px" }}>
              <div style={{ fontSize: "14px", fontWeight: "800", color: "#fff", marginBottom: "12px" }}>
                🌟 Top Community Earners
              </div>
              <div className="leaderboard-list">
                {[
                  { rank: 1, name: "Priya S.", country: "🇮🇳", points: 1420, streak: 14, avatar: "👩🏽" },
                  { rank: 2, name: "Mateo R.", country: "🇵🇭", points: 1290, streak: 11, avatar: "👨🏻" },
                  { rank: 3, name: `${currentUser?.fullName || "Prakash"} (You)`, country: currentUser?.country?.split(" ")[0] || "🇮🇳", points: points, streak: streak, avatar: "⭐", isUser: true },
                  { rank: 4, name: "Budi W.", country: "🇮🇩", points: 1150, streak: 9, avatar: "👨🏽" }
                ].map((item) => (
                  <div
                    key={item.name}
                    className={`leaderboard-row ${item.isUser ? "user-row" : ""}`}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <div className={`rank-badge top-${item.rank}`}>{item.rank}</div>
                      <div>
                        <div style={{ fontSize: "13px", fontWeight: "700", color: "#fff" }}>
                          {item.name} {item.country}
                        </div>
                        <div style={{ fontSize: "11px", color: "#f59e0b" }}>
                          🔥 {item.streak}d streak
                        </div>
                      </div>
                    </div>
                    <div style={{ fontWeight: "800", color: "#34d399", fontSize: "13px" }}>
                      {item.points} PTS
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </main>
        )}

        {/* Tab 4: Wallet & Payout Details */}
        {activeTab === "wallet" && (
          <main className="main-content" id="wallet-view">
            <div className="wallet-balance-hero">
              <div className="wallet-hero-label">Available Earnings</div>
              <div className="wallet-hero-amount">
                {currency.symbol}{(points * currency.rate).toFixed(2)}
              </div>
              <div className="wallet-points-equivalent">
                🪙 {points} PTS Balance (100 PTS = {currency.symbol}{(100 * currency.rate).toFixed(2)})
              </div>
            </div>

            <button
              type="button"
              className="cashout-action-btn"
              onClick={() => setIsWalletOpen(true)}
            >
              💸 Open Cashout & Payout Simulator
            </button>

            {/* Transaction Ledger */}
            <div style={{ marginTop: "16px" }}>
              <div style={{ fontSize: "13px", fontWeight: "700", color: "#fff", marginBottom: "8px" }}>
                Recent Activity & Earnings Ledger
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                {transactions.map((tx) => (
                  <div
                    key={tx.id}
                    style={{
                      background: "rgba(255, 255, 255, 0.03)",
                      border: "1px solid var(--border-subtle)",
                      borderRadius: "8px",
                      padding: "8px 10px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      fontSize: "11px"
                    }}
                  >
                    <div>
                      <div style={{ color: "#fff", fontWeight: "600" }}>{tx.title}</div>
                      <div style={{ color: "var(--text-muted)" }}>{tx.date}</div>
                    </div>
                    <div
                      style={{
                        fontWeight: "700",
                        color: tx.type === "earn" ? "#34d399" : "#38bdf8"
                      }}
                    >
                      {tx.type === "earn" ? `+${tx.points} PTS` : `-${tx.points} PTS (Paid)`}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </main>
        )}

        {/* Bottom Tab Bar */}
        <BottomNav activeTab={activeTab} onSelectTab={setActiveTab} />

        {/* Modals */}
        <AuthModal
          isOpen={isAuthOpen}
          onClose={() => setIsAuthOpen(false)}
          onAuthSuccess={handleAuthSuccess}
        />

        <AccountModal
          isOpen={isAccountOpen}
          onClose={() => setIsAccountOpen(false)}
          currentUser={currentUser}
          points={points}
          streak={streak}
          xp={xp}
          currency={currency}
          onLogout={handleLogout}
        />

        <WalletModal
          isOpen={isWalletOpen}
          onClose={() => setIsWalletOpen(false)}
          points={points}
          currency={currency}
          onCurrencyChange={setCurrency}
          onPerformCashout={handlePerformCashout}
          transactions={transactions}
        />

        <LeaderboardModal
          isOpen={isLeaderboardOpen}
          onClose={() => setIsLeaderboardOpen(false)}
          userPoints={points}
          userStreak={streak}
          userName={currentUser?.fullName || "Prakash"}
        />

        <BadgesModal
          isOpen={isBadgesOpen}
          onClose={() => setIsBadgesOpen(false)}
          unlockedBadges={unlockedBadges}
        />
      </div>
    </div>
  );
}
