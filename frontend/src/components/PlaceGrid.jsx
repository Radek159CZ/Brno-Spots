import PlaceCard from './PlaceCard.jsx'
import { useI18n } from '../i18n/LanguageContext.js'

export default function PlaceGrid({ places, onSelectPlace }) {
  const { t } = useI18n()

  if (places.length === 0) {
    return <p className="empty-state">{t('grid.empty')}</p>
  }

  return (
    <ul className="place-grid">
      {places.map((place) => (
        <li key={place.id}>
          <PlaceCard place={place} onSelect={onSelectPlace} />
        </li>
      ))}
    </ul>
  )
}
