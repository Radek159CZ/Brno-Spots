import { useI18n } from '../i18n/LanguageContext.js'

export default function CategoryBar({ categories, selected, onSelect }) {
  const { t } = useI18n()

  return (
    <nav className="category-bar" aria-label={t('categories.label')}>
      {categories.map((category) => (
        <button
          key={category}
          type="button"
          className={category === selected ? 'category-tab is-active' : 'category-tab'}
          aria-pressed={category === selected}
          onClick={() => onSelect(category)}
        >
          {t(`category.${category}`)}
        </button>
      ))}
    </nav>
  )
}
