import { useState, useRef, useEffect } from 'react';
import { Globe, ChevronDown, Check } from 'lucide-react';
import { useLanguage } from '../../../context/LanguageContext';
import { useTranslation } from '../../../hooks/useTranslation';
import styles from './LanguageSelector.module.css';

export default function LanguageSelector() {
  const { languageCode, currentLanguage, changeLanguage, supportedLanguages } = useLanguage();
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Keyboard navigation (Escape to close)
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    }
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  const handleSelect = (code) => {
    changeLanguage(code);
    setIsOpen(false);
  };

  return (
    <div className={styles.selectorContainer} ref={dropdownRef}>
      <button
        type="button"
        className={`${styles.triggerBtn} ${isOpen ? styles.active : ''}`}
        onClick={() => setIsOpen(prev => !prev)}
        aria-label={t('select_language')}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <Globe size={15} className={styles.globeIcon} />
        <span className={styles.langName}>{currentLanguage.nativeName}</span>
        <ChevronDown size={14} className={`${styles.chevron} ${isOpen ? styles.chevronOpen : ''}`} />
      </button>

      {isOpen && (
        <div className={styles.dropdownMenu} role="listbox" aria-label="Select Language">
          <div className={styles.dropdownHeader}>
            <Globe size={13} />
            <span>{t('select_language')}</span>
          </div>

          <div className={styles.optionsList}>
            {supportedLanguages.map((lang) => {
              const isSelected = lang.code === languageCode;
              return (
                <button
                  key={lang.code}
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  className={`${styles.optionBtn} ${isSelected ? styles.selectedOption : ''}`}
                  onClick={() => handleSelect(lang.code)}
                >
                  <span className={styles.checkSlot}>
                    {isSelected && <Check size={14} className={styles.checkIcon} />}
                  </span>
                  <span className={styles.nativeName}>{lang.nativeName}</span>
                  {lang.code !== 'en' && (
                    <span className={styles.englishName}>({lang.name})</span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
