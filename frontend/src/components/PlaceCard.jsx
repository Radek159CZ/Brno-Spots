// The whole card is a <button>, so it works with mouse, keyboard (Tab + Enter)
// and screen readers. The website link moved to the detail view, because
// a link inside a button is not valid HTML.
export default function PlaceCard({ place, onSelect }) {
  return (
    <button type="button" className="place-card" onClick={() => onSelect(place.id)}>
      {place.photo ? (
        <img
          className="place-card-photo"
          src={place.photo}
          alt=""
          loading="lazy"
        />
      ) : (
        <div className="place-card-photo" />
      )}
      <div>
        <h3 className="place-card-name">{place.name}</h3>
        <p className="place-card-meta">{place.category}</p>
        <p className="place-card-rating">
          <span className="star">★</span> {place.rating}/5
        </p>
      </div>
    </button>
  )
}
