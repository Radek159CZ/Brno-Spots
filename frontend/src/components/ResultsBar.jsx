import { SORT_OPTIONS } from '../lib/places.js'
import { useI18n } from '../i18n/LanguageContext.js'

function FilterTag({ label, onRemove }) {
  const { t } = useI18n()

  return (
    <span className="filter-tag">
      <button type="button" onClick={onRemove} aria-label={t('results.removeFilter', { label })}>
        ×
      </button>
      {label}
    </span>
  )
}

export default function ResultsBar({
  count,
  category,
  query,
  sortBy,
  onCategoryChange,
  onQueryChange,
  onSortChange,
}) {
  const { t } = useI18n()
  const hasCategory = category !== 'All'
  const hasQuery = query.trim() !== ''
  const hasFilters = hasCategory || hasQuery

  return (
    <div className="results-bar">
      <div className="results-filters">
        <span className="results-count">
          {t('results.count', { count })}
          {hasFilters && ` ${t('results.for')}`}
        </span>

        {hasCategory && (
          <FilterTag label={t(`category.${category}`)} onRemove={() => onCategoryChange('All')} />
        )}
        {hasQuery && <FilterTag label={`“${query.trim()}”`} onRemove={() => onQueryChange('')} />}

        {hasFilters && (
          <button
            type="button"
            className="link-btn"
            onClick={() => {
              onCategoryChange('All')
              onQueryChange('')
            }}
          >
            {t('results.clearAll')}
          </button>
        )}
      </div>

      <label className="sort">
        {t('sort.label')}
        <select value={sortBy} onChange={(e) => onSortChange(e.target.value)}>
          {Object.keys(SORT_OPTIONS).map((key) => (
            <option key={key} value={key}>
              {t(`sort.${key}`)}
            </option>
          ))}
        </select>
      </label>
    </div>
  )
}
