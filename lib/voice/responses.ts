// Voice response content: supported languages, read-back confirmations
// (FR-27) and sample phrases, per language. Content only — no browser APIs.

import type { ServiceId } from "@/lib/domain/types";
import type { ParsedIntent, SlotIntent } from "./parser";

export type VoiceLang = "te-IN" | "hi-IN" | "ta-IN" | "en-IN";

export const VOICE_LANGS: { code: VoiceLang; label: string; native: string }[] = [
  { code: "te-IN", label: "Telugu", native: "తెలుగు" },
  { code: "hi-IN", label: "Hindi", native: "हिंदी" },
  { code: "ta-IN", label: "Tamil", native: "தமிழ்" },
  { code: "en-IN", label: "English", native: "English" },
];

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
