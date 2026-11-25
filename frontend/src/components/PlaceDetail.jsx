// Mapy.com URL API: opens route planning with the place as the destination.
// Note the order – Mapy.com expects longitude first, then latitude.
function routeUrl(place) {
  return `https://mapy.com/fnc/v1/route?end=${place.lng},${place.lat}`
}

export default function PlaceDetail({ place, onBack }) {
  const recommended = place.tips.filter((tip) => tip.type === 'recommend')
  const skipped = place.tips.filter((tip) => tip.type === 'skip')

  return (
    <article className="detail">
      <button type="button" className="detail-back" onClick={onBack}>
        ← Back to list
      </button>

      {place.photo && <img className="detail-photo" src={place.photo} alt={place.name} />}

      <h2 className="detail-title">{place.name}</h2>
      <div className="detail-meta">
        <span className="chip chip--static">{place.category}</span>
        <span>
          <span className="star">★</span> {place.rating}/5
        </span>
      </div>

      <p className="detail-description">{place.description}</p>

      <div className="detail-actions">
        <a
          className="btn btn-primary"
          href={routeUrl(place)}
          target="_blank"
          rel="noopener noreferrer"
        >
          Navigate
        </a>
        {place.website && (
          <a
            className="btn btn-secondary"
            href={place.website}
            target="_blank"
            rel="noopener noreferrer"
          >
            Website & events →
          </a>
        )}
      </div>

      {recommended.length > 0 && (
        <section className="tips tips--recommend">
          <h3>My tips</h3>
          <ul>
            {recommended.map((tip) => (
              <li key={tip.text}>{tip.text}</li>
            ))}
          </ul>
        </section>
      )}

      {skipped.length > 0 && (
        <section className="tips tips--skip">
          <h3>Better skip</h3>
          <ul>
            {skipped.map((tip) => (
              <li key={tip.text}>{tip.text}</li>
            ))}
          </ul>
        </section>
      )}
    </article>
  )
}
