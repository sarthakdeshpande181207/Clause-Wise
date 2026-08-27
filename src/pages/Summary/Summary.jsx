import { Link } from 'react-router-dom';
import { FileText, Users, CheckSquare, Bookmark, Clock, ChevronRight } from 'lucide-react';
import Helmet from '../../components/Helmet/Helmet';
import { useDocument } from '../../context/DocumentContext';
import styles from './Summary.module.css';

export default function Summary() {
  const { doc } = useDocument();
  const data = doc.analysisData;
  if (!data) return null;

  const { detailedSummary } = data;

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
            <h1 className={styles.docType}>{detailedSummary.documentClassification}</h1>
            <p className={styles.takeaway}>{detailedSummary.simpleTakeaway}</p>
          </div>
        </div>

        {/* Content Grid */}
        <div className={styles.grid}>
          
          {/* Parties Involved */}
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <Users size={18} className={styles.icon} />
              <h2 className={styles.cardTitle}>Parties Involved</h2>
            </div>
            <ul className={styles.list}>
              {detailedSummary.partiesInvolved.map((party, i) => (
                <li key={i} className={styles.listItem}>{party}</li>
              ))}
            </ul>
          </div>

          {/* Key Obligations */}
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <CheckSquare size={18} className={styles.icon} />
              <h2 className={styles.cardTitle}>Key Obligations</h2>
            </div>
            <ul className={styles.list}>
              {detailedSummary.keyObligations.map((ob, i) => (
                <li key={i} className={styles.listItem}>{ob}</li>
              ))}
            </ul>
          </div>

          {/* Important Terms */}
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <Bookmark size={18} className={styles.icon} />
              <h2 className={styles.cardTitle}>Important Terms</h2>
            </div>
            <ul className={styles.list}>
              {detailedSummary.importantTerms.map((term, i) => (
                <li key={i} className={styles.listItem}>{term}</li>
              ))}
            </ul>
          </div>

          {/* Duration & Termination */}
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <Clock size={18} className={styles.icon} />
              <h2 className={styles.cardTitle}>Duration & Termination</h2>
            </div>
            <p className={styles.textBlock}>{detailedSummary.durationAndTermination}</p>
          </div>

        </div>

        {/* Ask Link */}
        <div className={styles.footerLink}>
          <p>Have questions about this summary?</p>
          <Link to="/ask" className={styles.askBtn}>
            Ask the Document <ChevronRight size={16} />
          </Link>
        </div>

      </div>
    </div>
  );
}
