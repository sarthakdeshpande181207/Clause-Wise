import { Routes, Route, Navigate } from 'react-router-dom';
import { useDocument } from '../context/DocumentContext';
import Navbar from '../components/layout/Navbar/Navbar';

/* Pages */
import Landing          from '../pages/Landing/Landing';
import Upload           from '../pages/Upload/Upload';
import Processing       from '../pages/Processing/Processing';
import Dashboard        from '../pages/Dashboard/Dashboard';
import Summary          from '../pages/Summary/Summary';
import ClauseExplorer   from '../pages/ClauseExplorer/ClauseExplorer';
import ImportantClauses from '../pages/ImportantClauses/ImportantClauses';
import AskDocument      from '../pages/AskDocument/AskDocument';
import Privacy          from '../pages/Privacy/Privacy';

/** Route guard: redirects to /upload if no document is ready */
function ProtectedRoute({ children }) {
  const { hasDocument } = useDocument();
  return hasDocument ? children : <Navigate to="/upload" replace />;
}

export default function AppRouter() {
  return (
    <>
      <Navbar />
      <main style={{ paddingTop: '58px' }}>
        <Routes>
          <Route path="/"                  element={<Landing />} />
          <Route path="/upload"            element={<Upload />} />
          <Route path="/processing"        element={<Processing />} />
          <Route path="/privacy"           element={<Privacy />} />

          {/* Protected — require loaded document */}
          <Route path="/dashboard"         element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/summary"           element={<ProtectedRoute><Summary /></ProtectedRoute>} />
          <Route path="/clauses"           element={<ProtectedRoute><ClauseExplorer /></ProtectedRoute>} />
          <Route path="/important-clauses" element={<ProtectedRoute><ImportantClauses /></ProtectedRoute>} />
          <Route path="/ask"               element={<ProtectedRoute><AskDocument /></ProtectedRoute>} />

          {/* Catch-all */}
          <Route path="*"                  element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </>
  );
}
