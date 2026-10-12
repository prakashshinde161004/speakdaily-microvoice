import React, { useState, useEffect, useRef } from "react";
import { speechService } from "../speechService";
import { soundManager } from "../soundEffects";
import { triggerConfetti } from "../confetti";
import { analyzeSpeechAPI } from "../apiService";

export default function DailyTaskCard({
  task,
  userMultiplier,
  streak,
  currency,
  onTaskCompleted,
  isCompletedToday
}) {
  const [isPlayingModel, setIsPlayingModel] = useState(false);
  const [speechSpeed, setSpeechSpeed] = useState(1.0);
  const [selectedLang, setSelectedLang] = useState("en");
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [liveVolume, setLiveVolume] = useState(0);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [userAudioUrl, setUserAudioUrl] = useState(null);
  const [usedBackend, setUsedBackend] = useState(false);
  const timerRef = useRef(null);

  // Play Native Model Speech
  const handleListenModel = () => {
    if (isPlayingModel) {
      speechService.stopSpeaking();
      setIsPlayingModel(false);
      return;
    }

    setIsPlayingModel(true);
    soundManager.playCoin();
    speechService.speakSentence(task.sentence, speechSpeed, () => {
      setIsPlayingModel(false);
    });
  };

  // Toggle Recording
  const handleToggleRecord = async () => {
    if (isRecording) {
      // Stop recording
      clearInterval(timerRef.current);
      soundManager.playRecordBeep(false);
      setIsRecording(false);
      setIsAnalyzing(true);

      const recordOutput = await speechService.stopRecording();
      if (recordOutput.audioUrl) {
        setUserAudioUrl(recordOutput.audioUrl);
      }

      // Try Python FastAPI Backend First
      const backendRes = await analyzeSpeechAPI(
        task.sentence,
        recordOutput.rawTranscript,
        Math.max(1, recordingSeconds),
        streak,
        userMultiplier
      );

      let finalAnalysis = null;

      if (backendRes) {
        setUsedBackend(true);
        const earnedCash = (backendRes.earnedPts * currency.rate).toFixed(2);
        finalAnalysis = {
          ...backendRes,
          earnedCash
        };
      } else {
        // Fallback to client-side heuristics
        setUsedBackend(false);
        const clientAnalysis = speechService.analyzePronunciation(
          task.sentence,
          recordOutput.rawTranscript
        );
        const streakBonusMultiplier = 1 + Math.min(0.5, streak * 0.05);
        const totalMultiplier = userMultiplier * streakBonusMultiplier;
        const earnedPts = Math.round(task.basePoints * totalMultiplier);

        finalAnalysis = {
          ...clientAnalysis,
          earnedPts,
          earnedCash: (earnedPts * currency.rate).toFixed(2)
        };
      }

      setAnalysisResult(finalAnalysis);
      setIsAnalyzing(false);
      soundManager.playSuccess();
      triggerConfetti();

      onTaskCompleted(finalAnalysis.earnedPts, finalAnalysis.overallClarity);
    } else {
      // Start recording
      soundManager.playRecordBeep(true);
      setRecordingSeconds(0);
      setAnalysisResult(null);
      setUserAudioUrl(null);
      setIsRecording(true);

      await speechService.startRecording((volume) => {
        setLiveVolume(volume);
      });

      timerRef.current = setInterval(() => {
        setRecordingSeconds((prev) => {
          if (prev >= task.timeLimitSeconds) {
            handleToggleRecord();
            return prev;
          }
          return prev + 1;
        });
      }, 1000);
    }
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      speechService.stopSpeaking();
    };
  }, []);

  const estimatedCash = (task.basePoints * userMultiplier * currency.rate).toFixed(2);
  const currentTranslation = task.translations[selectedLang] || task.translations.en || task.translations.hi;

  return (
    <div className="task-card" id={`task-card-${task.id}`}>
      {/* Header Row */}
      <div className="task-header-row">
        <div className="task-category-pill">
          <span>🎯</span>
          <span>{task.category}</span>
        </div>
        <div className="task-reward-estimate">
          <span>+{task.basePoints} PTS</span>
          <span>(~{currency.symbol}{estimatedCash})</span>
        </div>
      </div>

      {/* Target Sentence Display */}
      <div className="sentence-container">
        <div className="sentence-label">Daily Prompt to Read Aloud</div>
        <div className="target-sentence">"{task.sentence}"</div>
        <div className="phonetic-guide">🗣️ {task.phonetic}</div>

        {/* ESL Translation Helper */}
        <div className="translation-box">
          <div>
            <span style={{ fontWeight: 700 }}>ESL Meaning: </span>
            {currentTranslation}
          </div>
          <select
            className="lang-selector-select"
            value={selectedLang}
            onChange={(e) => setSelectedLang(e.target.value)}
            id="task-lang-selector"
          >
            <option value="en">🇬🇧 English</option>
            <option value="hi">🇮🇳 Hindi</option>
            <option value="es">🇪🇸 Spanish</option>
            <option value="tl">🇵🇭 Tagalog</option>
            <option value="id">🇮🇩 Bahasa</option>
            <option value="sw">🇰🇪 Swahili</option>
          </select>
        </div>
      </div>

      {/* Audio Model Controls */}
      <div className="audio-controls-row">
        <button
          className="listen-btn"
          id="btn-listen-native-model"
          onClick={handleListenModel}
          type="button"
        >
          <span>{isPlayingModel ? "⏹️ Stop" : "🔊 Listen Native Voice"}</span>
        </button>

        <div style={{ display: "flex", gap: "4px" }}>
          <button
            type="button"
            className={`speed-badge ${speechSpeed === 1.0 ? "active" : ""}`}
            onClick={() => setSpeechSpeed(1.0)}
          >
            1.0x
          </button>
          <button
            type="button"
            className={`speed-badge ${speechSpeed === 0.8 ? "active" : ""}`}
            onClick={() => setSpeechSpeed(0.8)}
            title="Slower speed for ESL comprehension"
          >
            0.8x Slow
          </button>
        </div>
      </div>

      {/* Recording Interaction Section */}
      <div className="mic-section">
        <div className="mic-button-wrapper">
          {isRecording && <div className="mic-ripple"></div>}
          <button
            className={`mic-button ${isRecording ? "recording" : ""}`}
            id="btn-record-voice"
            onClick={handleToggleRecord}
            type="button"
            aria-label={isRecording ? "Stop Recording" : "Start Recording"}
          >
            {isRecording ? "⏹️" : "🎙️"}
          </button>
        </div>

        {/* Live Audio Waveform Bars */}
        <div className="live-waveform" aria-hidden="true">
          {[20, 45, 75, 95, 60, 40, 25].map((baseHeight, i) => {
            const dynamicHeight = isRecording
              ? Math.max(8, Math.min(36, (baseHeight * (liveVolume || 40)) / 75))
              : 6;
            return (
              <div
                key={i}
                className="wave-bar"
                style={{ height: `${dynamicHeight}px` }}
              ></div>
            );
          })}
        </div>

        <div className={`mic-status-text ${isRecording ? "recording-active" : ""}`}>
          {isRecording ? (
            <>
              <span style={{ display: "inline-block", width: "8px", height: "8px", borderRadius: "50%", background: "#ef4444" }}></span>
              Recording... 0:{recordingSeconds < 10 ? `0${recordingSeconds}` : recordingSeconds} / 0:{task.timeLimitSeconds}s (Tap to Finish)
            </>
          ) : isAnalyzing ? (
            "🤖 AI Pronunciation Engine (FastAPI) is Analyzing..."
          ) : isCompletedToday ? (
            "✅ Today's Task Completed! You can practice again anytime."
          ) : (
            "Tap the Mic to Read & Earn"
          )}
        </div>
      </div>

      {/* AI Pronunciation Result Feedback */}
      {analysisResult && (
        <div className="result-container" id="ai-result-feedback">
          <div className="result-header">
            <div className="result-score-badge">
              <div className="score-circle">{analysisResult.overallClarity}%</div>
              <div>
                <div className="score-text-title">
                  Pronunciation Clarity {usedBackend && <span style={{ fontSize: "10px", color: "#38bdf8", fontWeight: "600" }}>(Python FastAPI)</span>}
                </div>
                <div className="score-subtext">AI Acoustic Model Verified</div>
              </div>
            </div>
            {userAudioUrl && (
              <audio
                controls
                src={userAudioUrl}
                style={{ height: "30px", maxWidth: "140px" }}
              />
            )}
          </div>

          <p style={{ fontSize: "12px", color: "var(--text-secondary)", marginBottom: "8px" }}>
            {analysisResult.feedback}
          </p>

          {/* Word Accuracy Breakdown */}
          <div className="words-evaluation-list">
            {analysisResult.wordResults.map((w, idx) => (
              <div
                key={idx}
                className={`evaluated-word-pill ${w.status}`}
                title={w.tip || `Clarity: ${w.clarityScore}%`}
              >
                <span>{w.status === "perfect" ? "✓" : w.status === "good" ? "•" : "~"}</span>
                <span>{w.word}</span>
              </div>
            ))}
          </div>

          {/* Reward Credited Banner */}
          <div className="reward-credited-banner">
            <div className="reward-credited-left">
              <span>🎉</span>
              <span>Reward Credited:</span>
            </div>
            <div className="reward-amount-highlight">
              +{analysisResult.earnedPts} PTS (+{currency.symbol}{analysisResult.earnedCash})
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
