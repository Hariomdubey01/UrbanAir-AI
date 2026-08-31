export interface GuardrailCheckResult {
  isBlocked: boolean;
  type?: 'medical' | 'off_topic';
  refusalResponse?: {
    answer: string;
    summary: string;
    disclaimer: string;
  };
}

export const MEDICAL_REFUSAL = "UrbanAir AI provides environmental information and educational guidance. It cannot diagnose medical conditions or recommend treatment. If you're concerned about a health symptom, please consult a healthcare professional.";

export const OFFTOPIC_REDIRECT = "That's outside what UrbanAir AI can help with. I can answer questions about air quality, environmental conditions, urban sustainability, or SDG 11 — want to ask something in that space?";

const MEDICAL_KEYWORDS = [
  'diagnose', 'diagnosis', 'asthma', 'inhaler', 'dosage', 'dose', 'prescription',
  'prescribe', 'symptoms of', 'treatment for', 'treat my', 'should i take', 'pills',
  'tablet', 'antibiotic', 'drug', 'medicine', 'medication', 'doctor', 'cure my',
  'cough medicine', 'chest pain remedy', 'medical advice', 'health symptom'
];

const OFF_TOPIC_KEYWORDS = [
  'write python code', 'python snake game', 'build a game', 'write essay about history',
  'recipe for', 'movie review', 'math problem', 'solve equation', 'tell me a joke', 'tell me a funny joke',
  'write code', 'javascript script', 'crypto price', 'football championship', 'who won the match'
];


export function checkGuardrails(userQuery: string): GuardrailCheckResult {
  const queryLower = userQuery.toLowerCase();

  // Check Medical Refusal
  const isMedical = MEDICAL_KEYWORDS.some(kw => queryLower.includes(kw));
  if (isMedical) {
    return {
      isBlocked: true,
      type: 'medical',
      refusalResponse: {
        answer: MEDICAL_REFUSAL,
        summary: 'Medical Safety Refusal',
        disclaimer: 'UrbanAir AI provides environmental information and educational guidance, not medical diagnosis.',
      }
    };
  }

  // Check Off-topic Redirect
  const isOffTopic = OFF_TOPIC_KEYWORDS.some(kw => queryLower.includes(kw));
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

