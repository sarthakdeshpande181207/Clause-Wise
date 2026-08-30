import { Link } from 'react-router-dom';
import { Scale, FileText, AlertTriangle, MessageSquare, ChevronRight, Lock, Clock, Shield, Search, CheckCircle } from 'lucide-react';
import Button from '../../components/ui/Button/Button';
import styles from './Landing.module.css';
import Helmet from '../../components/Helmet/Helmet';
import { useTranslation } from '../../hooks/useTranslation';
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
  const { t } = useTranslation();

  const FEATURES = [
    {
      icon: FileText,
      title: t('feature1_title'),
      desc: t('feature1_desc'),
    },
    {
      icon: AlertTriangle,
      title: t('feature2_title'),
      desc: t('feature2_desc'),
    },
    {
      icon: MessageSquare,
      title: t('feature3_title'),
      desc: t('feature3_desc'),
    },
    {
      icon: Search,
      title: t('feature4_title'),
      desc: t('feature4_desc'),
    },
  ];

  const TRUST_MARKERS = [
    { icon: FileText, label: 'PDF / DOCX' },
    { icon: Shield, label: t('secure_processing') },
    { icon: CheckCircle, label: t('doc_based_answers') },
  ];

  return (
    <div className={`${styles.page} page-enter`}>
      <Helmet title={`ClauseWise – ${t('hero_pill')}`} description={t('hero_sub')} />
      {/* ── HERO ──────────────────────────────────────────── */}
      <section className={styles.hero}>
        <div className="container">
          <div className={styles.heroInner}>
            
            <div className={styles.heroPill}>
              <span className={styles.heroPillDot} />
              {t('hero_pill')}
            </div>

            <h1 className={styles.heroHeadline}>
              {t('hero_headline')}<br />
              <span className={styles.heroAccent}>{t('hero_accent')}</span>
            </h1>

            <p className={styles.heroSub}>
              {t('hero_sub')}
            </p>

            <div className={styles.heroCTAs}>
              <Link to="/upload">
                <Button variant="primary" size="lg">
                  {t('upload_a_document')}
                </Button>
              </Link>
              <Button variant="ghost" size="lg" className={styles.ghostBtn} onClick={(e)=>{e.preventDefault(); document.getElementById('how-it-works')?.scrollIntoView({behavior:'smooth'});}} aria-label="See How It Works">
                  {t('see_how_it_works')} <ChevronRight size={18} />
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
                    <span className={styles.mockSubtitle}>{t('sample_preview')}</span>
                  </div>
                  <div className={styles.mockLink}>{t('explore_sample')} <ChevronRight size={14} /></div>
                </div>
                
                <div className={styles.mockStatsRow}>
                  <div className={styles.mockStatCard}>
                    <span className={styles.mockStatNum}>27</span>
                    <span className={styles.mockStatLabel}>{t('clauses_extracted')}</span>
                  </div>
                  <div className={styles.mockStatCardWarning}>
                    <span className={styles.mockStatNumWarning}>5</span>
                    <span className={styles.mockStatLabel}>{t('important_clauses')}</span>
                  </div>
                  <div className={styles.mockStatCardDanger}>
                    <span className={styles.mockStatNumDanger}>2</span>
                    <span className={styles.mockStatLabel}>{t('high_attention')}</span>
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
            <h2 className={styles.sectionTitleCentered}>{t('clarity_title')}</h2>
            <p className={styles.sectionSubCentered}>
              {t('clarity_sub')}
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
              <Link to="/privacy">{t('privacy_terms')}</Link>
            </div>
          </div>
          <p className={styles.footerDisclaimer}>
            {t('footer_disclaimer')}
          </p>
        </div>
      </footer>
    </div>
  );
}
