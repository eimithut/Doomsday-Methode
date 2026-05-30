import React, { createContext, useContext, useState, ReactNode } from 'react';

export type Locale = 'de' | 'en';

interface I18nContextType {
  locale: Locale;
  setLocale: (l: Locale) => void;
  formatDate: (y: number, m: number, d: number) => string;
}

const I18nContext = createContext<I18nContextType>({ 
  locale: 'de', 
  setLocale: () => {},
  formatDate: (y, m, d) => `${d}.${m}.${y}`
});

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState<Locale>('de');

  const formatDate = (y: number, m: number, d: number) => {
    // strict formatting required by instructions
    if (locale === 'de') {
      return `${d.toString().padStart(2, '0')}.${m.toString().padStart(2, '0')}.${y}`;
    } else {
      return `${m.toString().padStart(2, '0')}/${d.toString().padStart(2, '0')}/${y}`;
    }
  };

  return <I18nContext.Provider value={{ locale, setLocale, formatDate }}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  return useContext(I18nContext);
}
