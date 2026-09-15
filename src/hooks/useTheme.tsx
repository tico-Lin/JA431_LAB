/* eslint-disable react-refresh/only-export-components */
import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

export type ThemeMode =
  | 'system'
  | 'dynamic-dark'
  | 'dynamic-light'
  | 'pure-dark'
  | 'pure-light';
export type ResolvedTheme =
  | 'dynamic-dark'
  | 'dynamic-light'
  | 'pure-dark'
  | 'pure-light';

const THEME_MODE_STORAGE_KEY = 'ja431_theme';

interface ThemeContextValue {
  themeMode: ThemeMode;
  resolvedTheme: ResolvedTheme;
  isDark: boolean;
  isDynamic: boolean;
  setThemeMode: (mode: ThemeMode) => void;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

const isValidTheme = (mode: string | null): mode is ThemeMode => {
  return (
    mode === 'system' ||
    mode === 'dynamic-dark' ||
    mode === 'dynamic-light' ||
    mode === 'pure-dark' ||
    mode === 'pure-light'
  );
};

const getSystemTheme = (): ResolvedTheme => {
  if (typeof window === 'undefined') {
    return 'dynamic-dark';
  }
  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dynamic-dark'
    : 'dynamic-light';
};

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [themeMode, setThemeMode] = useState<ThemeMode>(() => {
    if (typeof window === 'undefined') {
      return 'system';
    }
    const saved = window.localStorage.getItem(THEME_MODE_STORAGE_KEY);
    if (isValidTheme(saved)) {
      return saved;
    }
    return 'system';
  });

  const [systemTheme, setSystemTheme] = useState<ResolvedTheme>(getSystemTheme);

  const resolvedTheme = useMemo(() => {
    return themeMode === 'system' ? systemTheme : (themeMode as ResolvedTheme);
  }, [themeMode, systemTheme]);

  const isDark =
    resolvedTheme === 'dynamic-dark' || resolvedTheme === 'pure-dark';
  const isDynamic =
    resolvedTheme === 'dynamic-dark' || resolvedTheme === 'dynamic-light';

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (event: MediaQueryListEvent) => {
      setSystemTheme(event.matches ? 'dynamic-dark' : 'dynamic-light');
    };

    if (typeof mediaQuery.addEventListener === 'function') {
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
    mediaQuery.addListener(handleChange);
    return () => mediaQuery.removeListener(handleChange);
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', resolvedTheme);
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    window.localStorage.setItem(THEME_MODE_STORAGE_KEY, themeMode);
  }, [resolvedTheme, themeMode, isDark]);

  const value = useMemo(
    () => ({ themeMode, resolvedTheme, isDark, isDynamic, setThemeMode }),
    [themeMode, resolvedTheme, isDark, isDynamic],
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};

export const useThemeMode = (): ThemeContextValue => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useThemeMode must be used within ThemeProvider');
  }
  return context;
};
