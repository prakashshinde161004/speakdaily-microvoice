// Constants, mock datasets, multilingual translations, and gamification tiers

export const CURRENCIES = {
  INR: { code: "INR", symbol: "₹", rate: 0.15, label: "Indian Rupee (₹)" }, // 100 PTS = ₹15
  USD: { code: "USD", symbol: "$", rate: 0.002, label: "US Dollar ($)" },   // 100 PTS = $0.20
  PHP: { code: "PHP", symbol: "₱", rate: 0.11, label: "Philippine Peso (₱)" },
  IDR: { code: "IDR", symbol: "Rp", rate: 30, label: "Indonesian Rupiah (Rp)" },
  NGN: { code: "NGN", symbol: "₦", rate: 3.2, label: "Nigerian Naira (₦)" },
  KES: { code: "KES", symbol: "KSh", rate: 0.26, label: "Kenyan Shilling (KSh)" }
};

export const DAILY_TASKS = [
  {
    id: 1,
    day: 1,
    category: "Everyday Commerce",
    sentence: "The morning market opens at six sharp.",
    phonetic: "thuh MOR-ning MAR-kit OH-punz at siks sharp",
    difficulty: "Easy",
    basePoints: 50,
    timeLimitSeconds: 15,
    contextTip: "Speak clearly and pause slightly after 'market'.",
    translations: {
      en: "The morning market opens at exactly 6:00 AM.",
      hi: "सुबह का बाज़ार ठीक छह बजे खुलता है।",
      es: "El mercado de la mañana abre a las seis en punto.",
      tl: "Ang pamilihan sa umaga ay nagbubukas nang eksaktong alas-sais.",
      id: "Pasar pagi buka tepat pukul enam.",
      sw: "Soko la asubuhi linafunguliwa saa kumi na mbili kamili."
    }
  },
  {
    id: 2,
    day: 2,
    category: "Digital Payments",
    sentence: "Please confirm my digital payment receipt.",
    phonetic: "pleez kahn-FIRM mye DIJ-ih-tl PAY-munt reh-SEET",
    difficulty: "Medium",
    basePoints: 55,
    timeLimitSeconds: 15,
    contextTip: "Remember: 'receipt' has a silent 'p' (sounds like 'reh-seet').",
    translations: {
      en: "Please confirm that my digital payment was received.",
      hi: "कृपया मेरी डिजिटल भुगतान रसीद की पुष्टि करें।",
      es: "Por favor confirme mi recibo de pago digital.",
      tl: "Paki-kumpirma ang aking resibo sa digital na pagbabayad.",
      id: "Harap konfirmasikan tanda terima pembayaran digital saya.",
      sw: "Tafadhali thibitisha risiti yangu ya malipo ya kidijitali."
    }
  },
  {
    id: 3,
    day: 3,
    category: "Community & Travel",
    sentence: "The express bus leaves every fifteen minutes.",
    phonetic: "thuh ek-SPRESS bus leevz EV-ree FIF-teen MIN-its",
    difficulty: "Easy",
    basePoints: 50,
    timeLimitSeconds: 15,
    contextTip: "Keep your pace steady on 'every fifteen minutes'.",
    translations: {
      en: "The fast bus departs every fifteen minutes.",
      hi: "एक्सप्रेस बस हर पंद्रह मिनट में निकलती है।",
      es: "El autobús expreso sale cada quince minutos.",
      tl: "Umaalis ang express bus tuwing labinlimang minuto.",
      id: "Bus ekspres berangkat setiap lima belas menit.",
      sw: "Basi la kasi huondoka kila baada ya dakika kumi na tano."
    }
  },
  {
    id: 4,
    day: 4,
    category: "Health & Clinic",
    sentence: "Our community health center offers free advice.",
    phonetic: "owr kuh-MYOO-nih-tee helth SEN-tur OFF-erz free ad-VYS",
    difficulty: "Medium",
    basePoints: 60,
    timeLimitSeconds: 18,
    contextTip: "Pronounce 'health' with a soft 'th' sound.",
    translations: {
      en: "Our local clinic gives free medical consultation.",
      hi: "हमारा सामुदायिक स्वास्थ्य केंद्र मुफ्त सलाह देता है।",
      es: "Nuestro centro de salud comunitario ofrece asesoramiento gratuito.",
      tl: "Ang aming health center sa komunidad ay nag-aalok ng libreng payo.",
      id: "Pusat kesehatan masyarakat kami menawarkan saran gratis.",
      sw: "Kituo chetu cha afya cha jamii kinatoa ushauri bila malipo."
    }
  },
  {
    id: 5,
    day: 5,
    category: "Customer Support",
    sentence: "Thank you for answering my questions patiently.",
    phonetic: "THAYNK yoo for AN-sur-ing mye KWES-chunz PAY-shent-lee",
    difficulty: "Medium",
    basePoints: 65,
    timeLimitSeconds: 18,
    contextTip: "Clear enunciation on 'patiently' (pay-shent-lee).",
    translations: {
      en: "Thank you for answering my questions with patience.",
      hi: "मेरे सवालों का धैर्यपूर्वक उत्तर देने के लिए धन्यवाद।",
      es: "Gracias por responder a mis preguntas pacientemente.",
      tl: "Salamat sa matiyagang pagsagot sa aking mga tanong.",
      id: "Terima kasih telah menjawab pertanyaan saya dengan sabar.",
      sw: "Asante kwa kujibu maswali yangu kwa uvumilivu."
    }
  },
  {
    id: 6,
    day: 6,
    category: "Technology",
    sentence: "Fast internet access helps students study better.",
    phonetic: "fast IN-tur-net AK-sess helps STOO-dents STUD-ee BET-tur",
    difficulty: "Easy",
    basePoints: 50,
    timeLimitSeconds: 15,
    contextTip: "Emphasize 'access' and 'study' cleanly.",
    translations: {
      en: "Quick internet helps students learn more easily.",
      hi: "तेज इंटरनेट पहुंच छात्रों को बेहतर अध्ययन करने में मदद करती है।",
      es: "El acceso rápido a Internet ayuda a los estudiantes a estudiar mejor.",
      tl: "Ang mabilis na internet ay nakakatulong sa mga estudyante na mag-aral nang mas mabuti.",
      id: "Akses internet cepat membantu siswa belajar lebih baik.",
      sw: "Upatikanaji wa mtandao wa haraka husaidia wanafunzi kusoma vizuri zaidi."
    }
  },
  {
    id: 7,
    day: 7,
    category: "Weekly Milestone",
    sentence: "Consistency and dedication turn small steps into big success.",
    phonetic: "kahn-SIS-tun-see und ded-ih-KAY-shun turn smawl steps IN-too big suk-SESS",
    difficulty: "Challenging",
    basePoints: 100,
    timeLimitSeconds: 20,
    contextTip: "Weekly Grand Finale! Speak with confidence and clear rhythm.",
    translations: {
      en: "Daily practice turns small efforts into great achievements.",
      hi: "निरंतरता और समर्पण छोटे कदमों को बड़ी सफलता में बदल देते हैं।",
      es: "La constancia y la dedicación transforman pequeños pasos en gran éxito.",
      tl: "Ang kasipagan at dedikasyon ay nagiging malaking tagumpay mula sa maliliit na hakbang.",
      id: "Konsistensi dan dedikasi mengubah langkah kecil menjadi kesuksesan besar.",
      sw: "Msimamo na kujitolea hubadilisha hatua ndogo kuwa mafanikio makubwa."
    }
  }
];

