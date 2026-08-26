import { Shield, Lock, Server, Trash2, Mail, Scale, FileText, AlertTriangle, UserCheck, Gavel } from 'lucide-react';
import { Link } from 'react-router-dom';
import Helmet from '../../components/Helmet/Helmet';
import styles from './Privacy.module.css';

const LAST_UPDATED = 'August 26, 2026';

const PRIVACY_SECTIONS = [
  {
    icon: Shield,
    title: 'What We Collect',
    items: [
      { bold: 'Document content', text: 'Text extracted from your uploaded PDF, DOCX, or TXT file — used solely for analysis.' },
      { bold: 'Usage metadata', text: 'Anonymous interaction data such as page views and feature usage to improve our service.' },
      { bold: 'No personal data', text: 'We do not require accounts, emails, or personal identifiers to use ClauseWise.' },
    ],
  },
  {
    icon: Lock,
    title: 'How We Protect Your Data',
    items: [
      { bold: 'End-to-end encryption', text: 'All file uploads are transmitted over TLS 1.3 encrypted connections.' },
      { bold: 'Isolated processing', text: 'Each document is analyzed in a sandboxed environment with no cross-session data leakage.' },
      { bold: 'No third-party sharing', text: 'Your documents are never shared with, sold to, or accessed by third parties.' },
    ],
  },
  {
    icon: Server,
    title: 'Data Storage & Retention',
    items: [
      { bold: 'In-memory processing', text: 'Documents are processed in memory and are not written to persistent storage.' },
      { bold: 'Session-based', text: 'Analysis results exist only for the duration of your browser session.' },
      { bold: 'No server-side logs', text: 'We do not log or store the textual content of your uploaded documents.' },
    ],
  },
  {
    icon: Trash2,
    title: 'Data Deletion',
    items: [
      { bold: 'Automatic cleanup', text: 'All document data is purged when you close your browser tab or navigate away.' },
      { bold: 'Manual deletion', text: 'Clear your current document at any time using the "Clear Document" action.' },
      { bold: 'No recovery', text: 'Once deleted, document data cannot be recovered by us or anyone else.' },
    ],
  },
];

const TERMS_SECTIONS = [
  {
    icon: FileText,
    title: 'Service Description',
    items: [
      { bold: 'AI-powered analysis', text: 'ClauseWise uses artificial intelligence to extract, categorize, and explain clauses from legal documents.' },
      { bold: 'Informational only', text: 'All analysis output is for informational purposes and does not constitute legal advice.' },
      { bold: 'Accuracy disclaimer', text: 'While we strive for accuracy, AI-generated outputs may contain errors. Always consult a qualified legal professional.' },
    ],
  },
  {
    icon: UserCheck,
    title: 'User Responsibilities',
    items: [
      { bold: 'Lawful use', text: 'You agree to use ClauseWise only for lawful purposes and in compliance with applicable laws.' },
      { bold: 'Document ownership', text: 'You must have the legal right to upload and analyze any document you submit.' },
      { bold: 'No misrepresentation', text: 'Do not present AI-generated analysis as professional legal advice to third parties.' },
    ],
  },
  {
    icon: AlertTriangle,
    title: 'Limitation of Liability',
    items: [
      { bold: 'No warranties', text: 'ClauseWise is provided "as is" without warranties of any kind, express or implied.' },
      { bold: 'No liability for decisions', text: 'We are not liable for any decisions made based on the analysis provided by our service.' },
      { bold: 'Maximum liability', text: 'Our total liability shall not exceed the amount you paid to use the service (currently free).' },
    ],
  },
  {
    icon: Gavel,
    title: 'Governing Law',
    items: [
      { bold: 'Jurisdiction', text: 'These terms are governed by the laws of India, without regard to conflict of law provisions.' },
      { bold: 'Dispute resolution', text: 'Any disputes shall be resolved through binding arbitration in the jurisdiction of New Delhi, India.' },
      { bold: 'Severability', text: 'If any provision is found unenforceable, the remaining provisions shall continue in full force.' },
    ],
  },
];

