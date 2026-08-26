import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useDocument } from '../../context/DocumentContext';
import { Search, Filter, ChevronRight, AlertTriangle, Shield, CheckCircle, Info } from 'lucide-react';
import Badge from '../../components/ui/Badge/Badge';
import Button from '../../components/ui/Button/Button';
import styles from './ClauseExplorer.module.css';

const ICONS = {
  HIGH: <AlertTriangle size={16} />,
  MEDIUM: <Shield size={16} />,
  LOW: <CheckCircle size={16} />
};

export default function ClauseExplorer() {
  const { doc } = useDocument();
  const location = useLocation();
  const [selectedId, setSelectedId] = useState(null);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('ALL'); // ALL, HIGH, MEDIUM, LOW

  const clauses = doc?.analysisData?.clauses || [];

  useEffect(() => {
    if (location.state?.selectedId) {
      setSelectedId(location.state.selectedId);
    } else if (clauses.length > 0 && !selectedId) {
      setSelectedId(clauses[0].id);
    }
  }, [location.state, clauses, selectedId]);

  const filteredClauses = clauses.filter(c => {
    const matchesSearch = c.title.toLowerCase().includes(search.toLowerCase()) || 
                          c.text.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === 'ALL' || c.riskLevel === filter;
    return matchesSearch && matchesFilter;
  });

  const selectedClause = clauses.find(c => c.id === selectedId) || clauses[0];

  if (!doc?.analysisData) return null;

  return (
    <div className={`${styles.page} page-enter`}>
      <div className={styles.layout}>
        {/* SIDEBAR LIST */}
        <aside className={styles.sidebar}>
          <div className={styles.sidebarHeader}>
            <h2 className={styles.sidebarTitle}>Clause Explorer</h2>
            <div className={styles.searchBox}>
              <Search size={14} className={styles.searchIcon} />
              <input 
                type="text" 
                placeholder="Search clauses..." 
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
                  {f === 'ALL' ? 'All' : f}
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
                </div>
                <h1 className={styles.detailTitle}>{selectedClause.title}</h1>
              </header>

              <div className={styles.detailContent}>
                <section className={styles.section}>
                  <h3 className={styles.sectionTitle}>Original Text</h3>
                  <div className={styles.originalText}>
                    {selectedClause.text}
                  </div>
                </section>

                <section className={styles.section}>
                  <h3 className={styles.sectionTitle}>Plain English Summary</h3>
                  <p className={styles.summaryText}>{selectedClause.summary}</p>
                </section>

                {(selectedClause.explanation || selectedClause.recommendation) && (
                  <div className={styles.analysisGrid}>
                    {selectedClause.explanation && (
                      <div className={styles.analysisBox}>
                        <h4 className={styles.boxTitle}>
                          <Info size={14} /> Risk Explanation
                        </h4>
                        <p className={styles.boxText}>{selectedClause.explanation}</p>
                      </div>
                    )}
                    {selectedClause.recommendation && (
                      <div className={`${styles.analysisBox} ${styles.actionBox}`}>
                        <h4 className={styles.boxTitle}>
                          <CheckCircle size={14} /> Recommendation
                        </h4>
                        <p className={styles.boxText}>{selectedClause.recommendation}</p>
                      </div>
                    )}
                  </div>
                )}
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
