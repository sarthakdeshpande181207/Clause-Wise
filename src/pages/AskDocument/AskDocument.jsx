import { useState, useRef, useEffect } from 'react';
import { MessageSquare, Send, FileText, BookOpen, Scale } from 'lucide-react';
import { useDocument } from '../../context/DocumentContext';
import Helmet from '../../components/Helmet/Helmet';
import styles from './AskDocument.module.css';

/* ── Mock Q&A pairs for demo ──────────────────────────────── */
const MOCK_ANSWERS = {
  'what is the termination clause': {
    text: 'The agreement automatically renews for successive 1-year terms unless either party provides written notice of non-renewal at least 90 days before expiry. Notice must be sent via registered mail — email or verbal notice is not sufficient.',
    source: 'Section 12.2 — Automatic Contract Renewal',
    page: 15,
  },
  'what are the penalties for delay': {
    text: 'If TechBuilder Inc fails to deliver any milestone on time, liquidated damages of $5,000 per calendar day of delay apply, capped at 30% of the total contract value. On a $200,000 contract, this means up to $60,000 in penalties.',
    source: 'Section 6.2 — Liquidated Damages for Delay',
    page: 8,
  },
  'who owns the intellectual property': {
    text: 'The Service Provider irrevocably assigns all right, title, and interest in all deliverables to the Client, including all intellectual property rights "throughout the universe, in perpetuity." This includes code, designs, inventions, and improvements.',
    source: 'Section 4.1 — Intellectual Property Assignment',
    page: 5,
  },
  'what are the payment terms': {
    text: 'The Client shall pay each invoice within 45 days of receipt (Net-45). Late payments accrue 1.5% monthly interest. The Service Provider may suspend services after 30 days of non-payment.',
    source: 'Section 5.1 — Payment Terms',
    page: 7,
  },
};

const SUGGESTED_QUESTIONS = [
  'What is the termination clause?',
  'What are the penalties for delay?',
  'Who owns the intellectual property?',
  'What are the payment terms?',
];

function findMockAnswer(question) {
  const q = question.toLowerCase().replace(/[?!.,]/g, '').trim();
  for (const [key, value] of Object.entries(MOCK_ANSWERS)) {
    if (q.includes(key) || key.includes(q)) return value;
  }
  return {
    text: `Based on the document analysis, I couldn't find a specific clause matching your question. Try asking about termination, penalties, IP ownership, or payment terms.`,
    source: null,
    page: null,
  };
}

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

  const handleSend = (text) => {
    const question = text || input.trim();
    if (!question || isTyping) return;

    /* Add user message */
    setMessages(prev => [...prev, { role: 'user', text: question }]);
    setInput('');
    setIsTyping(true);

    /* Simulate AI response delay */
    setTimeout(() => {
      const answer = findMockAnswer(question);
      setMessages(prev => [...prev, { role: 'ai', ...answer }]);
      setIsTyping(false);
    }, 1200 + Math.random() * 800);
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
