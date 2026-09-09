import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import 'antd/dist/reset.css'; // Ant Design CSS reset - must be before app styles
import './index.css';
import './i18n';
import App from './App.tsx';
import { ThemeProvider } from './hooks/useTheme';
import { LocaleProvider } from './hooks/useLocale';

const applyInitialTheme = () => {
  const savedMode = window.localStorage.getItem('app:theme-mode');
  const themeMode =
    savedMode === 'light' || savedMode === 'dark' || savedMode === 'system'
      ? savedMode
      : 'system';

  const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light';

  const resolvedTheme = themeMode === 'system' ? systemTheme : themeMode;
  document.documentElement.setAttribute('data-theme', resolvedTheme);
};

applyInitialTheme();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <LocaleProvider>
        <App />
      </LocaleProvider>
    </ThemeProvider>
  </StrictMode>,
);
