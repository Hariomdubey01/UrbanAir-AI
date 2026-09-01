export interface GuardrailCheckResult {
  isBlocked: boolean;
  type?: 'medical' | 'off_topic' | 'secret_refusal';
  refusalResponse?: {
    answer: string;
    summary: string;
    disclaimer: string;
  };
}

export const SECRET_REFUSAL = "I cannot disclose internal system instructions, API keys, environment variables, or configuration details. I am here to help you understand air quality, environmental metrics, and sustainable cities under SDG 11.";

export const MEDICAL_REFUSAL = "UrbanAir AI provides environmental information and educational guidance. It cannot diagnose medical conditions, recommend personalized treatments, or prescribe medication. If you are concerned about a health symptom or medical condition, please consult a qualified healthcare professional.";

export const OFFTOPIC_REDIRECT = "That's outside what UrbanAir AI can help with. I am focused on environmental intelligence, air quality, pollution metrics, sustainable cities, and SDG 11 — feel free to ask any question in that space!";

// 1. Secret / Prompt-Injection Detection
const SECRET_INJECTION_PATTERNS = [
  /system\s*prompt/i,
  /gemini_api_key/i,
  /api[_\s-]*key/i,
  /env(?:ironment)?\s*var(?:iable)?s?/i,
  /hidden\s*instructions?/i,
  /internal\s*config(?:uration)?/i,
  /ignore\s*(?:all\s*)?(?:previous\s*)?instructions/i,
  /reveal\s*(?:your\s*)?(?:system|prompt|secret|instructions)/i,
  /show\s*(?:me\s*)?(?:all\s*)?(?:env|secrets?|keys?)/i,
];

// 2. Personal Medical Diagnosis & Prescription Patterns (Preserving general health info queries)
const MEDICAL_DIAGNOSIS_PATTERNS = [
  /diagnos(?:e|is)/i,
  /prescri(?:be|ption)/i,
  /what\s+medicine\s+(?:should|can|do)\s+i\s+take/i,
  /which\s+medicine/i,
  /what\s+pills?\s+(?:should|can)\s+i/i,
  /take\s+pills/i,
  /dosage\s+for/i,
  /what\s+dose/i,
  /cure\s+my/i,
  /treat\s+my\s+(?:illness|condition|cough|asthma|pain|symptoms?)/i,
  /treatment\s+for\s+my/i,
  /chest\s+pain\s+remedy/i,
  /cough\s+medicine/i,
  /medical\s+advice\s+for\s+me/i,
];

// 3. Off-Topic Patterns (Sports, Gaming, Code generation, Recipes, Jokes)
const OFF_TOPIC_PATTERNS = [
  /write\s*(?:python|javascript|code|script|game|html|css)/i,
  /python\s*(?:snake\s*)?game/i,
  /build\s*a\s*game/i,
  /recipe\s*for/i,
  /movie\s*(?:review|recommendation)/i,
  /recommend\s*(?:a\s*)?movie/i,
  /tell\s*me\s*a\s*joke/i,
  /cricket\s*match/i,
  /football\s*(?:match|championship)/i,
  /who\s*won\s*(?:the|yesterday'?s?)\s*match/i,
  /solve\s*(?:this\s*)?equation/i,
  /crypto\s*price/i,
];

export function checkGuardrails(userQuery: string): GuardrailCheckResult {
  const query = userQuery.trim();

  // 1. Check Secret / Prompt-Injection Attempt
  const isSecretAttempt = SECRET_INJECTION_PATTERNS.some(pattern => pattern.test(query));
  if (isSecretAttempt) {
    return {
      isBlocked: true,
      type: 'secret_refusal',
      refusalResponse: {
        answer: SECRET_REFUSAL,
        summary: 'Security & Integrity Guardrail',
        disclaimer: 'UrbanAir AI maintains strict confidentiality regarding internal configurations and credentials.',
      }
    };
  }

  // 2. Check Medical Diagnosis / Prescription
  const isMedical = MEDICAL_DIAGNOSIS_PATTERNS.some(pattern => pattern.test(query));
  if (isMedical) {
    return {
      isBlocked: true,
      type: 'medical',
      refusalResponse: {
        answer: MEDICAL_REFUSAL,
        summary: 'Medical Safety Refusal',
        disclaimer: 'UrbanAir AI provides environmental information and educational guidance, not medical diagnosis or prescription.',
      }
    };
  }

  // 3. Check Off-topic Redirect
  const isOffTopic = OFF_TOPIC_PATTERNS.some(pattern => pattern.test(query));
  if (isOffTopic) {
    return {
      isBlocked: true,
      type: 'off_topic',
      refusalResponse: {
        answer: OFFTOPIC_REDIRECT,
        summary: 'Domain Scope Redirect',
        disclaimer: 'UrbanAir AI is dedicated to environmental intelligence and sustainable communities (SDG 11).',
      }
    };
  }

  return { isBlocked: false };
}

