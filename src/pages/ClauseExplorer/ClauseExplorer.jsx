import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDocument } from '../../context/DocumentContext';
import { useLanguage } from '../../context/LanguageContext';
import { useTranslation } from '../../hooks/useTranslation';
import { translateClause } from '../../utils/clauseTranslator';
import { Search, Filter, ChevronRight, AlertTriangle, Shield, CheckCircle, Info, Globe, RefreshCw, MessageSquare, Lightbulb, Key } from 'lucide-react';
import Badge from '../../components/ui/Badge/Badge';
import Button from '../../components/ui/Button/Button';
import Helmet from '../../components/Helmet/Helmet';
import styles from './ClauseExplorer.module.css';

const ICONS = {
  HIGH: <AlertTriangle size={16} />,
  MEDIUM: <Shield size={16} />,
  LOW: <CheckCircle size={16} />
};

export default function ClauseExplorer() {
  const { doc } = useDocument();
  const location = useLocation();
  const navigate = useNavigate();
  const { languageCode, currentLanguage } = useLanguage();
  const { t } = useTranslation();

  const [selectedId, setSelectedId] = useState(null);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('ALL'); // ALL, HIGH, MEDIUM, LOW

  // Localized clause state
  const [localizedClause, setLocalizedClause] = useState(null);
  const [isTranslating, setIsTranslating] = useState(false);
  const [translationError, setTranslationError] = useState(false);

  const clauses = doc?.analysisData?.clauses || [];

  useEffect(() => {
    if (location.state?.selectedId) {
      setSelectedId(location.state.selectedId);
    } else if (clauses.length > 0 && !selectedId) {
      setSelectedId(clauses[0].id);
    }
  }, [location.state, clauses, selectedId]);

  const selectedClause = clauses.find(c => c.id === selectedId) || clauses[0];

  // Fetch translation whenever selected clause or language changes
  useEffect(() => {
    let isCancelled = false;

    if (!selectedClause) return;

    // Reset translation state
    setTranslationError(false);

    if (languageCode === 'en') {
      // Immediate English fallback — no async LLM call needed
      setLocalizedClause({
        title: selectedClause.title,
        simplified_explanation: selectedClause.simpleExplanation || selectedClause.summary,
        key_points: selectedClause.keyPoints || (selectedClause.meaningForUser ? [selectedClause.meaningForUser] : []),
        risk_explanation: selectedClause.riskRationale || selectedClause.explanation || '',
        user_action: selectedClause.recommendation || '',
      });
      setIsTranslating(false);
      return;
    }

    // Call Gemini for target language
    setIsTranslating(true);
    const docId = doc?.fileName || 'doc_default';

    translateClause(selectedClause, languageCode, docId)
      .then((res) => {
        if (!isCancelled) {
          setLocalizedClause(res);
          setIsTranslating(false);
        }
      })
      .catch((err) => {
        console.error("Translation error:", err);
        if (!isCancelled) {
          setTranslationError(true);
          setIsTranslating(false);
          // Fallback to English content on failure
          setLocalizedClause({
            title: selectedClause.title,
            simplified_explanation: selectedClause.simpleExplanation || selectedClause.summary,
            key_points: selectedClause.keyPoints || (selectedClause.meaningForUser ? [selectedClause.meaningForUser] : []),
            risk_explanation: selectedClause.riskRationale || selectedClause.explanation || '',
            user_action: selectedClause.recommendation || '',
          });
        }
      });

    return () => {
      isCancelled = true;
    };
  }, [selectedClause, languageCode, doc?.fileName]);

  const handleRetryTranslation = () => {
    if (!selectedClause) return;
    setTranslationError(false);
    setIsTranslating(true);
    const docId = doc?.fileName || 'doc_default';

    translateClause(selectedClause, languageCode, docId)
      .then((res) => {
        setLocalizedClause(res);
        setIsTranslating(false);
      })
      .catch(() => {
        setTranslationError(true);
        setIsTranslating(false);
      });
  };

  const filteredClauses = clauses.filter(c => {
    const matchesSearch = c.title.toLowerCase().includes(search.toLowerCase()) || 
                          (c.originalText || c.text || '').toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === 'ALL' || c.riskLevel === filter;
    return matchesSearch && matchesFilter;
  });

  if (!doc?.analysisData) return null;

  return (
    <div className={`${styles.page} page-enter`}>
      <Helmet
        title="Clause Explorer – ClauseWise"
        description="Explore and review all extracted clauses from your document."
      />

      {/* Abstract Background */}
      <div className={styles.abstractBg} aria-hidden="true">
        <div className={`${styles.abstractOrb} ${styles.orb1}`} />
        <div className={`${styles.abstractOrb} ${styles.orb2}`} />
      </div>

      <div className={styles.layout}>
        {/* SIDEBAR LIST */}
        <aside className={styles.sidebar}>
          <div className={styles.sidebarHeader}>
            <h2 className={styles.sidebarTitle}>{t('clause_explorer')}</h2>
            <div className={styles.searchBox}>
              <Search size={14} className={styles.searchIcon} />
              <input 
                type="text" 
                placeholder={t('search_clauses')} 
                className={styles.searchInput}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className={styles.filterGroup}>
              {['ALL', 'HIGH', 'MEDIUM', 'LOW'].map(f => (
                <button 
                  key={f}
                  className={`${styles.filterBtn} ${filter === f ? styles.activeFilter : ''}`}
                  onClick={() => setFilter(f)}
                >
                  {f === 'ALL' ? t('filter_all') : f === 'HIGH' ? t('filter_high') : f === 'MEDIUM' ? t('filter_medium') : t('filter_low')}
                </button>
              ))}
            </div>
          </div>
          <div className={styles.list}>
            {filteredClauses.map(clause => (
              <button
                key={clause.id}
                className={`${styles.listItem} ${selectedId === clause.id ? styles.activeItem : ''}`}
                onClick={() => setSelectedId(clause.id)}
              >
                <div className={styles.itemHeader}>
                  <Badge variant={clause.riskLevel} />
                  <span className={styles.itemNum}>§ {clause.number}</span>
                </div>
                <h3 className={styles.itemTitle}>{clause.title}</h3>
                <p className={styles.itemCategory}>{clause.category}</p>
              </button>
            ))}
          </div>
        </aside>

        {/* MAIN DETAIL PANE */}
        <main className={styles.main}>
          {selectedClause ? (
            <div className={styles.detailCard}>
              <header className={styles.detailHeader}>
                <div className={styles.detailMeta}>
                  <Badge variant={selectedClause.riskLevel} />
                  <span className={styles.detailCategory}>{selectedClause.category}</span>
                  <span className={styles.detailNum}>§ {selectedClause.number}</span>

                  {/* Language Indicator Badge */}
                  <div className={styles.langIndicator}>
                    <Globe size={12} />
                    <span>{currentLanguage.nativeName}</span>
                    {isTranslating && <span className={styles.translatingSpinner}>{t('translating')}</span>}
                  </div>
                </div>

                <h1 className={styles.detailTitle}>
                  {localizedClause?.title || selectedClause.title}
                </h1>
              </header>

              <div className={styles.detailContent}>
                {/* Translation failure warning bar */}
                {translationError && (
                  <div className={styles.translationErrorBar}>
                    <span>{t('translation_failed')}</span>
                    <button className={styles.retryBtn} onClick={handleRetryTranslation}>
                      <RefreshCw size={12} /> {t('retry')}
                    </button>
                  </div>
                )}

                {/* 1. ORIGINAL LEGAL TEXT (ALWAYS UNCHANGED & VERBATIM) */}
                <section className={styles.section}>
                  <h3 className={styles.sectionTitle}>📄 {t('original_text')}</h3>
                  <div className={styles.originalText}>
                    {selectedClause.originalText || selectedClause.text}
                  </div>
                </section>

                {/* 2. SIMPLIFIED EXPLANATION (LOCALIZED) */}
                <section className={styles.section}>
                  <h3 className={styles.sectionTitle}>
                    <Lightbulb size={14} className={styles.sectionTitleIcon} /> {t('simplified_explanation')}
                  </h3>
                  {isTranslating ? (
                    <div className={styles.translatingSkeleton}>
                      <div className={styles.skeletonLine} />
                      <div className={styles.skeletonLineShort} />
                    </div>
                  ) : (
                    <p className={styles.summaryText}>
                      {localizedClause?.simplified_explanation || selectedClause.summary}
                    </p>
                  )}
                </section>

                {/* 3. KEY POINTS (LOCALIZED) */}
                {localizedClause?.key_points && localizedClause.key_points.length > 0 && (
                  <section className={styles.section}>
                    <h3 className={styles.sectionTitle}>
                      <Key size={14} className={styles.sectionTitleIcon} /> {t('key_points')}
                    </h3>
                    <ul className={styles.keyPointsList}>
                      {localizedClause.key_points.map((pt, idx) => (
                        <li key={idx} className={styles.keyPointItem}>{pt}</li>
                      ))}
                    </ul>
                  </section>
                )}

                {/* 4. RISK EXPLANATION & RECOMMENDATION (LOCALIZED) */}
                {(localizedClause?.risk_explanation || localizedClause?.user_action || selectedClause.explanation || selectedClause.recommendation) && (
                  <div className={styles.analysisGrid}>
                    {(localizedClause?.risk_explanation || selectedClause.explanation) && (
                      <div className={styles.analysisBox}>
                        <h4 className={styles.boxTitle}>
                          <Info size={14} /> {t('risk_explanation')}
                        </h4>
                        <p className={styles.boxText}>
                          {localizedClause?.risk_explanation || selectedClause.explanation}
                        </p>
                      </div>
                    )}
                    {(localizedClause?.user_action || selectedClause.recommendation) && (
                      <div className={`${styles.analysisBox} ${styles.actionBox}`}>
                        <h4 className={styles.boxTitle}>
                          <CheckCircle size={14} /> {t('recommendation')}
                        </h4>
                        <p className={styles.boxText}>
                          {localizedClause?.user_action || selectedClause.recommendation}
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* 5. ASK ABOUT THIS CLAUSE ACTION */}
                <div className={styles.clauseActions}>
                  <button
                    className={styles.askClauseBtn}
                    onClick={() => navigate('/ask', { state: { prefill: `Tell me more about section ${selectedClause.number}: ${selectedClause.title}` } })}
                  >
                    <MessageSquare size={16} /> {t('ask_question')}
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className={styles.emptyState}>
              <p>No clauses match your search criteria.</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
