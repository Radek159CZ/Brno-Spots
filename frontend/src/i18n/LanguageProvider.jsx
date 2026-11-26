import { useEffect, useState } from 'react'
import { LanguageContext, LANGUAGES } from './LanguageContext.js'
import en from './en.json'
import cs from './cs.json'

const dictionaries = { en, cs }
const STORAGE_KEY = 'brno-spots.language'

// 1) the language the user picked last time, 2) the browser's language, 3) English.
function getInitialLanguage() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (LANGUAGES.includes(saved)) return saved
  } catch {
    // Storage can be blocked (private mode, strict settings) – just use the default.
  }
  return navigator.language?.startsWith('cs') ? 'cs' : 'en'
}

export default function LanguageProvider({ children }) {
  // Passing a function (not its result) runs it only on the first render.
  const [lang, setLang] = useState(getInitialLanguage)

  useEffect(() => {
    // <html lang="..."> tells screen readers and the browser which language the page is in.
    document.documentElement.lang = lang
    try {
      localStorage.setItem(STORAGE_KEY, lang)
    } catch {
      // Not saved – the app still works, it just won't remember the choice.
    }
  }, [lang])

  // t('results.count', { count: 3 }) -> "3 places" / "3 místa"
  function t(key, params = {}) {
    let text = dictionaries[lang][key] ?? dictionaries.en[key] ?? key

    // Plurals: Czech has more forms than English (1 místo, 2 místa, 5 míst).
    // Intl.PluralRules knows the rules of each language and picks the form.
    if (typeof text === 'object') {
      const form = new Intl.PluralRules(lang).select(params.count)
      text = text[form] ?? text.other
    }

    // Replace placeholders like {count} or {label} with real values.
    return text.replace(/\{(\w+)\}/g, (match, name) => params[name] ?? match)
  }

  // Content from data can be a plain string or { en: '...', cs: '...' }.
  function localized(value) {
    if (value == null) return ''
    if (typeof value === 'string') return value
    return value[lang] ?? value.en
  }

  return (
    <LanguageContext.Provider value={{ lang, setLang, t, localized }}>
      {children}
    </LanguageContext.Provider>
  )
}
