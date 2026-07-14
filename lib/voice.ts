// In-app voice booking engine (EP-7, FR-26..28).
// Uses the browser Web Speech API for ASR + TTS. Intent + slot extraction is
// keyword-based across Te/Hi/Ta/En — a stand-in for the production LLM-NLU
// (TR-22), but genuinely functional in Chrome/Edge/Android.

import type { ServiceId } from "./data";

export type VoiceLang = "te-IN" | "hi-IN" | "ta-IN" | "en-IN";

export const VOICE_LANGS: { code: VoiceLang; label: string; native: string }[] = [
  { code: "te-IN", label: "Telugu", native: "తెలుగు" },
  { code: "hi-IN", label: "Hindi", native: "हिंदी" },
  { code: "ta-IN", label: "Tamil", native: "தமிழ்" },
  { code: "en-IN", label: "English", native: "English" },
];

export type SlotIntent = "asap" | "today-pm" | "tom-am" | "tom-pm" | null;

export interface ParsedIntent {
  service: ServiceId | null;
  slot: SlotIntent;
}

// Keyword tables. Speech APIs return native script for Indic languages, plus
// we include transliterations since code-switching is common (FR-26 EC).
const SERVICE_KEYWORDS: Record<ServiceId, string[]> = {
  cleaning: [
    "clean", "cleaning", "maid", "sweep", "mop", "vessel", "bathroom", "dust",
    "శుభ్రం", "క్లీనింగ్", "ఇల్లు శుభ్రం", "పని మనిషి", "తుడవ", "గిన్నెలు",
    "सफाई", "साफ", "झाड़ू", "पोछा", "बर्तन", "क्लीनिंग",
    "சுத்தம்", "க்ளீனிங்", "துடைக்க", "பாத்திரம்", "வீடு சுத்தம்",
  ],
  cook: [
    "cook", "cooking", "food", "meal", "tiffin", "breakfast", "lunch", "dinner", "curry",
    "వంట", "భోజనం", "టిఫిన్", "వంట మనిషి", "కూర", "అన్నం",
    "खाना", "रसोई", "भोजन", "टिफिन", "कुक", "खाना बनाने",
    "சமையல்", "சாப்பாடு", "உணவு", "டிபன்", "குக்",
  ],
  laundry: [
    "laundry", "wash clothes", "washing", "iron", "ironing", "clothes",
    "బట్టలు", "లాండ్రీ", "ఇస్త్రీ", "ఉతక",
    "कपड़े", "धुलाई", "लॉन्ड्री", "इस्त्री", "प्रेस",
    "துணி", "சலவை", "லாண்டரி", "இஸ்திரி",
  ],
  care: [
    "care", "caretaker", "babysit", "baby", "child", "elder", "nanny", "ayah",
    "సంరక్షణ", "ఆయా", "పాప", "పిల్లల", "పెద్దవాళ్ల", "కేర్",
    "देखभाल", "आया", "बच्चे", "बुजुर्ग", "केयर",
    "பராமரிப்பு", "ஆயா", "குழந்தை", "முதியோர்", "கேர்",
  ],
};

const SLOT_KEYWORDS: Record<Exclude<SlotIntent, null>, string[]> = {
  asap: [
    "now", "immediately", "asap", "right away", "urgent",
    "ఇప్పుడు", "వెంటనే", "అర్జెంట్",
    "अभी", "तुरंत", "अर्जेंट",
    "இப்போது", "உடனே", "அவசரம்",
  ],
  "today-pm": [
    "this evening", "tonight", "today evening", "evening",
    "ఈ సాయంత్రం", "సాయంత్రం", "ఈ రోజు సాయంత్రం", "రాత్రి",
    "आज शाम", "शाम", "आज रात",
    "இன்று மாலை", "மாலை", "இன்றிரவு",
  ],
  "tom-am": [
    "tomorrow morning", "morning",
    "రేపు ఉదయం", "ఉదయం", "పొద్దున",
    "कल सुबह", "सुबह",
    "நாளை காலை", "காலை",
  ],
  "tom-pm": [
    "tomorrow evening", "tomorrow",
    "రేపు సాయంత్రం", "రేపు",
    "कल शाम", "कल",
    "நாளை மாலை", "நாளை",
  ],
};

export function parseIntent(transcript: string): ParsedIntent {
  const t = transcript.toLowerCase();
  let service: ServiceId | null = null;
  for (const [svc, words] of Object.entries(SERVICE_KEYWORDS) as [ServiceId, string[]][]) {
    if (words.some((w) => t.includes(w.toLowerCase()))) {
      service = svc;
      break;
    }
  }
  let slot: SlotIntent = null;
  // Order matters: specific phrases ("tomorrow morning") before generic ("tomorrow")
  for (const key of ["asap", "today-pm", "tom-am", "tom-pm"] as const) {
    if (SLOT_KEYWORDS[key].some((w) => t.includes(w.toLowerCase()))) {
      slot = key;
      break;
    }
  }
  return { service, slot };
}

