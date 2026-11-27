import { useCallback, useEffect, useState } from 'react'
import { fetchPlaces } from './api.js'

// Loads the places from the API.
// status: 'loading' | 'error' | 'ready'; `reload()` tries again after an error.
export function usePlaces() {
  const [places, setPlaces] = useState([])
  const [status, setStatus] = useState('loading')
  const [attempt, setAttempt] = useState(0)

  useEffect(() => {
    // Cancels the request when the component goes away (or StrictMode runs
    // the effect twice), so an old answer can't overwrite a newer one.
    const controller = new AbortController()

    fetchPlaces({ signal: controller.signal })
      .then((data) => {
        setPlaces(data)
        setStatus('ready')
      })
      .catch((error) => {
        if (error.name === 'AbortError') return
        console.error(error)
        setStatus('error')
      })

    return () => controller.abort()
  }, [attempt])

  const reload = useCallback(() => {
    setStatus('loading')
    setAttempt((count) => count + 1)
  }, [])

  return { places, status, reload }
}
