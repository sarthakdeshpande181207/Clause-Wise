import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY || '');

// In-memory translation cache: Map<key, translationObject>
// Cache Key format: ${docId}_${clauseId}_${targetLanguage}
const translationCache = new Map();

const LANGUAGE_NAMES = {
  en: 'English',
  hi: 'Hindi',
  mr: 'Marathi',
  gu: 'Gujarati',
  kn: 'Kannada',
};

/**
 * Translates and simplifies a single clause into the target language using Gemini.
 * Uses an in-memory cache to prevent unnecessary LLM API calls.
 * 
 * @param {Object} clause - Clause object containing id, number, title, category, riskLevel, originalText/text, simpleExplanation, etc.
 * @param {string} targetLang - Language code (en, hi, mr, gu, kn)
 * @param {string} docId - Optional document ID for cache isolation
 * @returns {Promise<Object>} Localized clause explanation object
 */
export async function translateClause(clause, targetLang = 'en', docId = 'doc_default') {
  if (!clause) return null;
  const clauseId = clause.id || `c_${clause.number}`;

  // 1. English fallback / immediate return if English requested
  if (targetLang === 'en') {
    return {
      clause_id: clauseId,
      language: 'en',
      title: clause.title || '',
      simplified_explanation: clause.simpleExplanation || clause.summary || '',
      key_points: clause.keyPoints || (clause.meaningForUser ? [clause.meaningForUser] : []),
      risk_explanation: clause.riskRationale || clause.explanation || '',
      user_action: clause.recommendation || '',
    };
  }

  // 2. Check Cache
  const cacheKey = `${docId}_${clauseId}_${targetLang}`;
  if (translationCache.has(cacheKey)) {
    return translationCache.get(cacheKey);
  }

  const targetLangName = LANGUAGE_NAMES[targetLang] || 'English';
  const verbatimText = clause.originalText || clause.text || '';

  const systemInstruction = `You are an expert legal document simplification assistant.
Analyze the original legal clause and explain it strictly in the requested target language: ${targetLangName}.

STRICT LEGAL SIMPLIFICATION RULES:
1. NEVER change the legal meaning of the original clause.
2. NEVER invent facts, conditions, or terms not present in the clause.
3. NEVER remove important obligations, conditions, exceptions, or penalties.
4. ABSOLUTELY PRESERVE all numbers, percentages, dates, deadlines, clause numbers, and monetary values (₹, $, €). Do not alter ₹50,000 to ₹5,000 or 30 days to 15 days.
5. ABSOLUTELY PRESERVE legal negations (not, cannot, shall not, must not, unless, except, prohibited).
6. Explain complicated legal terminology in simple language. If a legal term lacks a direct, reliable translation, keep the original legal term and explain it in parentheses in the target language (e.g., Indemnification (क्षतिपूर्ति)).
7. Do not provide definitive legal advice.
8. Output MUST BE STRICT JSON matching the schema provided below. Do not wrap in markdown or extra text.

JSON Schema:
{
  "clause_id": "${clauseId}",
  "language": "${targetLang}",
  "title": "Title translated in ${targetLangName}",
  "simplified_explanation": "Simplified explanation of the clause in plain ${targetLangName}",
  "key_points": [
    "Key takeaway point 1 in ${targetLangName}",
    "Key takeaway point 2 in ${targetLangName}"
  ],
  "risk_explanation": "Why this clause is significant/risky explained in ${targetLangName}",
  "user_action": "Practical advice/action for the user in ${targetLangName}"
}`;

  const userPrompt = `
Original Legal Clause Text (DO NOT ALTER):
"${verbatimText}"

Base English Context:
Title: ${clause.title || ''}
Risk Level: ${clause.riskLevel || 'MEDIUM'}
Category: ${clause.category || ''}

Translate and simplify this clause into ${targetLangName} (${targetLang}) matching the strict JSON format.`;

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-3.6-flash' });
    const chat = model.startChat({
      generationConfig: {
        temperature: 0.1, // Low temperature for factual precision
        responseMimeType: 'application/json',
      },
    });

    const fullPrompt = `${systemInstruction}\n\n${userPrompt}`;
    const result = await chat.sendMessage(fullPrompt);
    const jsonResponse = JSON.parse(result.response.text());

    // Validate response structure
    const localizedResult = {
      clause_id: clauseId,
      language: targetLang,
      title: jsonResponse.title || clause.title,
      simplified_explanation: jsonResponse.simplified_explanation || clause.simpleExplanation || clause.summary,
      key_points: Array.isArray(jsonResponse.key_points) ? jsonResponse.key_points : [],
      risk_explanation: jsonResponse.risk_explanation || clause.riskRationale || clause.explanation || '',
      user_action: jsonResponse.user_action || clause.recommendation || '',
    };

    // Cache the result
    translationCache.set(cacheKey, localizedResult);
    return localizedResult;

  } catch (error) {
    console.error(`[ClauseTranslator] Error translating clause ${clauseId} to ${targetLang}:`, error);
    throw new Error(`Translation to ${targetLangName} failed.`);
  }
}

/**
 * Clears the translation cache. Useful when a new document is uploaded.
 */
export function clearTranslationCache() {
  translationCache.clear();
}