const SERVICE_NAMES: Record<VoiceLang, Record<ServiceId, string>> = {
  "en-IN": { cleaning: "house cleaning", cook: "a home cook", laundry: "laundry pickup", care: "a certified caregiver" },
  "te-IN": { cleaning: "ఇంటి శుభ్రత", cook: "వంట మనిషి", laundry: "లాండ్రీ పికప్", care: "సర్టిఫైడ్ కేర్‌టేకర్" },
  "hi-IN": { cleaning: "घर की सफाई", cook: "कुक", laundry: "लॉन्ड्री पिकअप", care: "प्रमाणित केयरटेकर" },
  "ta-IN": { cleaning: "வீடு சுத்தம்", cook: "சமையல்காரர்", laundry: "சலவை பிக்கப்", care: "சான்றளிக்கப்பட்ட பராமரிப்பாளர்" },
};

const SLOT_NAMES: Record<VoiceLang, Record<Exclude<SlotIntent, null>, string>> = {
  "en-IN": { asap: "as soon as possible", "today-pm": "this evening", "tom-am": "tomorrow morning", "tom-pm": "tomorrow evening" },
  "te-IN": { asap: "వీలైనంత త్వరగా", "today-pm": "ఈ సాయంత్రం", "tom-am": "రేపు ఉదయం", "tom-pm": "రేపు సాయంత్రం" },
  "hi-IN": { asap: "जल्द से जल्द", "today-pm": "आज शाम", "tom-am": "कल सुबह", "tom-pm": "कल शाम" },
  "ta-IN": { asap: "கூடிய விரைவில்", "today-pm": "இன்று மாலை", "tom-am": "நாளை காலை", "tom-pm": "நாளை மாலை" },
};

// Read-back confirmation (FR-27): summary in the user's language.
export function readbackText(lang: VoiceLang, intent: ParsedIntent): string {
  const svc = intent.service ? SERVICE_NAMES[lang][intent.service] : "";
  const slot = SLOT_NAMES[lang][intent.slot ?? "asap"];
  switch (lang) {
    case "te-IN":
      return `సరే! ${svc}, ${slot} బుక్ చేయడానికి సిద్ధం. కొనసాగించాలా?`;
    case "hi-IN":
      return `ठीक है! ${svc}, ${slot} बुक करने के लिए तैयार है। जारी रखें?`;
    case "ta-IN":
      return `சரி! ${svc}, ${slot} புக் செய்ய தயார். தொடரவா?`;
    default:
      return `Got it! Ready to book ${svc}, ${slot}. Shall we continue?`;
  }
}

export function notUnderstoodText(lang: VoiceLang): string {
  switch (lang) {
    case "te-IN":
      return "క్షమించండి, అర్థం కాలేదు. సర్వీస్ పేరు చెప్పండి — క్లీనింగ్, వంట, లాండ్రీ లేదా కేర్.";
    case "hi-IN":
      return "माफ़ कीजिए, समझ नहीं आया। सेवा का नाम बोलें — सफाई, खाना, लॉन्ड्री या केयर।";
    case "ta-IN":
      return "மன்னிக்கவும், புரியவில்லை. சேவையின் பெயரைச் சொல்லுங்கள் — சுத்தம், சமையல், சலவை அல்லது கேர்.";
    default:
      return "Sorry, I didn't catch that. Say a service — cleaning, cook, laundry or care.";
  }
}

// Sample phrases per language (used as tap-to-try chips + mic fallback)
export const SAMPLE_PHRASES: Record<VoiceLang, string[]> = {
  "te-IN": [
    "ఈ సాయంత్రం ఇల్లు శుభ్రం చేయడానికి ఎవరైనా కావాలి",
    "రేపు ఉదయం వంట మనిషి కావాలి",
    "ఇప్పుడు బట్టలు ఉతకడానికి లాండ్రీ బుక్ చేయి",
  ],
  "hi-IN": [
    "कल शाम खाना बनाने वाली चाहिए",
    "अभी घर की सफाई के लिए किसी को भेजो",
    "कल सुबह कपड़े धुलाई के लिए बुक करो",
  ],
  "ta-IN": [
    "இன்று மாலை வீடு சுத்தம் செய்ய வேண்டும்",
    "நாளை காலை சமையல்காரர் வேண்டும்",
    "இப்போது துணி எடுக்க லாண்டரி புக் செய்",
  ],
  "en-IN": [
    "I need house cleaning this evening",
    "Book a cook for tomorrow morning",
    "Send someone now for laundry pickup",
  ],
};

// ---- Web Speech API helpers ----

export interface SpeechRecognitionLike {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  start: () => void;
  stop: () => void;
  abort: () => void;
  onresult: ((e: { results: ArrayLike<ArrayLike<{ transcript: string }>> }) => void) | null;
  onerror: ((e: { error: string }) => void) | null;
  onend: (() => void) | null;
}

export function getRecognition(): SpeechRecognitionLike | null {
  if (typeof window === "undefined") return null;
  const w = window as unknown as Record<string, unknown>;
  const Ctor = (w.SpeechRecognition ?? w.webkitSpeechRecognition) as
    | (new () => SpeechRecognitionLike)
    | undefined;
  return Ctor ? new Ctor() : null;
}

export function speak(text: string, lang: VoiceLang): void {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
  try {
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = lang;
    const voices = window.speechSynthesis.getVoices();
    const match =
      voices.find((v) => v.lang === lang) ??
      voices.find((v) => v.lang.startsWith(lang.split("-")[0]));
    if (match) u.voice = match;
    u.rate = 0.95;
    window.speechSynthesis.speak(u);
  } catch {
    // TTS is progressive enhancement — the on-screen summary is authoritative (FR-27)
  }
}
