import styles from './Badge.module.css';

const RISK_MAP = {
  HIGH:     { label: 'High Risk',   cls: 'high' },
  MEDIUM:   { label: 'Medium Risk', cls: 'medium' },
  LOW:      { label: 'Low Risk',    cls: 'low' },
  INFO:     { label: 'Info',        cls: 'info' },
  CRITICAL: { label: 'Critical',   cls: 'high' },
};

/**
 * Badge — risk level indicator.
 * Uses left-border visual language, not background fills.
 * variant: HIGH | MEDIUM | LOW | INFO | CRITICAL
 * style: pill (default) | dot
 */
export default function Badge({ variant = 'INFO', label, dotOnly = false, className = '' }) {
  const risk = RISK_MAP[variant] ?? RISK_MAP.INFO;
  const displayLabel = label ?? risk.label;

  if (dotOnly) {
    return <span className={`${styles.dot} ${styles[risk.cls]} ${className}`} title={displayLabel} />;
  }

  return (
    <span className={`${styles.badge} ${styles[risk.cls]} ${className}`}>
      <span className={styles.dotInline} />
      {displayLabel}
    </span>
  );
}
