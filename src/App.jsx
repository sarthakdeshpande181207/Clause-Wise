import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { DocumentProvider } from './context/DocumentContext';
import { LanguageProvider } from './context/LanguageContext';
import AppRouter from './router/AppRouter';
import { HelmetProvider } from 'react-helmet-async';

export default function App() {
  return (
    <HelmetProvider>
      <BrowserRouter>
        <ThemeProvider>
          <LanguageProvider>
            <DocumentProvider>
              <AppRouter />
            </DocumentProvider>
          </LanguageProvider>
        </ThemeProvider>
      </BrowserRouter>
    </HelmetProvider>
  );
}
