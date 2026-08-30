import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FileText, Users, CheckSquare, Bookmark, Clock, ChevronRight, Loader } from 'lucide-react';
import Helmet from '../../components/Helmet/Helmet';
import { useDocument } from '../../context/DocumentContext';
import { useLanguage } from '../../context/LanguageContext';
import { useTranslation } from '../../hooks/useTranslation';
import { translateSummary } from '../../utils/clauseTranslator';
import styles from './Summary.module.css';

export default function Summary() {
  const { doc } = useDocument();
  const { languageCode } = useLanguage();
  const { t } = useTranslation();

  const data = doc?.analysisData;
  const baseSummary = data?.detailedSummary;

  const [activeSummary, setActiveSummary] = useState(baseSummary);
  const [isTranslating, setIsTranslating] = useState(false);

  useEffect(() => {
    let isCancelled = false;

    if (!baseSummary) return;

    if (languageCode === 'en') {
      setActiveSummary(baseSummary);
      setIsTranslating(false);
      return;
    }

    setIsTranslating(true);
    const docId = doc?.fileName || 'doc_default';

    translateSummary(baseSummary, languageCode, docId)
      .then((res) => {
        if (!isCancelled) {
          setActiveSummary(res);
          setIsTranslating(false);
        }
      })
      .catch((err) => {
        console.error("Summary translation error:", err);
        if (!isCancelled) {
          setActiveSummary(baseSummary);
          setIsTranslating(false);
        }
      });

    return () => {
      isCancelled = true;
    };
  }, [baseSummary, languageCode, doc?.fileName]);

  if (!data || !activeSummary) return null;

  return (
    <div className={`${styles.page} page-enter`}>
      <Helmet
        title="Document Summary – ClauseWise"
        description="A plain-English breakdown of your document's core terms, obligations, and parties."
      />

      <div className={styles.abstractBg} aria-hidden="true">
        <div className={`${styles.abstractOrb} ${styles.orb1}`} />
        <div className={`${styles.abstractOrb} ${styles.orb2}`} />
      </div>

      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        
        {/* Header Section */}
        <div className={styles.header}>
          <div className={styles.headerIcon}>
            <FileText size={28} strokeWidth={1.5} />
          </div>
          <div>
            <h1 className={styles.docType}>
              {activeSummary.documentClassification}
              {isTranslating && <Loader size={16} className={styles.spin} style={{ marginLeft: 10, verticalAlign: 'middle', color: 'var(--accent-gold)' }} />}
            </h1>
            <p className={styles.takeaway}>{activeSummary.simpleTakeaway}</p>
          </div>
        </div>

        {/* Content Grid */}
        <div className={styles.grid}>
          
          {/* Parties Involved */}
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <Users size={18} className={styles.icon} />
              <h2 className={styles.cardTitle}>{t('parties_involved')}</h2>
            </div>
            <ul className={styles.list}>
              {activeSummary.partiesInvolved?.map((party, i) => (
                <li key={i} className={styles.listItem}>{party}</li>
              ))}
            </ul>
          </div>

          {/* Key Obligations */}
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <CheckSquare size={18} className={styles.icon} />
              <h2 className={styles.cardTitle}>{t('key_obligations')}</h2>
            </div>
            <ul className={styles.list}>
              {activeSummary.keyObligations?.map((ob, i) => (
                <li key={i} className={styles.listItem}>{ob}</li>
              ))}
            </ul>
          </div>

          {/* Important Terms */}
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <Bookmark size={18} className={styles.icon} />
              <h2 className={styles.cardTitle}>{t('important_terms')}</h2>
            </div>
            <ul className={styles.list}>
              {activeSummary.importantTerms?.map((term, i) => (
                <li key={i} className={styles.listItem}>{term}</li>
              ))}
            </ul>
          </div>

          {/* Duration & Termination */}
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <Clock size={18} className={styles.icon} />
              <h2 className={styles.cardTitle}>{t('duration_termination')}</h2>
            </div>
            <p className={styles.textBlock}>{activeSummary.durationAndTermination}</p>
          </div>

        </div>

        {/* Ask Link */}
        <div className={styles.footerLink}>
          <Link to="/ask" className={styles.askBtn}>
            {t('ask_question')} <ChevronRight size={16} />
          </Link>
        </div>

      </div>
    </div>
  );
}
