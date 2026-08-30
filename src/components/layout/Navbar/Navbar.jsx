import { Link, useLocation } from 'react-router-dom';
import { Scale } from 'lucide-react';
import ThemeToggle from '../ThemeToggle/ThemeToggle';
import LanguageSelector from '../LanguageSelector/LanguageSelector';
import Button from '../../ui/Button/Button';
import { useDocument } from '../../../context/DocumentContext';
import { useTranslation } from '../../../hooks/useTranslation';
import styles from './Navbar.module.css';

const ANALYSIS_ROUTES = ['/dashboard', '/clauses', '/important-clauses', '/ask', '/summary'];

export default function Navbar() {
  const location = useLocation();
  const { hasDocument } = useDocument();
  const { t } = useTranslation();
  const isAnalysis = ANALYSIS_ROUTES.some(r => location.pathname.startsWith(r));

  return (
    <header className={styles.navbar}>
      {/* Gold accent line at top */}
      <div className={styles.accentLine} />

      <nav className={styles.inner}>
        {/* Logo */}
        <Link to="/" className={styles.logo} aria-label="Clause Wise Home">
          <Scale size={20} strokeWidth={1.5} className={styles.logoIcon} />
          <span className={styles.logoText}>Clause<span className={styles.logoAccent}>Wise</span></span>
        </Link>

        {/* Analysis sub-nav (only on analysis pages) */}
        {isAnalysis && hasDocument && (
          <nav className={styles.subNav} aria-label="Document navigation">
            <Link to="/dashboard"         className={`${styles.navLink} ${location.pathname === '/dashboard' ? styles.active : ''}`}>{t('nav_overview')}</Link>
            <Link to="/clauses"           className={`${styles.navLink} ${location.pathname === '/clauses' ? styles.active : ''}`}>{t('nav_clauses')}</Link>
            <Link to="/important-clauses" className={`${styles.navLink} ${location.pathname === '/important-clauses' ? styles.active : ''}`}>{t('nav_flagged')}</Link>
            <Link to="/ask"               className={`${styles.navLink} ${location.pathname === '/ask' ? styles.active : ''}`}>{t('nav_ask')}</Link>
            <Link to="/summary"           className={`${styles.navLink} ${location.pathname === '/summary' ? styles.active : ''}`}>{t('nav_summary')}</Link>
          </nav>
        )}

        {/* Right actions */}
        <div className={styles.actions}>
          <LanguageSelector />
          <ThemeToggle />
          {!isAnalysis && (
            <Link to="/upload">
              <Button variant="primary" size="sm">{t('nav_analyze')}</Button>
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
}
