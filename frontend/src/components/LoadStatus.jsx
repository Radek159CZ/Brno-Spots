import { useI18n } from '../i18n/LanguageContext.js'

// Shown while the places are loading, or when loading failed.
export default function LoadStatus({ status, onRetry }) {
  const { t } = useI18n()

  if (status === 'loading') {
    // role="status" makes screen readers announce the text politely.
    return (
      <p className="empty-state" role="status">
        {t('load.loading')}
      </p>
    )
  }

  return (
    <div className="empty-state" role="alert">
      <p>{t('load.error')}</p>
      <button type="button" className="btn btn-secondary" onClick={onRetry}>
        {t('load.retry')}
      </button>
    </div>
  )
}
