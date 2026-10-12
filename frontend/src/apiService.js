// Full-Stack API Client with Automatic Offline Fallback
// Connects to Python FastAPI backend (http://localhost:8000)
// Gracefully falls back to client-side heuristics if the backend is unreachable

const isDevFrontend = typeof window !== "undefined" && window.location.port === "3000";
const API_BASE = process.env.REACT_APP_API_URL || (isDevFrontend ? "http://localhost:8000/api" : "/api");

export async function checkBackendHealth() {
  try {
    const res = await fetch(`${API_BASE}/health`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      signal: AbortSignal.timeout(2000)
    });
    if (res.ok) {
      const data = await res.json();
      return { connected: true, runtime: data.runtime };
    }
  } catch (e) {
    // Backend offline or running in standalone static mode
  }
  return { connected: false, runtime: "Client-Side Standalone Engine" };
}

// User Authentication: Login
export async function loginAPI(username, password) {
  try {
    const res = await fetch(`${API_BASE}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
      signal: AbortSignal.timeout(3000)
    });
    const data = await res.json();
    if (res.ok && data.success) {
      return data;
    }
    return { success: false, message: data.detail || data.message || "Login failed." };
  } catch (e) {
    console.info("Python backend offline; attempting local auth fallback.", e);
  }

  // Local fallback auth
  const savedUsers = JSON.parse(localStorage.getItem("speakdaily_local_users") || "{}");
  const cleanUname = username.trim().toLowerCase();

  // Pre-configured demo user fallback
  if (cleanUname === "prakash") {
    return {
      success: true,
      message: "Welcome back, Prakash Kumar (Demo Mode)!",
      token: "demo-token-prakash",
      user: {
        username: "prakash",
        fullName: "Prakash Kumar",
        country: "🇮🇳 India",
        points: parseInt(localStorage.getItem("speakdaily_points") || "380", 10),
        streak: parseInt(localStorage.getItem("speakdaily_streak") || "5", 10),
        xp: parseInt(localStorage.getItem("speakdaily_xp") || "210", 10),
        unlockedBadges: ["first_voice", "streak_3", "clarity_master"],
        createdAt: "2026-10-01"
      }
    };
  }

  if (savedUsers[cleanUname]) {
    return {
      success: true,
      message: `Welcome back, ${savedUsers[cleanUname].fullName || cleanUname}!`,
      token: `local-token-${cleanUname}`,
      user: savedUsers[cleanUname]
    };
  }

  return { success: false, message: "User not found. Please click Register to create an account." };
}

// User Authentication: Register
export async function registerAPI(username, password, fullName, country) {
  try {
    const res = await fetch(`${API_BASE}/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password, fullName, country }),
      signal: AbortSignal.timeout(3000)
    });
    const data = await res.json();
    if (res.ok && data.success) {
      return data;
    }
    return { success: false, message: data.detail || data.message || "Registration failed." };
  } catch (e) {
    console.info("Python backend offline; storing account locally.", e);
  }

  // Local fallback registration
  const savedUsers = JSON.parse(localStorage.getItem("speakdaily_local_users") || "{}");
  const cleanUname = username.trim().toLowerCase();

  const newUser = {
    username: cleanUname,
    fullName: fullName.trim() || cleanUname.toUpperCase(),
    country: country || "🇮🇳 India",
    points: 50, // Welcome bonus!
    streak: 1,
    xp: 50,
    unlockedBadges: ["first_voice"],
    createdAt: new Date().toISOString().split("T")[0]
  };

  savedUsers[cleanUname] = newUser;
  localStorage.setItem("speakdaily_local_users", JSON.stringify(savedUsers));

  return {
    success: true,
    message: "Account registered locally with +50 PTS welcome reward!",
    token: `local-token-${cleanUname}`,
    user: newUser
  };
}

// Sync progress to backend
export async function syncUserProgressAPI(username, progressData) {
  try {
    await fetch(`${API_BASE}/sync-user`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username,
        points: progressData.points,
        streak: progressData.streak,
        xp: progressData.xp,
        unlockedBadges: progressData.unlockedBadges,
        transactions: progressData.transactions
      }),
      signal: AbortSignal.timeout(2500)
    });
  } catch (e) {
    // Silent ignore in offline mode
  }
}

// Speech Analysis API
export async function analyzeSpeechAPI(targetSentence, spokenTranscript, durationSeconds, streak, multiplier) {
  try {
    const res = await fetch(`${API_BASE}/analyze-speech`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        targetSentence,
        spokenTranscript,
        durationSeconds,
        streak,
        multiplier
      }),
      signal: AbortSignal.timeout(3500)
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (e) {
    console.info("Python backend unreachable; using client engine fallback.", e);
  }
  return null;
}

// Aria LLM Chat API
export async function chatWithAriaAPI(userMessage, userName, streak, points, currentSentence) {
  try {
    const res = await fetch(`${API_BASE}/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userMessage,
        userName,
        streak,
        points,
        currentSentence
      }),
      signal: AbortSignal.timeout(3500)
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (e) {
    console.info("Python backend unreachable; using local Aria assistant.", e);
  }
  return null;
}

// Real Money Cashout Settlement API
export async function processCashoutAPI(points, method, destination, currencyCode) {
  try {
    const res = await fetch(`${API_BASE}/cashout`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        points,
        method,
        destination,
        currencyCode
      }),
      signal: AbortSignal.timeout(3500)
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (e) {
    console.info("Python backend unreachable; using simulated cryptographic cashout.", e);
  }
  return null;
}
