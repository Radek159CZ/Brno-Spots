import { useI18n } from '../i18n/LanguageContext.js'

// Mapy.com URL API: opens route planning with the place as the destination.
// Note the order – Mapy.com expects longitude first, then latitude.
function routeUrl(place) {
  return `https://mapy.com/fnc/v1/route?end=${place.lng},${place.lat}`
}

function TipList({ title, tips, variant }) {
  const { localized } = useI18n()

  if (tips.length === 0) return null

  return (
    <section className={`tips tips--${variant}`}>
      <h3>{title}</h3>
      <ul>
        {/* The list never changes order, so the index is a safe key here. */}
        {tips.map((tip, index) => (
          <li key={index}>{localized(tip.text)}</li>
        ))}
      </ul>
    </section>
  )
}

// Floating card shown over the map when a place is selected.
export default function PlaceDetail({ place, onClose }) {
  const { t, localized } = useI18n()
  const recommended = place.tips.filter((tip) => tip.type === 'recommend')
  const skipped = place.tips.filter((tip) => tip.type === 'skip')

  return (
    <article className="map-panel place-detail" aria-label={place.name}>
      <button type="button" className="close-btn" onClick={onClose} aria-label={t('detail.close')}>
        ←
      </button>

      {place.photo && <img className="place-detail-photo" src={place.photo} alt={place.name} />}

      <div className="place-detail-header">
        <h2 className="place-detail-title">{place.name}</h2>
        <span className="rating">
          <span className="star">★</span> {place.rating}
        </span>
      </div>
      <p className="place-detail-category">{t(`category.${place.category}`)}</p>

      <p className="place-detail-description">{localized(place.description)}</p>

      <TipList title={t('detail.myTips')} tips={recommended} variant="recommend" />
      <TipList title={t('detail.skip')} tips={skipped} variant="skip" />

      <div className="place-detail-actions">
        {place.website && (
          <a className="btn btn-secondary" href={place.website} target="_blank" rel="noopener noreferrer">
            {t('detail.website')}
          </a>
        )}
        <a className="btn btn-primary" href={routeUrl(place)} target="_blank" rel="noopener noreferrer">
          {t('detail.navigate')}
        </a>
      </div>
    </article>
  )
}
