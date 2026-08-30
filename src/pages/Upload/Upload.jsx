import { useCallback, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { UploadCloud, FileText, X, AlertCircle, CheckCircle } from 'lucide-react';
import Button from '../../components/ui/Button/Button';
import Helmet from '../../components/Helmet/Helmet';
import { useDocument } from '../../context/DocumentContext';
import { useTranslation } from '../../hooks/useTranslation';
import sampleData from '../../mock/sampleAnalysis.json';
import styles from './Upload.module.css';

const ACCEPTED = ['.pdf', '.docx', '.txt'];
const MAX_MB = 10;

function formatSize(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function validateFile(file) {
  const ext = '.' + file.name.split('.').pop().toLowerCase();
  if (!ACCEPTED.includes(ext)) return `File type not supported. Use ${ACCEPTED.join(', ')}.`;
  if (file.size > MAX_MB * 1024 * 1024) return `File too large. Max size is ${MAX_MB}MB.`;
  return null;
}

export default function Upload() {
  const navigate = useNavigate();
  const { setFile, startProcessing, setAnalysisData } = useDocument();
  const { t } = useTranslation();
  const inputRef = useRef(null);

  const [selectedFile, setSelectedFile] = useState(null);
  const [error, setError] = useState(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleFile = useCallback((file) => {
    const err = validateFile(file);
    if (err) { setError(err); setSelectedFile(null); return; }
    setError(null);
    setSelectedFile(file);
    setFile(file);
  }, [setFile]);

  const onDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }, [handleFile]);

  const onInputChange = (e) => {
    const file = e.target.files[0];
    if (file) handleFile(file);
  };

  const handleAnalyze = async () => {
    if (!selectedFile) return;
    setIsAnalyzing(true);
    startProcessing();
    navigate('/processing');
  };

  return (
    <div className={`${styles.page} page-enter`}>
      <Helmet
        title="Upload Document – ClauseWise"
        description="Upload your legal document for AI-powered clause analysis and simplification."
      />

      {/* Abstract Background */}
      <div className={styles.abstractBg} aria-hidden="true">
        <div className={`${styles.abstractOrb} ${styles.orb1}`} />
        <div className={`${styles.abstractOrb} ${styles.orb2}`} />
        <div className={`${styles.abstractOrb} ${styles.orb3}`} />
      </div>

      <div className={`container ${styles.inner}`}>
        <div className={styles.header}>
          <p className={styles.label}>{t('upload_document')}</p>
          <h1 className={styles.title}>{t('analyze_your_document')}</h1>
          <p className={styles.sub}>{t('supports_formats')}</p>
        </div>

        {/* Drop Zone */}
        <div
          className={`${styles.dropZone} ${isDragOver ? styles.dragOver : ''} ${selectedFile ? styles.hasFile : ''} ${error ? styles.hasError : ''}`}
          onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
          onDragLeave={() => setIsDragOver(false)}
          onDrop={onDrop}
          onClick={() => !selectedFile && inputRef.current?.click()}
          role="button"
          tabIndex={0}
          aria-label="Upload document"
          onKeyDown={(e) => e.key === 'Enter' && !selectedFile && inputRef.current?.click()}
        >
          <input
            ref={inputRef}
            type="file"
            accept={ACCEPTED.join(',')}
            onChange={onInputChange}
            className={styles.hiddenInput}
            aria-hidden="true"
          />

          {!selectedFile ? (
            <div className={styles.dropContent}>
              <div className={`${styles.uploadIcon} ${isDragOver ? styles.uploadIconActive : ''}`}>
                <UploadCloud size={32} strokeWidth={1.5} />
              </div>
              <p className={styles.dropTitle}>
                {isDragOver ? t('drop_release') : t('drop_here')}
              </p>
              <p className={styles.dropSub}>or</p>
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => { e.stopPropagation(); inputRef.current?.click(); }}
              >
                {t('browse_files')}
              </Button>
              <p className={styles.formats}>{t('file_formats')}</p>
            </div>
          ) : (
            <div className={styles.filePreview}>
              <div className={styles.fileIcon}>
                <FileText size={24} strokeWidth={1.5} />
              </div>
              <div className={styles.fileInfo}>
                <p className={styles.fileName}>{selectedFile.name}</p>
                <p className={styles.fileSize}>{formatSize(selectedFile.size)}</p>
              </div>
              <CheckCircle size={18} strokeWidth={1.5} className={styles.checkIcon} />
              <button
                className={styles.removeBtn}
                onClick={(e) => { e.stopPropagation(); setSelectedFile(null); setError(null); }}
                aria-label="Remove file"
              >
                <X size={16} />
              </button>
            </div>
          )}
        </div>

        {/* Error */}
        {error && (
          <div className={styles.errorMsg} role="alert">
            <AlertCircle size={15} strokeWidth={1.5} />
            {error}
          </div>
        )}

        {/* Analyze Button */}
        <div className={styles.actions}>
          <Button
            variant="primary"
            size="lg"
            disabled={!selectedFile || !!error}
            loading={isAnalyzing}
            onClick={handleAnalyze}
            id="analyze-btn"
          >
            {t('analyze_your_document')}
          </Button>
          <p className={styles.note}>{t('analysis_note')}</p>
        </div>
      </div>
    </div>
  );
}