// Audio Verification / QC Micro-Tasks (Listening ear)
export const QC_MICRO_TASKS = [
  {
    id: "qc-1",
    speakerName: "Speaker #412 (Android Phone)",
    targetText: "I would like to order fresh groceries.",
    spokenTextSimulation: "I would like to order fresh groceries.",
    audioTone: 440,
    noiseLevel: "Low",
    question: "Was the spoken audio clear and intelligible?",
    correctAnswer: "yes",
    rewardPoints: 20
  },
  {
    id: "qc-2",
    speakerName: "Speaker #890 (Street Noise)",
    targetText: "The package will arrive at five in the evening.",
    spokenTextSimulation: "The pack... *honk* ...arrive five evening.",
    audioTone: 320,
    noiseLevel: "Heavy background noise / cut-off",
    question: "Did the speaker pronounce all words clearly without cutoffs?",
    correctAnswer: "no",
    rewardPoints: 25
  }
];

export const LEVELS = [
  { level: 1, title: "Voice Novice", minXp: 0, multiplier: 1.0, color: "#94a3b8", icon: "🌱" },
  { level: 2, title: "Speech Scout", minXp: 150, multiplier: 1.15, color: "#38bdf8", icon: "🎙️" },
  { level: 3, title: "Acoustic Pro", minXp: 350, multiplier: 1.30, color: "#a855f7", icon: "⭐" },
  { level: 4, title: "Master Narrator", minXp: 600, multiplier: 1.50, color: "#f59e0b", icon: "👑" }
];

