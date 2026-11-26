import Logo from './Logo.jsx'
import { LANGUAGES, useI18n } from '../i18n/LanguageContext.js'

const VIEWS = [
  {
    id: 'list',
    icon: (
      <svg viewBox="0 0 16 16" aria-hidden="true">
        <rect x="1" y="1" width="6" height="6" rx="1.5" />
        <rect x="9" y="1" width="6" height="6" rx="1.5" />
        <rect x="1" y="9" width="6" height="6" rx="1.5" />
        <rect x="9" y="9" width="6" height="6" rx="1.5" />
      </svg>
    ),
  },
  {
    id: 'map',
    icon: (
      <svg viewBox="0 0 16 16" aria-hidden="true">
        <path d="M1 3.5 5.5 2l5 1.5L15 2v10.5L10.5 14l-5-1.5L1 14z" />
      </svg>
    ),
  },
]

export default function Toolbar({ view, onViewChange, query, onQueryChange }) {
  const { t, lang, setLang } = useI18n()

  return (
    <header className="toolbar">
      <div className="toolbar-group">
        <div className="logo">
          <Logo className="logo-mark" />
          Brno Spots
        </div>

        <div className="segmented" role="group" aria-label={t('view.label')}>
          {VIEWS.map((item) => (
            <button
              key={item.id}
              type="button"
              className={view === item.id ? 'segmented-btn is-active' : 'segmented-btn'}
              aria-pressed={view === item.id}
              onClick={() => onViewChange(item.id)}
            >
              {item.icon}
              {t(`view.${item.id}`)}
            </button>
          ))}
        </div>
      </div>

      <div className="toolbar-group">
        <input
          className="search"
          type="search"
          placeholder={t('search.placeholder')}
          aria-label={t('search.label')}
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
        />

        <div className="lang-switch" role="group" aria-label={t('language.label')}>
          {LANGUAGES.map((code) => (
            <button
              key={code}
              type="button"
              className={lang === code ? 'lang-btn is-active' : 'lang-btn'}
              aria-pressed={lang === code}
              onClick={() => setLang(code)}
            >
              {code.toUpperCase()}
            </button>
          ))}
        </div>

        <button type="button" className="btn btn-primary">
          {t('addPlace')}
        </button>
      </div>
    </header>
  )
}
