// Voice intent parser (FR-26): keyword-based service + slot extraction
// across Te/Hi/Ta/En, including transliterations for code-switching.
// Pure and unit-tested — a stand-in for the production LLM-NLU (TR-22).

import type { ServiceId } from "@/lib/domain/types";

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
  // Longest matching keyword wins across ALL slots, so specific phrases
  // ("कल शाम" / "tomorrow evening") always beat generic ones ("शाम" /
  // "evening") regardless of slot iteration order.
  let slot: SlotIntent = null;
  let bestLen = 0;
  for (const [key, words] of Object.entries(SLOT_KEYWORDS) as [Exclude<SlotIntent, null>, string[]][]) {
    for (const w of words) {
      if (w.length > bestLen && t.includes(w.toLowerCase())) {
        slot = key;
        bestLen = w.length;
      }
    }
  }
  return { service, slot };
}
