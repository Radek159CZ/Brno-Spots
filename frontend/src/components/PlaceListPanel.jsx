import { useI18n } from '../i18n/LanguageContext.js'

// Floating panel over the map with a compact list of places.
// When a place is selected, App shows <PlaceDetail> in its spot instead.
export default function PlaceListPanel({ places, onSelectPlace }) {
  const { t } = useI18n()

  return (
    <section className="map-panel" aria-label={t('panel.title')}>
      <h2 className="map-panel-title">{t('panel.title')}</h2>

      {places.length === 0 ? (
        <p className="empty-state">{t('grid.empty')}</p>
      ) : (
        <ul className="compact-list">
          {places.map((place) => (
            <li key={place.id}>
              <button type="button" className="compact-item" onClick={() => onSelectPlace(place.id)}>
                {place.photo ? (
                  <img className="compact-item-photo" src={place.photo} alt="" loading="lazy" />
                ) : (
                  <span className="compact-item-photo" />
                )}
                <span className="compact-item-text">
                  <span className="compact-item-name">{place.name}</span>
                  <span className="compact-item-meta">
                    {t(`category.${place.category}`)} · <span className="star">★</span> {place.rating}
                  </span>
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
