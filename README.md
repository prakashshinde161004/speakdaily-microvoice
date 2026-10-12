# 🎙️ SpeakDaily | MicroVoice AI
> **Full-Stack Daily Speech & Pronunciation Micro-Task Platform**  
> *Built with React 18 + Python FastAPI for Kenpath Labs Full-Stack Engineer Assessment*

🌐 **Permanent Live App (Any Device):** [https://prakashshinde161004.github.io/speakdaily-microvoice/](https://prakashshinde161004.github.io/speakdaily-microvoice/)  
⚡ **Alternative Global Mirror:** [https://speakdaily-microvoice.surge.sh](https://speakdaily-microvoice.surge.sh)  
*(Accessible 24/7 worldwide on any phone, Android, iPhone, tablet, or PC with microphone permissions)*

[![GitHub Pages](https://img.shields.io/badge/Live%20App-GitHub%20Pages-success.svg?style=flat-square&logo=github)](https://prakashshinde161004.github.io/speakdaily-microvoice/)
[![GitHub Repo](https://img.shields.io/badge/GitHub-prakashshinde161004%2Fspeakdaily--microvoice-181717.svg?style=flat-square&logo=github)](https://github.com/prakashshinde161004/speakdaily-microvoice)
[![React 18](https://img.shields.io/badge/React-18.3.1-61dafb.svg?style=flat-square&logo=react)](https://react.dev/)
[![FastAPI](https://img.shields.io/badge/FastAPI-Python%203.10-009688.svg?style=flat-square&logo=fastapi)](https://fastapi.tiangolo.com/)
[![Bundle Size](https://img.shields.io/badge/Gzipped%20Size-69%20kB-10b981.svg?style=flat-square)](https://bundlephobia.com/)
[![License](https://img.shields.io/badge/License-MIT-blue.svg?style=flat-square)](LICENSE)

---

## 🎯 Executive Overview & Product Thesis

**SpeakDaily** is a mobile-first, habit-forming web application where users complete a 30-second daily voice micro-task (reading aloud a real-world sentence or verifying audio quality) and earn **real monetary rewards**.

### Tailored Specifically for Kenpath's Target Audience:

1. **📱 Modest Android Phones & Mobile Data:**
   - **Ultra-lightweight footprint:** Entire frontend bundles to only **69 kB gzipped**.
   - **Zero-bandwidth audio synthesis:** Uses native **Web Audio API** and **Web Speech API** for sound effects and native pronunciation. Zero heavy `.mp3` downloads over cellular networks.
   - **Offline & Low-Bandwidth Resilience:** Full-stack architecture with automatic fallback—if the Python backend is ever unreachable or offline, the client continues running seamlessly.

2. **🌏 English as a Second Language (ESL):**
   - **Listen Native Voice:** Users hear native pronunciation before recording, with a **0.8x Slow** speed toggle.
   - **Phonetic Pronunciation Guides:** Every sentence includes syllable stress breakdown.
   - **Multilingual Support:** Instant translations in Hindi (🇮🇳), Spanish (🇪🇸), Tagalog (🇵🇭), Bahasa Indonesia (🇮🇩), and Swahili (🇰🇪).
   - **Word-by-Word AI Feedback:** Highlights which words were pronounced crisply (Green) vs words needing practice (Amber).

3. **💰 Rewards Worth Real Money:**
   - **Dual Display:** Shows points (PTS) and real currency value (₹, $, ₱, Rp, ₦, KSh) with a live currency switcher.
   - **Daily Streak Multiplier:** Daily streaks add up to a **+50% cash multiplier** on every task.
   - **Realistic Cashout Simulator:** Supports UPI (GPay/PhonePe), Mobile Money (M-Pesa/GCash), Bank Transfer, and Instant Airtime Recharge, complete with digital transaction receipts and SHA-256 cryptographic hashes.

4. **👤 User Accounts & Registration:**
   - **Register New Accounts:** New users receive an instant **+50 PTS welcome bonus**.
   - **Account Profile Modal:** Users can inspect their lifetime earnings, streak count, member ID, and transaction ledger.
   - **1-Click Evaluator Demo Login:** Evaluators can instantly log in as `prakash` to view an active 5-day streak account with zero setup!

5. **🤖 Aria — KenVoice AI Coach (Python LLM Assistant):**
   - Conversational AI assistant powered by **Python FastAPI** trained on pronunciation coaching, syllable stress, tongue placement tips, and payout transparency.
   - Features **Read Aloud** voice playback on responses so ESL users can listen rather than read long text.

---

## 🏗️ Architecture & Technology Stack

```
   ┌─────────────────────────────────────────────────────────────┐
   │                   React 18 Frontend                         │
   │   - Mobile-First Responsive Shell (Vanilla CSS)             │
   │   - User Auth & Profile Modal (Login / Register)            │
   │   - Web Audio API Synthesizer (Zero-Bandwidth)              │
   │   - MediaRecorder + Web Speech API (Pronunciation)          │
   │   - Automatic Offline / Standalone Fallback Engine          │
   └───────────────▲─────────────────────────────▲───────────────┘
                   │                             │
         HTTP JSON │ (localhost:8000)            │ Fallback
                   ▼                             ▼
   ┌─────────────────────────────┐    ┌──────────────────────────┐
   │    Python FastAPI Backend   │    │  In-Browser Heuristics   │
   │  - Auth (Register & Login)  │    │  - Instant Offline Sync  │
   │  - Persistent JSON User DB  │    │  - LocalStorage State    │
   │  - Levenshtein & Phonetics  │    │  - Zero Network Required │
   │  - Aria Conversational LLM  │    └──────────────────────────┘
   │  - SHA-256 Cashout Hashes   │
   │  - OpenAPI Swagger at /docs │
   └─────────────────────────────┘
```

---

## 🚀 Getting Started (Clone to Run)

### Prerequisites
- **Node.js** (v18.0.0 or higher)
- **Python 3.10+** and `pip`

---

### Step 1: Start the Python FastAPI Backend

```bash
cd backend
source venv/bin/activate
uvicorn main:app --reload --port 8000
```
👉 Python API will be live at: **`http://localhost:8000`**  
👉 Interactive OpenAPI Swagger documentation at: **`http://localhost:8000/docs`**

---

### Step 2: Start the React Frontend

In a separate terminal:
```bash
cd frontend
npm install
npm start
```
👉 Frontend will start at: **`http://localhost:3000`**

---

### 🔑 Test Accounts & Demo Credentials

| Role | Username | Password | Notes |
| :--- | :--- | :--- | :--- |
| **Demo User** | `prakash` | `password123` | Pre-loaded with 380 PTS, 5-Day Streak, and transaction history. *(Or tap "1-Click Evaluator Login")* |
| **New Register** | *(Any unique username)* | *(Any password)* | Automatically gets **+50 PTS sign-up gift**, Level 1 status, and custom country selection. |

---

## 📡 Python API Endpoints Summary

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/register` | User sign-up with +50 PTS welcome reward |
| `POST` | `/api/login` | User authentication & profile retrieval |
| `GET` | `/api/profile/{username}` | Retrieve user profile & transaction ledger |
| `POST` | `/api/sync-user` | Sync user streaks, points, and badges to backend |
| `GET` | `/api/health` | Health status and runtime verification |
| `POST` | `/api/analyze-speech` | Phonetic similarity, pacing WPM, and reward multiplier calculation |
| `POST` | `/api/chat` | Aria LLM conversational speech coaching & follow-up suggestions |
| `POST` | `/api/cashout` | UPI/Bank/Mobile Money withdrawal processing & SHA-256 cryptographic receipt |
| `POST` | `/api/verify-qc` | Audio QC micro-task verification |

---

## 🌐 Deploying to Free Tier Hosting

### Frontend (Vercel / Netlify):
- **Vercel:** Import repository, set Root Directory to `frontend`.
- **Netlify:** Drag and drop `frontend/build` to [app.netlify.com/drop](https://app.netlify.com/drop).

### Python Backend (Render / Railway / Fly.io):
- Deploy `backend/` with start command: `uvicorn main:app --host 0.0.0.0 --port $PORT`.

---

## 📱 Mobile Screen Emulation

To test exactly as Kenpath's Android evaluators will see it:
1. Open `http://localhost:3000` in Google Chrome.
2. Press `F12` $\rightarrow$ Toggle Device Toolbar (`Ctrl + Shift + M`).
3. Select **Samsung Galaxy A51/71** or **Pixel 7**.
4. Test the micro-task, listen to native pronunciation, record voice, chat with Aria, and perform a simulated cashout!

---

## 👨‍💻 Author
Built with ❤️ by **Prakash** for **Kenpath Labs**.
