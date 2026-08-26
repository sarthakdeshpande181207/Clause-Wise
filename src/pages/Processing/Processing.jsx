import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, Loader, AlertCircle } from 'lucide-react';
import Button from '../../components/ui/Button/Button';
import { useDocument } from '../../context/DocumentContext';
import styles from './Processing.module.css';

const STEPS = [
  { id: 1, label: 'Document received',       duration: 400 },
  { id: 2, label: 'Extracting text',         duration: 800 },
  { id: 3, label: 'Identifying clauses',     duration: 900 },
  { id: 4, label: 'Analyzing risk levels',   duration: 700 },
  { id: 5, label: 'Generating summaries',    duration: 700 },
];

export default function Processing() {
  const navigate = useNavigate();
  const { doc } = useDocument();
  const [completedSteps, setCompletedSteps] = useState([]);
  const [activeStep, setActiveStep] = useState(1);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let elapsed = 0;
    const totalDuration = STEPS.reduce((s, st) => s + st.duration, 0);

    STEPS.forEach((step, i) => {
      setTimeout(() => {
        setActiveStep(step.id);
        setCompletedSteps(prev => [...prev, ...STEPS.slice(0, i).map(s => s.id)]);
      }, elapsed);
      elapsed += step.duration;
    });

    // Progress bar
    const interval = setInterval(() => {
      setProgress(prev => {
        const next = prev + (100 / (totalDuration / 50));
        return next >= 100 ? 100 : next;
      });
    }, 50);

    return () => clearInterval(interval);
  }, []);

  // Navigate when analysis data arrives
  useEffect(() => {
    if (doc.status === 'ready') {
      setTimeout(() => navigate('/dashboard'), 400);
    }
  }, [doc.status, navigate]);

  if (doc.status === 'error') {
    return (
      <div className={`${styles.page} page-enter`}>
        <div className={styles.errorState}>
          <div className={styles.errorIcon}>
            <AlertCircle size={32} strokeWidth={1.5} />
          </div>
          <h1 className={styles.errorTitle}>Analysis failed</h1>
          <p className={styles.errorDesc}>{doc.error || 'Something went wrong. Please try again.'}</p>
          <Button variant="ghost" onClick={() => navigate('/upload')}>Try again</Button>
        </div>
      </div>
    );
  }

  return (
    <div className={`${styles.page} page-enter`}>
      <div className={styles.inner}>
        {/* Progress bar */}
        <div className={styles.progressWrap}>
          <div className={styles.progressBar}>
            <div className={styles.progressFill} style={{ width: `${progress}%` }} />
          </div>
          <span className={styles.progressPct}>{Math.round(progress)}%</span>
        </div>

        <div className={styles.header}>
          <h1 className={styles.title}>Analyzing your document</h1>
          {doc.fileName && <p className={styles.fileName}>{doc.fileName}</p>}
        </div>

        {/* Steps */}
        <div className={styles.steps}>
          {STEPS.map((step, i) => {
            const done = completedSteps.includes(step.id);
            const active = activeStep === step.id && !done;
            return (
              <div
                key={step.id}
                className={`${styles.step} step-enter stagger-${i + 1}`}
                style={{ animationDelay: `${i * 80}ms` }}
              >
                <div className={`${styles.stepIcon} ${done ? styles.done : active ? styles.active : styles.pending}`}>
                  {done
                    ? <CheckCircle size={15} strokeWidth={2} />
                    : active
                    ? <Loader size={15} strokeWidth={2} className={styles.spin} />
                    : <span className={styles.stepNum}>{step.id}</span>
                  }
                </div>
                <span className={`${styles.stepLabel} ${done ? styles.labelDone : active ? styles.labelActive : styles.labelPending}`}>
                  {step.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
