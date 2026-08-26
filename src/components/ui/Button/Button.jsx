import styles from './Button.module.css';

/**
 * Button component
 * Variants: primary | ghost | danger | text
 * Sizes: sm | md | lg
 * Anti-slop: no box-shadow, no border-radius > 8px
 */
export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  onClick,
  type = 'button',
  className = '',
  ...props
}) {
  return (
    <button
      type={type}
      className={`${styles.btn} ${styles[variant]} ${styles[size]} ${loading ? styles.loading : ''} ${className}`}
      disabled={disabled || loading}
      onClick={onClick}
      {...props}
    >
      {loading && <span className={styles.spinner} aria-hidden="true" />}
      <span className={loading ? styles.loadingText : ''}>{children}</span>
    </button>
  );
}
