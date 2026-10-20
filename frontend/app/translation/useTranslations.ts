import { useLanguage } from './LanguageContext';

interface Translations {
  [key: string]: {
    common: {
      [key: string]: string;
    };
  };
}

const translations: Translations = {
  en: require('./en/common.json'),
  fr: require('./fr/common.json'),
  cn: require('./cn/common.json'),
};

export const useTranslations = () => {
  const { language } = useLanguage();

  const t = (key: string) => {
    return translations[language]?.common[key] || key;
  };

  return { t };
};
