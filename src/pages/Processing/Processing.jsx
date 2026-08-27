import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, Loader, AlertCircle } from 'lucide-react';
import Button from '../../components/ui/Button/Button';
import Helmet from '../../components/Helmet/Helmet';
import { useDocument } from '../../context/DocumentContext';
import { extractTextFromFile } from '../../utils/documentParser';
import { analyzeDocumentWithGemini } from '../../utils/geminiAnalyzer';
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
  const { doc, setRawDocumentText, setAnalysisData, setError } = useDocument();
  const [completedSteps, setCompletedSteps] = useState([]);
  const [activeStep, setActiveStep] = useState(1);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let isCancelled = false;

    async function processDocument() {
      if (!doc.file) {
        if (!isCancelled) navigate('/upload');
        return;
      }

      try {
        // Step 1: Document Received
        setActiveStep(1);
        setProgress(15);
        await new Promise(r => setTimeout(r, 600));
        
        if (isCancelled) return;
        setCompletedSteps([1]);
        setActiveStep(2);
        setProgress(30);

        // Step 2: Extracting Text
        const rawText = await extractTextFromFile(doc.file);
        
        if (isCancelled) return;
        setRawDocumentText(rawText);
        setCompletedSteps([1, 2]);
        setActiveStep(3);
        setProgress(50);

        // Start artificial progression for UI while Gemini thinks
        let aiFinished = false;
        const advanceUI = async () => {
          await new Promise(r => setTimeout(r, 2000));
          if (aiFinished || isCancelled) return;
          setCompletedSteps([1, 2, 3]);
          setActiveStep(4);
          setProgress(75);
          
          await new Promise(r => setTimeout(r, 2500));
          if (aiFinished || isCancelled) return;
          setCompletedSteps([1, 2, 3, 4]);
          setActiveStep(5);
          setProgress(90);
        };
        advanceUI();

        // Step 3 & 4 & 5: AI Analysis
        const analysisResult = await analyzeDocumentWithGemini(rawText, doc.fileName);
        aiFinished = true;
        
        if (isCancelled) return;
        
        setActiveStep(5);
        setProgress(100);
        setCompletedSteps([1, 2, 3, 4, 5]);
        
        // Add required fields
        analysisResult.pageCount = 1;
        analysisResult.wordCount = rawText.split(/\s+/).length;
        analysisResult.uploadDate = new Date().toISOString();
        analysisResult.parties = analysisResult.parties || [];
        analysisResult.keyDates = analysisResult.keyDates || [];
        analysisResult.clauses = analysisResult.clauses || [];
        if (!analysisResult.stats) analysisResult.stats = { totalClauses: 0, highRisk: 0, mediumRisk: 0, lowRisk: 0, keyDates: 0 };
        
        setAnalysisData(analysisResult);

      } catch (err) {
        console.error(err);
        if (!isCancelled) {
          setError(err.message || 'Failed to process document');
        }
      }
    }

    processDocument();

    return () => {
      isCancelled = true;
    };
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
        <Helmet title="Processing – ClauseWise" />
        <div className={styles.abstractBg} aria-hidden="true">
          <div className={`${styles.abstractOrb} ${styles.orb1}`} />
          <div className={`${styles.abstractOrb} ${styles.orb2}`} />
        </div>
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
      <Helmet title="Processing – ClauseWise" />
      {/* Abstract Background */}
      <div className={styles.abstractBg} aria-hidden="true">
        <div className={`${styles.abstractOrb} ${styles.orb1}`} />
        <div className={`${styles.abstractOrb} ${styles.orb2}`} />
      </div>

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
