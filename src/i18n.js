export function getLanguage() {
  return typeof document !== 'undefined' && document.documentElement.lang.toLowerCase().startsWith('en') ? 'en' : 'pl';
}

export const t = (polish, english) => getLanguage() === 'en' ? english : polish;
export const currentLocale = () => getLanguage() === 'en' ? 'en-GB' : 'pl-PL';
