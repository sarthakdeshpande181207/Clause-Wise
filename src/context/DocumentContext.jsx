import { createContext, useContext, useState } from 'react';

const DocumentContext = createContext(null);

const INITIAL_STATE = {
  file: null,          // File object
  fileName: null,
  fileSize: null,
  fileType: null,
  status: 'idle',      // idle | uploading | processing | ready | error
  analysisData: null,  // full mock analysis result
  error: null,
  rawDocumentText: '',
};

export function DocumentProvider({ children }) {
  const [doc, setDoc] = useState(INITIAL_STATE);

  const setFile = (file) => {
    setDoc(prev => ({
      ...prev,
      file,
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type,
      status: 'idle',
      error: null,
    }));
  };

  const setRawDocumentText = (text) => {
    setDoc(prev => ({ ...prev, rawDocumentText: text }));
  };

  const startProcessing = () => {
    setDoc(prev => ({ ...prev, status: 'processing' }));
  };

  const setAnalysisData = (data) => {
    setDoc(prev => ({ ...prev, status: 'ready', analysisData: data }));
  };

  const setError = (error) => {
    setDoc(prev => ({ ...prev, status: 'error', error }));
  };

  const clearDocument = () => {
    setDoc(INITIAL_STATE);
  };

  const hasDocument = doc.status === 'ready';

  return (
    <DocumentContext.Provider value={{
      doc,
      setFile,
      setRawDocumentText,
      startProcessing,
      setAnalysisData,
      setError,
      clearDocument,
      hasDocument,
    }}>
      {children}
    </DocumentContext.Provider>
  );
}

export function useDocument() {
  const ctx = useContext(DocumentContext);
  if (!ctx) throw new Error('useDocument must be used within DocumentProvider');
  return ctx;
}
