// Talking to the backend. Components don't call fetch() directly, so the
// API address and error handling live in one place.

export async function fetchPlaces({ signal } = {}) {
  const response = await fetch('/api/places', { signal })
  // fetch() fails only on network errors – an HTTP error like 500 has to be
  // checked by hand.
  if (!response.ok) {
    throw new Error(`GET /api/places failed: ${response.status}`)
  }
  return response.json()
}
