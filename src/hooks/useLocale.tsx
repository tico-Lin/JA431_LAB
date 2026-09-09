/* eslint-disable react-refresh/only-export-components */
import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import i18n from '../i18n';

export type LanguageMode = 'system' | 'en' | 'zh-TW';

const LANGUAGE_MODE_STORAGE_KEY = 'app:language-mode';

interface LocaleContextValue {
  languageMode: LanguageMode;
  resolvedLanguage: 'en' | 'zh-TW';
  setLanguageMode: (mode: LanguageMode) => void;
}

const LocaleContext = createContext<LocaleContextValue | undefined>(undefined);

const resolveSystemLanguage = (): 'en' | 'zh-TW' => {
  if (typeof navigator === 'undefined') {
    return 'en';
  }
  const lang = navigator.language.toLowerCase();
  return lang.startsWith('zh') ? 'zh-TW' : 'en';
};

const normalizeSupportedLanguage = (lang: string): 'en' | 'zh-TW' => {
  return lang.startsWith('zh') ? 'zh-TW' : 'en';
};

export const LocaleProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [languageMode, setLanguageMode] = useState<LanguageMode>(() => {
    if (typeof window === 'undefined') {
      return 'system';
    }
    const saved = window.localStorage.getItem(LANGUAGE_MODE_STORAGE_KEY);
    if (saved === 'system' || saved === 'en' || saved === 'zh-TW') {
      return saved;
    }
    return 'system';
  });

  const [systemLanguage, setSystemLanguage] = useState<'en' | 'zh-TW'>(() =>
    resolveSystemLanguage(),
  );

  const resolvedLanguage = useMemo<'en' | 'zh-TW'>(() => {
    return languageMode === 'system'
      ? systemLanguage
      : normalizeSupportedLanguage(languageMode);
  }, [languageMode, systemLanguage]);

  useEffect(() => {
    void i18n.changeLanguage(resolvedLanguage);
    document.documentElement.lang = resolvedLanguage;
    window.localStorage.setItem(LANGUAGE_MODE_STORAGE_KEY, languageMode);
  }, [languageMode, resolvedLanguage]);

  useEffect(() => {
    if (languageMode !== 'system') {
      return;
    }

    const handleLanguageChange = () => {
      setSystemLanguage(resolveSystemLanguage());
    };

    window.addEventListener('languagechange', handleLanguageChange);
    return () =>
      window.removeEventListener('languagechange', handleLanguageChange);
  }, [languageMode]);

  const value = useMemo(
    () => ({
      languageMode,
      resolvedLanguage,
      setLanguageMode,
    }),
    [languageMode, resolvedLanguage],
  );

  return (
    <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>
  );
};

export const useLocale = (): LocaleContextValue => {
  const context = useContext(LocaleContext);
  if (!context) {
    throw new Error('useLocale must be used within LocaleProvider');
  }
  return context;
};
