import { useState, useRef, useEffect } from 'react';
import { MessageSquare, Send, FileText, BookOpen, Scale } from 'lucide-react';
import { useDocument } from '../../context/DocumentContext';
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
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef(null);
  const inputRef = useRef(null);

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
      
      const systemPrompt = `You are a helpful legal AI assistant for the ClauseWise app. 
You will be provided with the extracted clauses from a legal document. 
Use ONLY the provided document clauses to answer the user's questions. 
If the answer cannot be found in the provided document, politely state that you cannot find the answer in the document. Do not invent answers.

Document Clauses:
${documentContext}`;

      // Initialize model normally
      const dynamicModel = genAI.getGenerativeModel({ 
        model: "gemini-3.6-flash",
      });

      // Inject system prompt as the first interaction in history
      const historyMessages = [
        { role: 'user', parts: [{ text: systemPrompt }] },
        { role: 'model', parts: [{ text: "Understood. I will use ONLY the provided document clauses to answer your questions." }] },
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
            Ask Your <span className={styles.titleAccent}>Document</span>
          </h1>
          <p className={styles.subtitle}>
            Get instant, source-based answers from your uploaded legal document.
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
              <h2 className={styles.emptyTitle}>Start a conversation</h2>
              <p className={styles.emptyHint}>
                Ask any question about your document in plain language. Answers are grounded in the actual clauses.
              </p>
              <div className={styles.suggestions}>
                {SUGGESTED_QUESTIONS.map((q) => (
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
            placeholder="Ask a question about your document..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            rows={1}
            aria-label="Ask a question"
          />
          <button
            className={styles.sendBtn}
            onClick={() => handleSend()}
            disabled={!input.trim() || isTyping}
            aria-label="Send question"
          >
            <Send size={18} strokeWidth={2} />
          </button>
        </div>
      </div>
    </div>
  );
}
