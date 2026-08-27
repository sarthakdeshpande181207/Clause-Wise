import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY || '');

export async function analyzeDocumentWithGemini(rawText, fileName) {
  const model = genAI.getGenerativeModel({ model: "gemini-3.6-flash" });

  const prompt = `
    You are an expert legal AI. Analyze the following document text and extract the key clauses.
    Output the analysis STRICTLY in JSON format matching this exact schema, and nothing else (no markdown wrapping).
    
    {
      "documentName": "Name of the agreement",
      "documentType": "Type of agreement (e.g. NDA, Service Agreement)",
      "parties": ["Party 1 Name", "Party 2 Name"],
      "summary": "A 2-3 sentence summary of the document and its main purpose.",
      "detailedSummary": {
        "documentClassification": "Exact type (e.g., NDA, Employment Agreement, Will)",
        "simpleTakeaway": "A 1-2 sentence explanation of what this document actually does, in plain English for a layperson.",
        "partiesInvolved": ["Who Party A is", "Who Party B is"],
        "keyObligations": ["What you have to do", "What they have to do"],
        "importantTerms": ["Term 1: simple meaning", "Term 2: simple meaning"],
        "durationAndTermination": "How long it lasts and how to cancel it."
      },
      "stats": {
        "totalClauses": number,
        "highRisk": number,
        "mediumRisk": number,
        "lowRisk": number,
        "keyDates": number
      },
      "keyDates": [
        {
          "id": "kd1",
          "event": "Description of the event",
          "date": "YYYY-MM-DD",
          "section": "Section number",
          "page": 1,
          "urgency": "upcoming"
        }
      ],
      "clauses": [
        {
          "id": "c1",
          "number": "Section number or index",
          "title": "Title of the clause",
          "category": "e.g. Liability, IP, Payment",
          "riskLevel": "HIGH", // HIGH, MEDIUM, or LOW
          "originalText": "The exact verbatim text of the clause from the document.",
          "simpleExplanation": "A plain english explanation.",
          "meaningForUser": "What this means for the user practically.",
          "riskRationale": "Why it was given this risk level."
        }
      ]
    }
    
    Document Text to Analyze:
    ${rawText.substring(0, 100000)} // Ensure we don't exceed token limits for massive docs
  `;

  try {
    const chat = model.startChat({
      generationConfig: {
        temperature: 0.1,
        responseMimeType: "application/json",
      },
    });

    const result = await chat.sendMessage([{ text: prompt }]);
    const jsonText = result.response.text();
    return JSON.parse(jsonText);
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    throw new Error("Failed to analyze document with AI.");
  }
}
