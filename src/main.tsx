import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import 'antd/dist/reset.css'; // Ant Design CSS reset - must be before app styles
import './index.css';
import './i18n';
import App from './App.tsx';
import { ThemeProvider } from './hooks/useTheme';
import { LocaleProvider } from './hooks/useLocale';
import { RoleProvider } from './context/RoleContext';

const applyInitialTheme = () => {
  const savedMode = window.localStorage.getItem('ja431_theme');
  const validModes = [
    'system',
    'dynamic-dark',
    'dynamic-light',
    'pure-dark',
    'pure-light',
  ];

  let themeMode = 'system';
  if (savedMode && validModes.includes(savedMode)) {
    themeMode = savedMode;
  }

  const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dynamic-dark'
    : 'dynamic-light';

  const resolvedTheme = themeMode === 'system' ? systemTheme : themeMode;

  const isDark =
    resolvedTheme === 'dynamic-dark' || resolvedTheme === 'pure-dark';
  document.documentElement.setAttribute('data-theme', resolvedTheme);
  if (isDark) {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
};

applyInitialTheme();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <LocaleProvider>
        <RoleProvider>
          <App />
        </RoleProvider>
      </LocaleProvider>
    </ThemeProvider>
  </StrictMode>,
);
