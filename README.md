# ⚖️ ClauseWise
**AI-Powered Legal Document Analysis & Chatbot**

ClauseWise is a modern, responsive web application built for the Smart India Hackathon (SIH) 2026. It allows users to upload legal documents and instantly receive AI-driven analysis, risk assessments, and simple explanations of complex clauses.

---

## ✨ Features

- **📄 Client-Side Document Parsing**: Extracts raw text from `.docx`, `.pdf`, and `.txt` files entirely within the browser using `mammoth` and `pdf.js`—no backend required, ensuring maximum privacy and speed for the prototype.
- **🤖 Gemini AI Integration**: Utilizes Google's `gemini-3.6-flash` model to perform deep structural analysis of legal texts, categorizing clauses, assigning risk levels, and identifying key dates.
- **💬 Ask Your Document**: A dynamic, RAG-style (Retrieval-Augmented Generation) chatbot that allows users to ask specific questions about their uploaded document. The AI strictly uses the extracted document clauses to provide accurate, hallucination-free answers.
- **📊 Interactive Dashboard**: Visualizes document statistics, highlights high-risk clauses, and tracks key dates on an intuitive, glassmorphic UI.
- **🔍 Clause Explorer**: A dedicated interface to review every clause side-by-side with its original text, a simple explanation, and a risk rationale.

---

## 🛠️ Technology Stack

- **Frontend Framework**: React + Vite
- **Styling**: Vanilla CSS (CSS Modules) with a modern Glassmorphism design system
- **Icons**: Lucide React
- **AI Integration**: `@google/generative-ai` (Gemini SDK)
- **Document Parsing**: 
  - `mammoth` (for DOCX)
  - `pdfjs-dist` (for PDF)

---

## 💡 How It Works (MVP Architecture)

This prototype operates entirely in the frontend for maximum speed and simplicity during the SIH 2026 internal rounds:
1. **Upload**: The user uploads a document.
2. **Extraction**: `documentParser.js` extracts the text in the browser.
3. **Analysis**: `geminiAnalyzer.js` prompts Gemini to categorize the text into a structured JSON format containing clauses and risk levels.
4. **Display**: The React UI consumes this JSON to populate the Dashboard, Clause Explorer, and Chatbot context.

---

*Built with ❤️ for SIH 2026*
