import React, { useState } from "react";
import { QC_MICRO_TASKS } from "../constants";
import { soundManager } from "../soundEffects";
import { speechService } from "../speechService";

export default function AudioQCTask({ onReward, currency }) {
  const [currentTaskIndex, setCurrentTaskIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [qcStatus, setQcStatus] = useState(null); // 'correct' | 'wrong' | null

  const task = QC_MICRO_TASKS[currentTaskIndex];

  const handlePlayClip = () => {
    setIsPlaying(true);
    soundManager.playRecordBeep(true);
    // Speak simulated audio clip with slightly distorted rate or text
    speechService.speakSentence(task.spokenTextSimulation, 1.0, () => {
      setIsPlaying(false);
    });
  };

  const handleAnswer = (answer) => {
    if (answer === task.correctAnswer) {
      setQcStatus("correct");
      soundManager.playSuccess();
      const cash = (task.rewardPoints * currency.rate).toFixed(2);
      onReward(task.rewardPoints, `Verified ${task.speakerName}`);
      setTimeout(() => {
        // Switch to next task or reset
        setCurrentTaskIndex((prev) => (prev + 1) % QC_MICRO_TASKS.length);
        setQcStatus(null);
      }, 1600);
    } else {
      setQcStatus("wrong");
      soundManager.playRecordBeep(false);
      setTimeout(() => setQcStatus(null), 1500);
    }
  };

  return (
    <div className="qc-card" id="audio-qc-task-card">
      <div className="qc-card-header">
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <span className="qc-badge">⚡ BONUS MICRO-TASK</span>
          <span style={{ fontSize: "11px", color: "var(--text-muted)" }}>Audio QC</span>
        </div>
        <div className="qc-reward-badge">
          +{task.rewardPoints} PTS (+{currency.symbol}{(task.rewardPoints * currency.rate).toFixed(2)})
        </div>
      </div>

      <p style={{ fontSize: "12px", color: "var(--text-secondary)", marginBottom: "8px" }}>
        <strong>Task:</strong> Verify speaker sample for background clarity.
      </p>

      <div className="qc-snippet-box">
        <div>
          <div style={{ fontSize: "11px", color: "var(--text-muted)" }}>{task.speakerName}</div>
          <div style={{ fontStyle: "italic", fontSize: "12px", color: "#fff" }}>
            "{task.targetText}"
          </div>
        </div>

        <button
          type="button"
          onClick={handlePlayClip}
          style={{
            background: "rgba(99, 102, 241, 0.2)",
            border: "1px solid rgba(99, 102, 241, 0.4)",
            color: "#c7d2fe",
            padding: "6px 12px",
            borderRadius: "8px",
            cursor: "pointer",
            fontSize: "12px",
            fontWeight: 600
          }}
        >
          {isPlaying ? "▶️ Playing..." : "🔊 Play Clip"}
        </button>
      </div>

      <div style={{ fontSize: "12px", color: "#e2e8f0", marginBottom: "8px" }}>
        ❓ {task.question}
      </div>

      <div className="qc-btn-group">
        <button
          type="button"
          className="qc-choice-btn yes"
          onClick={() => handleAnswer("yes")}
          disabled={qcStatus !== null}
        >
          ✓ Yes, Clear
        </button>
        <button
          type="button"
          className="qc-choice-btn no"
          onClick={() => handleAnswer("no")}
          disabled={qcStatus !== null}
        >
          ✕ No, Unclear / Noisy
        </button>
      </div>

      {qcStatus === "correct" && (
        <div
          style={{
            marginTop: "10px",
            padding: "8px",
            background: "rgba(16, 185, 129, 0.2)",
            color: "#34d399",
            borderRadius: "6px",
            fontSize: "12px",
            textAlign: "center",
            fontWeight: 700
          }}
        >
          ✓ Correct QC Verification! +{task.rewardPoints} PTS credited to wallet!
        </div>
      )}

      {qcStatus === "wrong" && (
        <div
          style={{
            marginTop: "10px",
            padding: "8px",
            background: "rgba(244, 63, 94, 0.2)",
            color: "#fb7185",
            borderRadius: "6px",
            fontSize: "12px",
            textAlign: "center",
            fontWeight: 700
          }}
        >
          Listen closely to the audio quality and try again!
        </div>
      )}
    </div>
  );
}