export default function Privacy() {
  return (
    <div className={`${styles.page} page-enter`}>
      <Helmet
        title="Privacy & Terms of Service – ClauseWise"
        description="Learn how ClauseWise handles your documents, protects your privacy, and the terms governing use of our service."
      />

      {/* Abstract Background */}
      <div className={styles.abstractBg} aria-hidden="true">
        <div className={`${styles.abstractOrb} ${styles.orb1}`} />
        <div className={`${styles.abstractOrb} ${styles.orb2}`} />
      </div>

      <div className={styles.content}>
        {/* Hero Header */}
        <header className={styles.header}>
          <div className={styles.headerIcon}>
            <Shield size={24} strokeWidth={1.5} />
          </div>
          <h1 className={styles.title}>Privacy & Terms of Service</h1>
          <p className={styles.subtitle}>
            Your documents stay yours. We built ClauseWise with privacy as a first principle — no accounts, no tracking, no data retention.
          </p>
          <span className={styles.lastUpdated}>Last updated: {LAST_UPDATED}</span>
        </header>

        {/* ── Privacy Policy ──────────────────────────────── */}
        <div className={styles.policyBlock}>
          <div className={styles.blockLabel}>
            <Lock size={14} strokeWidth={2} />
            <span>Privacy Policy</span>
          </div>

          <div className={styles.sections}>
            {PRIVACY_SECTIONS.map(({ icon: Icon, title, items }, i) => (
              <section key={title} className={styles.section} style={{ animationDelay: `${i * 60}ms` }}>
                <div className={styles.sectionHeader}>
                  <div className={styles.sectionIcon}>
                    <Icon size={16} strokeWidth={1.5} />
                  </div>
                  <h2 className={styles.sectionTitle}>{title}</h2>
                </div>
                <ul className={styles.list}>
                  {items.map(({ bold, text }) => (
                    <li key={bold} className={styles.listItem}>
                      <strong>{bold}</strong> — {text}
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>
        </div>

        {/* ── Terms of Service ────────────────────────────── */}
        <div className={styles.policyBlock}>
          <div className={styles.blockLabel}>
            <Gavel size={14} strokeWidth={2} />
            <span>Terms of Service</span>
          </div>

          <div className={styles.sections}>
            {TERMS_SECTIONS.map(({ icon: Icon, title, items }, i) => (
              <section key={title} className={styles.section} style={{ animationDelay: `${(i + PRIVACY_SECTIONS.length) * 60}ms` }}>
                <div className={styles.sectionHeader}>
                  <div className={styles.sectionIcon}>
                    <Icon size={16} strokeWidth={1.5} />
                  </div>
                  <h2 className={styles.sectionTitle}>{title}</h2>
                </div>
                <ul className={styles.list}>
                  {items.map(({ bold, text }) => (
                    <li key={bold} className={styles.listItem}>
                      <strong>{bold}</strong> — {text}
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>
        </div>

        {/* ── Contact ─────────────────────────────────────── */}
        <div className={styles.contactCard}>
          <Mail size={18} strokeWidth={1.5} className={styles.contactIcon} />
          <div>
            <h3 className={styles.contactTitle}>Questions?</h3>
            <p className={styles.contactText}>
              Reach out at <a href="mailto:privacy@clausewise.app" className={styles.contactLink}>privacy@clausewise.app</a> — we respond within 48 hours.
            </p>
          </div>
        </div>

        {/* Footer */}
        <footer className={styles.footer}>
          <div className={styles.footerInner}>
            <div className={styles.footerLogo}>
              <Scale size={16} strokeWidth={1.5} />
              <span>ClauseWise</span>
            </div>
            <Link to="/" className={styles.footerLink}>← Back to Home</Link>
          </div>
          <p className={styles.disclaimer}>
            ClauseWise does not provide legal advice. This page is for informational purposes and describes how the application handles user-uploaded documents and the terms governing its use.
          </p>
        </footer>
      </div>
    </div>
  );
}
