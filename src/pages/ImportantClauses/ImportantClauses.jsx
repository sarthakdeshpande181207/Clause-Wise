import { useDocument } from '../../context/DocumentContext';
import { AlertTriangle, Shield, Info, CheckCircle } from 'lucide-react';
import Badge from '../../components/ui/Badge/Badge';
import Helmet from '../../components/Helmet/Helmet';
import styles from './ImportantClauses.module.css';

export default function ImportantClauses() {
  const { doc } = useDocument();
  
  // Filter only high and medium risk clauses
  const importantClauses = (doc?.analysisData?.clauses || []).filter(
    c => c.riskLevel === 'HIGH' || c.riskLevel === 'MEDIUM'
  );

  return (
    <div className={`${styles.page} page-enter`}>
      <Helmet
        title="Important Clauses – ClauseWise"
        description="Review critical and high-risk clauses in your document."
      />

      {/* Abstract Background */}
      <div className={styles.abstractBg} aria-hidden="true">
        <div className={`${styles.abstractOrb} ${styles.orb1}`} />
        <div className={`${styles.abstractOrb} ${styles.orb2}`} />
      </div>

      <div className={styles.container}>
        <header className={styles.header}>
          <h1 className={styles.title}>Important Clauses</h1>
          <p className={styles.subtitle}>
            Review the {importantClauses.length} clauses that require your attention.
          </p>
        </header>

        {importantClauses.length > 0 ? (
          <div className={styles.list}>
            {importantClauses.map((clause, i) => (
              <div 
                key={clause.id} 
                className={`${styles.card} step-enter stagger-${i + 1}`}
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <div className={styles.cardHeader}>
                  <div className={styles.meta}>
                    <Badge variant={clause.riskLevel} />
                    <span className={styles.category}>{clause.category}</span>
                    <span className={styles.num}>§ {clause.number}</span>
                  </div>
                </div>

                <h2 className={styles.clauseTitle}>{clause.title}</h2>
                <p className={styles.summary}>{clause.summary}</p>

                <div className={styles.analysisGrid}>
                  {clause.explanation && (
                    <div className={styles.analysisBox}>
                      <h4 className={styles.boxTitle}>
                        <Info size={14} /> Risk Explanation
                      </h4>
                      <p className={styles.boxText}>{clause.explanation}</p>
                    </div>
                  )}
                  {clause.recommendation && (
                    <div className={`${styles.analysisBox} ${styles.actionBox}`}>
                      <h4 className={styles.boxTitle}>
                        <CheckCircle size={14} /> Recommendation
                      </h4>
                      <p className={styles.boxText}>{clause.recommendation}</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>
              <CheckCircle size={48} strokeWidth={1} />
            </div>
            <h2>No Important Clauses</h2>
            <p>We didn't find any high or medium risk clauses in this document.</p>
          </div>
        )}
      </div>
    </div>
  );
}
