import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { DocumentProvider } from './context/DocumentContext';
import AppRouter from './router/AppRouter';
import { HelmetProvider } from 'react-helmet-async';

export default function App() {
  return (
    <HelmetProvider>
      <BrowserRouter>
        <ThemeProvider>
          <DocumentProvider>
            <AppRouter />
          </DocumentProvider>
        </ThemeProvider>
      </BrowserRouter>
    </HelmetProvider>
  );
}
