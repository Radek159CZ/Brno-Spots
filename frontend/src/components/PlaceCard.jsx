import { useI18n } from '../i18n/LanguageContext.js'

// The whole card is a <button>, so it works with mouse, keyboard (Tab + Enter)
// and screen readers.
export default function PlaceCard({ place, onSelect }) {
  const { t, localized } = useI18n()

  return (
    <button type="button" className="place-card" onClick={() => onSelect(place.id)}>
      {place.photo ? (
        // alt="" – the name is right below, a screen reader would read it twice.
        <img className="place-card-photo" src={place.photo} alt="" loading="lazy" />
      ) : (
        <div className="place-card-photo" />
      )}

      <div className="place-card-body">
        <div className="place-card-header">
          <h3 className="place-card-name">{place.name}</h3>
          <span className="rating">
            <span className="star">★</span> {place.rating}
          </span>
        </div>
        <p className="place-card-category">{t(`category.${place.category}`)}</p>
        <p className="place-card-description">{localized(place.description)}</p>
      </div>
    </button>
  )
}
