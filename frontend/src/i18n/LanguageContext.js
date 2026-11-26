import { createContext, useContext } from 'react'

export const LANGUAGES = ['cs', 'en']

// A Context lets any component read the current language without passing it
// through props of every component in between ("prop drilling").
export const LanguageContext = createContext(null)

// Usage in a component: const { t, lang, setLang, localized } = useI18n()
export function useI18n() {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error('useI18n() must be used inside <LanguageProvider>')
  }
  return context
}
