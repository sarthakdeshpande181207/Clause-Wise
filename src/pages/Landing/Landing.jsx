import { Link } from 'react-router-dom';
import { Scale, FileText, AlertTriangle, MessageSquare, ChevronRight, Lock, Clock, Shield, Search, CheckCircle } from 'lucide-react';
import Button from '../../components/ui/Button/Button';
import styles from './Landing.module.css';
import Helmet from '../../components/Helmet/Helmet';
const FEATURES = [
  {
    icon: FileText,
    title: 'Simple Explanations',
    desc: 'Turn complex legal jargon into clear, understandable explanations.',
  },
  {
    icon: AlertTriangle,
    title: 'Important Clauses',
    desc: 'Quickly identify penalties, termination terms, renewals, and obligations.',
  },
  {
    icon: MessageSquare,
    title: 'Ask Your Document',
    desc: 'Ask questions in natural language and get answers based on your document.',
  },
  {
    icon: Search,
    title: 'Source-Based Answers',
    desc: 'See the exact clause and page supporting each generated answer.',
  },
];

const TRUST_MARKERS = [
  { icon: FileText, label: 'PDF / DOCX' },
  { icon: Shield, label: 'Secure processing' },
  { icon: CheckCircle, label: 'Document-based answers' },
];

export default function Landing() {
  return (
    <div className={`${styles.page} page-enter`}>
<Helmet title="ClauseWise – Landing" description="Understand legal documents with clarity before you sign." />
      {/* ── HERO ──────────────────────────────────────────── */}
      <section className={styles.hero}>
        <div className="container">
          <div className={styles.heroInner}>
            
            <div className={styles.heroPill}>
              <span className={styles.heroPillDot} />
              Conversational Legal Document Simplifier
            </div>

            <h1 className={styles.heroHeadline}>
              Understand what you're agreeing to.<br />
              <span className={styles.heroAccent}>Before you sign.</span>
            </h1>

            <p className={styles.heroSub}>
              Make complex legal documents easier to understand, identify important clauses, and ask questions in plain language.
            </p>

            <div className={styles.heroCTAs}>
              <Link to="/upload">
                <Button variant="primary" size="lg">
                  Upload a Document
                </Button>
              </Link>
              <Button variant="ghost" size="lg" className={styles.ghostBtn} onClick={(e)=>{e.preventDefault(); document.getElementById('how-it-works')?.scrollIntoView({behavior:'smooth'});}} aria-label="See How It Works">
                  See How It Works <ChevronRight size={18} />
                </Button>
            </div>

            <div className={styles.trustMarkers}>
              {TRUST_MARKERS.map((marker, i) => (
                <div key={i} className={styles.trustMarker}>
                  <marker.icon size={16} strokeWidth={1.5} />
                  <span>{marker.label}</span>
                </div>
              ))}
            </div>

            {/* Mock Dashboard / Document Preview */}
            <div className={styles.heroVisual} aria-hidden="true">
              <div className={styles.docMockWrapper}>
                <div className={styles.mockHeader}>
                  <div className={styles.mockIcon}><FileText size={20} strokeWidth={1.5} /></div>
                  <div className={styles.mockMeta}>
                    <span className={styles.mockTitle}>Service_Agreement_Final.pdf</span>
                    <span className={styles.mockSubtitle}>Verified Analysis Preview</span>
                  </div>
                  <div className={styles.mockLink}>Explore Sample <ChevronRight size={14} /></div>
                </div>
                
                <div className={styles.mockStatsRow}>
                  <div className={styles.mockStatCard}>
                    <span className={styles.mockStatNum}>27</span>
                    <span className={styles.mockStatLabel}>Clauses Extracted</span>
                  </div>
                  <div className={styles.mockStatCardWarning}>
                    <span className={styles.mockStatNumWarning}>5</span>
                    <span className={styles.mockStatLabel}>Important Clauses</span>
                  </div>
                  <div className={styles.mockStatCardDanger}>
                    <span className={styles.mockStatNumDanger}>2</span>
                    <span className={styles.mockStatLabel}>High Attention</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── FEATURES ──────────────────────────────────────── */}
      <section className={styles.features} id="how-it-works">
        <div className="container">
          <div className={styles.sectionHeaderCentered}>
            <h2 className={styles.sectionTitleCentered}>Built for clarity and transparency</h2>
            <p className={styles.sectionSubCentered}>
              Designed specifically for ordinary people navigating complex agreements without legal jargon.
            </p>
          </div>

          <div className={styles.featureGrid}>
            {FEATURES.map(({ icon: Icon, title, desc }) => (
              <div key={title} className={styles.featureCard}>
                <div className={styles.featureIconWrap}>
                  <Icon size={22} strokeWidth={1.5} />
                </div>
                <h3 className={styles.featureTitle}>{title}</h3>
                <p className={styles.featureDesc}>"{desc}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FOOTER ────────────────────────────────────────── */}
      <footer className={styles.footer}>
        <div className="container">
          <div className={styles.footerInner}>
            <div className={styles.footerLogo}>
              <Scale size={18} strokeWidth={1.5} className={styles.footerIcon} />
              <span>ClauseWise</span>
            </div>
            <div className={styles.footerLinks}>
              <Link to="/privacy">Privacy &amp; Terms of Service</Link>
            </div>
          </div>
          <p className={styles.footerDisclaimer}>
            ClauseWise does not provide legal advice. Analysis is for informational purposes only and should not be relied upon as a substitute for advice from a qualified legal professional.
          </p>
        </div>
      </footer>
    </div>
  );
}