export const BADGES = [
  {
    id: "first_voice",
    name: "First Words",
    description: "Completed your first speech recording task",
    icon: "🎙️",
    unlockedAtStreak: 0,
    requirement: "1 recording"
  },
  {
    id: "streak_3",
    name: "3-Day Dynamo",
    description: "Maintained an unbroken 3-day voice streak",
    icon: "🔥",
    unlockedAtStreak: 3,
    requirement: "3-day streak"
  },
  {
    id: "clarity_master",
    name: "Clarity Ace",
    description: "Achieved 90%+ pronunciation clarity score",
    icon: "🎯",
    unlockedAtStreak: 0,
    requirement: "90%+ clarity"
  },
  {
    id: "qc_master",
    name: "Golden Ear",
    description: "Verified an audio QC micro-task accurately",
    icon: "🎧",
    unlockedAtStreak: 0,
    requirement: "1 QC task"
  },
  {
    id: "cashout_ready",
    name: "First Cashout",
    description: "Transferred earned rewards to real payout",
    icon: "💰",
    unlockedAtStreak: 0,
    requirement: "Cashout completed"
  },
  {
    id: "streak_7",
    name: "Weekly Legend",
    description: "Conquered a full 7-day streak cycle",
    icon: "🏆",
    unlockedAtStreak: 7,
    requirement: "7-day streak"
  }
];

export const MOCK_LEADERBOARD = [
  { rank: 1, name: "Priya S.", country: "🇮🇳", points: 1420, streak: 14, avatar: "👩🏽" },
  { rank: 2, name: "Mateo R.", country: "🇵🇭", points: 1290, streak: 11, avatar: "👨🏻" },
  { rank: 3, name: "Budi W.", country: "🇮🇩", points: 1150, streak: 9, avatar: "👨🏽" },
  { rank: 4, name: "Chioma E.", country: "🇳🇬", points: 980, streak: 8, avatar: "👩🏿" },
  { rank: 5, name: "Amina K.", country: "🇰🇪", points: 870, streak: 7, avatar: "👩🏾" },
  { rank: 6, name: "Carlos M.", country: "🇲🇽", points: 790, streak: 6, avatar: "👨🏼" }
];

// Pre-trained knowledge base for Aria LLM Coach
export const ARIA_KNOWLEDGE = [
  {
    triggers: ["pronounce", "pronunciation", "sound", "accent", "difficult"],
    reply: "Here's a golden tip for clear pronunciation: Slow down by 15% and open your mouth slightly wider on vowels (A, E, I, O, U). In English, pausing between phrases makes you sound confident and 2x clearer to speech AI algorithms!"
  },
  {
    triggers: ["earn", "money", "cash", "rupee", "dollar", "how much", "rate"],
    reply: "On SpeakDaily, every task rewards you with Points (PTS). 100 PTS equals approximately ₹15 / $0.20! Keeping your daily streak alive gives you up to a +50% earnings multiplier, meaning the same 30-second sentence earns you significantly more real money!"
  },
  {
    triggers: ["cashout", "withdraw", "upi", "pay", "bank", "transfer", "payout"],
    reply: "You can cash out your earnings anytime once your balance reaches the minimum threshold! We support instant UPI, Mobile Money, Airtime top-ups, and Direct Bank Transfers. Tap the Wallet tab at any time to simulate an instant payout."
  },
  {
    triggers: ["streak", "freeze", "miss", "day", "protect"],
    reply: "Your streak increases every consecutive day you complete at least 1 speech recording. If you ever anticipate being busy or lacking internet, you can equip a 'Streak Freeze' in your profile to safeguard your multiplier!"
  },
  {
    triggers: ["explain", "meaning", "market", "receipt", "sentence"],
    reply: "Today's sentences are designed around practical everyday conversations (buying groceries, handling digital receipts, travel, and clinic visits). Reading them aloud trains natural rhythm and builds everyday confidence."
  }
];
