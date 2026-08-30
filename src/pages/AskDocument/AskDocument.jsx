import { useState, useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { MessageSquare, Send, FileText, BookOpen, Scale } from 'lucide-react';
import { useDocument } from '../../context/DocumentContext';
import { useLanguage } from '../../context/LanguageContext';
import { useTranslation } from '../../hooks/useTranslation';
import Helmet from '../../components/Helmet/Helmet';
import { GoogleGenerativeAI } from '@google/generative-ai';
import styles from './AskDocument.module.css';

// Initialize Gemini SDK with API key
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY || '');

const SUGGESTED_QUESTIONS = [
  'What is the termination clause?',
  'What are the penalties for delay?',
  'Who owns the intellectual property?',
  'What are the payment terms?',
];

export default function AskDocument() {
  const { doc } = useDocument();
  const location = useLocation();
  const { languageCode, currentLanguage } = useLanguage();
  const { t } = useTranslation();

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef(null);
  const inputRef = useRef(null);

  // Check for prefilled question from navigation (e.g. from ClauseExplorer)
  useEffect(() => {
    if (location.state?.prefill) {
      setInput(location.state.prefill);
    }
  }, [location.state]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSend = async (text) => {
    const question = text || input.trim();
    if (!question || isTyping) return;

    if (!import.meta.env.VITE_GEMINI_API_KEY) {
      setMessages(prev => [...prev, { role: 'user', text: question }]);
      setMessages(prev => [...prev, { role: 'ai', text: 'Error: VITE_GEMINI_API_KEY is not set in your .env.local file. Please add your key and restart the dev server.' }]);
      return;
    }

    setMessages(prev => [...prev, { role: 'user', text: question }]);
    setInput('');
    setIsTyping(true);

    try {
      const clauses = doc?.analysisData?.clauses || [];
      const documentContext = clauses.map(c => `[Section ${c.number}: ${c.title}]\n${c.originalText || c.text || ''}`).join('\n\n');
      
      const targetLangName = currentLanguage.name;

      const systemPrompt = `You are a helpful legal AI assistant for the ClauseWise app.
You are provided with the extracted clauses from a legal document.

STRICT MULTILINGUAL RULES:
1. Target Output Language: ${targetLangName} (${languageCode}). You MUST answer the user strictly in ${targetLangName}.
2. Mixed-Language Input: The user's question may be written in English, ${targetLangName}, or a mixed-language style (e.g., Hinglish, Marathlish, Gujlish, etc.). Understand the user's intent regardless of the input language, but ALWAYS respond in ${targetLangName}.
3. Factuality: Use ONLY the provided document clauses to answer. If the answer cannot be found in the provided document, politely state in ${targetLangName} that you cannot find the answer in the document. Do not invent facts.
4. Accuracy: Preserve all numbers, dates, monetary amounts (₹, $, %), and clause references accurately.

Document Clauses Context:
${documentContext}`;

      // Initialize model normally
      const dynamicModel = genAI.getGenerativeModel({ 
        model: "gemini-3.6-flash",
      });

      // Inject system prompt as the first interaction in history
      const historyMessages = [
        { role: 'user', parts: [{ text: systemPrompt }] },
        { role: 'model', parts: [{ text: `Understood. I will use ONLY the provided document clauses and respond strictly in ${targetLangName}.` }] },
        ...messages.map(m => ({
          role: m.role === 'ai' ? 'model' : 'user',
          parts: [{ text: m.text }],
        }))
      ];

      const chat = dynamicModel.startChat({
        history: historyMessages,
        generationConfig: {
          temperature: 0.2,
        }
      });

      const result = await chat.sendMessage(question);
      const aiResponse = result.response.text();
      
      setMessages(prev => [...prev, { role: 'ai', text: aiResponse }]);
    } catch (error) {
      console.error("Gemini API Error:", error);
      setMessages(prev => [...prev, { role: 'ai', text: 'Sorry, I encountered an error while trying to process your request. Please check your API key and try again.' }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const docName = doc?.fileName || 'Your Document';

  return (
    <div className={`${styles.page} page-enter`}>
      <Helmet
        title="Ask Document – ClauseWise"
        description="Ask natural-language questions about your legal document and get AI-powered, source-based answers."
      />

      {/* ── Abstract Background ───────────────────────────── */}
      <div className={styles.abstractBg} aria-hidden="true">
        <div className={`${styles.abstractOrb} ${styles.orb1}`} />
        <div className={`${styles.abstractOrb} ${styles.orb2}`} />
        <div className={`${styles.abstractOrb} ${styles.orb3}`} />
      </div>

      {/* ── Main Content ──────────────────────────────────── */}
      <div className={styles.content}>

        {/* Header */}
        <header className={styles.header}>
          <h1 className={styles.title}>
            {t('chatbot_title')}
          </h1>
          <p className={styles.subtitle}>
            {t('chatbot_subtitle')}
          </p>
        </header>

        {/* Document badge */}
        <div className={styles.docBadge}>
          <FileText size={14} strokeWidth={1.5} className={styles.docBadgeIcon} />
          <span>{docName}</span>
        </div>

        {/* Chat Area */}
        <div className={styles.chatArea}>
          {messages.length === 0 && !isTyping ? (
            /* Empty state */
            <div className={styles.emptyState}>
              <div className={styles.emptyIcon}>
                <MessageSquare size={24} strokeWidth={1.5} />
              </div>
              <h2 className={styles.emptyTitle}>{t('chatbot_empty_title')}</h2>
              <p className={styles.emptyHint}>
                {t('chatbot_empty_hint')}
              </p>
              <div className={styles.suggestions}>
                {[
                  t('suggested_q1'),
                  t('suggested_q2'),
                  t('suggested_q3'),
                  t('suggested_q4')
                ].map((q) => (
                  <button
                    key={q}
                    className={styles.suggestionChip}
                    onClick={() => handleSend(q)}
                    aria-label={`Ask: ${q}`}
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            /* Messages */
            <>
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`${styles.messageRow} ${msg.role === 'user' ? styles.messageRowUser : ''}`}
                >
                  <div className={`${styles.avatar} ${msg.role === 'ai' ? styles.avatarAi : styles.avatarUser}`}>
                    {msg.role === 'ai' ? <Scale size={14} /> : 'You'}
                  </div>
                  <div className={`${styles.bubble} ${msg.role === 'ai' ? styles.bubbleAi : styles.bubbleUser}`}>
                    {msg.text}
                    {msg.source && (
                      <div className={styles.sourceRef}>
                        <BookOpen size={10} strokeWidth={2} className={styles.sourceRefIcon} />
                        {msg.source}{msg.page ? ` · p.${msg.page}` : ''}
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {/* Typing indicator */}
              {isTyping && (
                <div className={styles.messageRow}>
                  <div className={`${styles.avatar} ${styles.avatarAi}`}>
                    <Scale size={14} />
                  </div>
                  <div className={styles.typingIndicator}>
                    <span className={styles.typingDot} />
                    <span className={styles.typingDot} />
                    <span className={styles.typingDot} />
                  </div>
                </div>
              )}

              <div ref={chatEndRef} />
            </>
          )}
        </div>

        {/* Input Area */}
        <div className={styles.inputArea}>
          <textarea
            ref={inputRef}
            className={styles.inputField}
            placeholder={t('ask_placeholder')}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            rows={1}
            aria-label={t('ask_question')}
          />
          <button
            className={styles.sendBtn}
            onClick={() => handleSend()}
            disabled={!input.trim() || isTyping}
            aria-label={t('send')}
          >
            <Send size={18} strokeWidth={2} />
          </button>
        </div>
      </div>
    </div>
  );
}
