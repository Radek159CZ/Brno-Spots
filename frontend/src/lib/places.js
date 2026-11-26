// Pure helper functions for working with places – no React here, so they are
// easy to read and easy to unit-test later.

// Each option knows how to compare two places. `sort()` expects a negative
// number if `a` goes first, positive if `b` goes first, 0 if they are equal.
// The visible labels live in the translation files under `sort.<key>`.
export const SORT_OPTIONS = {
  rating: {
    compare: (a, b) => b.rating - a.rating || a.name.localeCompare(b.name, 'cs'),
  },
  name: {
    // localeCompare with 'cs' sorts Czech letters correctly (Č after C, Š after S).
    compare: (a, b) => a.name.localeCompare(b.name, 'cs'),
  },
}

// "Špilberk" -> "spilberk", so searching works with or without diacritics.
// NFD splits "Š" into "S" + a separate accent mark, which we then remove.
export function normalizeText(text) {
  return text
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase()
    .trim()
}

// ['All', 'Viewpoint', 'Sightseeing', ...] built from the data itself,
// so a new category appears automatically. A Set removes duplicates.
export function getCategories(places) {
  return ['All', ...new Set(places.map((place) => place.category))]
}

export function filterAndSortPlaces(places, { category, query, sortBy }) {
  const normalizedQuery = normalizeText(query)

  return places
    .filter((place) => category === 'All' || place.category === category)
    .filter((place) => normalizeText(place.name).includes(normalizedQuery))
    // `filter()` already returned a new array, so sorting it in place is safe.
    .sort(SORT_OPTIONS[sortBy].compare)
}
