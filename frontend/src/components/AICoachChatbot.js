import React, { useState, useRef, useEffect } from "react";
import { ARIA_KNOWLEDGE } from "../constants";
import { speechService } from "../speechService";
import { soundManager } from "../soundEffects";
import { chatWithAriaAPI } from "../apiService";

export default function AICoachChatbot({
  userName = "Prakash",
  currentStreak,
  points,
  currency,
  activeTask
}) {
  const [messages, setMessages] = useState([
    {
      id: "m-0",
      sender: "aria",
      text: `Hello ${userName}! 👋 I am Aria, your AI Pronunciation Coach and Earnings Assistant (powered by Python FastAPI). How can I help you improve your speech or maximize your daily rewards today?`,
      timestamp: "Just now"
    }
  ]);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [speakingMessageId, setSpeakingMessageId] = useState(null);
  const [quickQuestions, setQuickQuestions] = useState([
    "💡 Pronunciation tips for ESL",
    "💰 How do streaks boost cash?",
    "📖 Explain today's sentence",
    "💳 How does cashout work?",
    "🎯 Practice a quick sentence"
  ]);
  const chatBottomRef = useRef(null);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const handleSpeakResponse = (messageId, text) => {
    if (speakingMessageId === messageId) {
      speechService.stopSpeaking();
      setSpeakingMessageId(null);
      return;
    }

    setSpeakingMessageId(messageId);
    soundManager.playCoin();
    speechService.speakSentence(text, 1.0, () => {
      setSpeakingMessageId(null);
    });
  };

  const generateLocalAriaResponse = (userPrompt) => {
    const lower = userPrompt.toLowerCase();
    for (const item of ARIA_KNOWLEDGE) {
      if (item.triggers.some((t) => lower.includes(t))) {
        return item.reply;
      }
    }
    if (lower.includes("streak")) {
      return `You are currently on a ${currentStreak}-Day Streak! That gives you a solid multiplier on every task. Keep it going to reach the 7-Day Champion tier!`;
    }
    if (lower.includes("balance") || lower.includes("how much do i have")) {
      const cash = (points * currency.rate).toFixed(2);
      return `You currently have ${points} PTS in your wallet, which equals ${currency.symbol}${cash}. You can withdraw anytime once you hit the 200 PTS minimum threshold!`;
    }
    return `That's a great question! For ESL speakers, the key to winning speech tasks is rhythm and breath control. Speak naturally at an even 1.0x tempo, and our AI will give you top marks!`;
  };

  const handleSendMessage = async (textToSend = null) => {
    const text = textToSend || inputText.trim();
    if (!text) return;

    soundManager.playRecordBeep(true);
    const newMsg = {
      id: `usr-${Date.now()}`,
      sender: "user",
      text,
      timestamp: "Now"
    };

    setMessages((prev) => [...prev, newMsg]);
    if (!textToSend) setInputText("");
    setIsTyping(true);

    // Call Python FastAPI Backend
    const backendRes = await chatWithAriaAPI(
      text,
      userName,
      currentStreak,
      points,
      activeTask.sentence
    );

    let replyText = "";
    if (backendRes) {
      replyText = backendRes.reply;
      if (backendRes.suggestedFollowUps && backendRes.suggestedFollowUps.length > 0) {
        setQuickQuestions(backendRes.suggestedFollowUps);
      }
    } else {
      replyText = generateLocalAriaResponse(text);
    }

    setMessages((prev) => [
      ...prev,
      {
        id: `aria-${Date.now()}`,
        sender: "aria",
        text: replyText,
        timestamp: "Now"
      }
    ]);
    setIsTyping(false);
    soundManager.playSuccess();
  };

  return (
    <div className="task-card" id="ai-coach-card" style={{ padding: "16px" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "12px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <div
            style={{
              width: "32px",
              height: "32px",
              borderRadius: "50%",
              background: "linear-gradient(135deg, #a855f7 0%, #6366f1 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "16px"
            }}
          >
            🤖
          </div>
          <div>
            <div style={{ fontSize: "14px", fontWeight: "700", color: "#fff" }}>
              Aria — KenVoice AI Coach
            </div>
            <div style={{ fontSize: "11px", color: "#34d399", display: "flex", alignItems: "center", gap: "4px" }}>
              <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#10b981" }}></span>
              FastAPI Python LLM Engine
            </div>
          </div>
        </div>

        <div style={{ fontSize: "11px", background: "rgba(168, 85, 247, 0.15)", color: "#c084fc", padding: "4px 8px", borderRadius: "6px", fontWeight: "600" }}>
          Full-Stack AI
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="chat-messages-container" id="chat-messages-list">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`chat-bubble ${m.sender === "aria" ? "assistant" : "user"}`}
          >
            <div>{m.text}</div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginTop: "6px",
                fontSize: "10px",
                color: "rgba(255, 255, 255, 0.5)"
              }}
            >
              <span>{m.timestamp}</span>
              {m.sender === "aria" && (
                <button
                  type="button"
                  onClick={() => handleSpeakResponse(m.id, m.text)}
                  style={{
                    background: "none",
                    border: "none",
                    color: speakingMessageId === m.id ? "#38bdf8" : "#94a3b8",
                    cursor: "pointer",
                    fontSize: "11px",
                    display: "flex",
                    alignItems: "center",
                    gap: "3px"
                  }}
                  title="Listen to Aria speak this answer"
                >
                  {speakingMessageId === m.id ? "⏹️ Stop" : "🔊 Listen"}
                </button>
              )}
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="chat-bubble assistant" style={{ fontStyle: "italic", color: "#94a3b8" }}>
            Aria is generating response with Python LLM...
          </div>
        )}
        <div ref={chatBottomRef} />
      </div>

      {/* Quick Prompts Chips */}
      <div className="chat-quick-chips">
        {quickQuestions.map((q, idx) => (
          <button
            key={idx}
            type="button"
            className="chat-chip"
            onClick={() => handleSendMessage(q)}
          >
            {q}
          </button>
        ))}
      </div>

      {/* Input Bar */}
      <form
        className="chat-input-bar"
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage();
        }}
      >
        <input
          type="text"
          className="chat-text-input"
          placeholder="Ask Aria about words, earnings, or advice..."
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          id="chat-input-field"
        />
        <button
          type="submit"
          className="chat-send-btn"
          id="chat-send-button"
          aria-label="Send Message"
        >
          ➤
        </button>
      </form>
    </div>
  );
}
