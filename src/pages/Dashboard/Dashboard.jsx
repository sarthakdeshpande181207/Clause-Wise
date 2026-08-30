import { Link } from 'react-router-dom';
import { FileText, AlertTriangle, Calendar, Users, ChevronRight, Download, Trash2 } from 'lucide-react';
import Badge from '../../components/ui/Badge/Badge';
import Button from '../../components/ui/Button/Button';
import Helmet from '../../components/Helmet/Helmet';
import { useDocument } from '../../context/DocumentContext';
import { useTranslation } from '../../hooks/useTranslation';
import styles from './Dashboard.module.css';

function formatDate(iso) {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export default function Dashboard() {
  const { doc } = useDocument();
  const { t } = useTranslation();
  const data = doc.analysisData;
  if (!data) return null;

  const { stats, keyDates, clauses } = data;
  const topClauses = clauses.filter(c => c.riskLevel === 'HIGH').slice(0, 3);

  return (
    <div className={`${styles.page} page-enter`}>
      <Helmet
        title="Dashboard – ClauseWise"
        description="View your document analysis results — clause breakdown, risk assessment, key dates, and more."
      />

      {/* Abstract Background */}
      <div className={styles.abstractBg} aria-hidden="true">
        <div className={`${styles.abstractOrb} ${styles.orb1}`} />
        <div className={`${styles.abstractOrb} ${styles.orb2}`} />
        <div className={`${styles.abstractOrb} ${styles.orb3}`} />
      </div>

      <div className="container" style={{ position: 'relative', zIndex: 1 }}>

        {/* ── DOCUMENT HEADER ──────────────────────────── */}
        <div className={styles.docHeader}>
          <div className={styles.docIcon}>
            <FileText size={20} strokeWidth={1.5} />
          </div>
          <div className={styles.docMeta}>
            <h1 className={styles.docName}>{data.documentName}</h1>
            <div className={styles.docTags}>
              <span className={styles.docType}>{data.documentType}</span>
              <span className={styles.docStat}>{data.pageCount} {t('pages')}</span>
              <span className={styles.docStat}>{data.wordCount.toLocaleString()} {t('words')}</span>
              <span className={styles.docStat}>{formatDate(data.uploadDate)}</span>
            </div>
          </div>
          <div className={styles.docActions}>
            <Button variant="ghost" size="sm"><Download size={14} /> {t('export')}</Button>
            <Button variant="danger" size="sm"><Trash2 size={14} /> {t('delete')}</Button>
          </div>
        </div>

        {/* ── STAT CARDS ───────────────────────────────── */}
        <div className={styles.statGrid}>
          {[
            { icon: FileText,      label: t('total_clauses'), value: stats.totalClauses, accent: '' },
            { icon: AlertTriangle, label: t('high_risk'),     value: stats.highRisk,     accent: 'high' },
            { icon: Calendar,      label: t('key_dates'),     value: stats.keyDates,     accent: '' },
            { icon: Users,         label: t('parties'),       value: data.parties.length, accent: '' },
          ].map(({ icon: Icon, label, value, accent }) => (
            <div key={label} className={`${styles.statCard} ${accent === 'high' ? styles.statHigh : ''}`}>
              <Icon size={16} strokeWidth={1.5} className={styles.statIcon} />
              <span className={styles.statValue}>{value}</span>
              <span className={styles.statLabel}>{label}</span>
            </div>
          ))}
        </div>

        <div className={styles.twoCol}>
          {/* ── HIGH RISK CLAUSES PREVIEW ─────────────── */}
          <div className={styles.section}>
            <div className={styles.sectionHead}>
              <h2 className={styles.sectionTitle}>{t('high_risk_clauses')}</h2>
              <Link to="/important-clauses" className={styles.viewAll}>{t('view_all')} <ChevronRight size={14} /></Link>
            </div>
            <div className={styles.clauseList}>
              {topClauses.map(clause => (
                <Link to="/clauses" key={clause.id} className={styles.clauseCard} state={{ selectedId: clause.id }}>
                  <div className={styles.clauseLeft}>
                    <Badge variant={clause.riskLevel} />
                    <div>
                      <p className={styles.clauseTitle}>{clause.title}</p>
                      <p className={styles.clauseNum}>§ {clause.number} · {clause.category}</p>
                    </div>
                  </div>
                  <ChevronRight size={14} className={styles.clauseArrow} />
                </Link>
              ))}
            </div>
          </div>

          {/* ── KEY DATES ────────────────────────────────── */}
          <div className={styles.section}>
            <div className={styles.sectionHead}>
              <h2 className={styles.sectionTitle}>{t('key_dates')}</h2>
            </div>
            <div className={styles.dateList}>
              {keyDates.map(kd => (
                <div key={kd.id} className={styles.dateRow}>
                  <div className={`${styles.dateDot} ${styles[kd.urgency]}`} />
                  <div className={styles.dateInfo}>
                    <p className={styles.dateEvent}>{kd.event}</p>
                    <p className={styles.dateMeta}>{kd.section} · p.{kd.page}</p>
                  </div>
                  <span className={`${styles.dateVal} ${styles[kd.urgency]}`}>
                    {formatDate(kd.date)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── QUICK ASK ────────────────────────────────── */}
        <div className={styles.quickAsk}>
          <p className={styles.quickAskLabel}>{t('quick_ask')}</p>
          <Link to="/ask" className={styles.quickAskInput}>
            <span className={styles.quickAskPlaceholder}>{t('quick_ask_placeholder')}</span>
            <ChevronRight size={16} className={styles.quickAskArrow} />
          </Link>
        </div>

      </div>
    </div>
  );
}
