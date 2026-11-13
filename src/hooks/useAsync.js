import { useEffect, useState } from 'react'

// Runs an async function and keeps track of loading / error / data.
// Runs again whenever something in deps changes, or when retry() is called.
export function useAsync(asyncFn, deps) {
  const [state, setState] = useState({ data: null, loading: true, error: null })
  const [attempt, setAttempt] = useState(0)

  useEffect(() => {
    // if the deps change before the request finishes, ignore the old answer
    let ignore = false

    async function run() {
      setState((prev) => ({ ...prev, loading: true, error: null }))
      try {
        const data = await asyncFn()
        if (!ignore) setState({ data, loading: false, error: null })
      } catch (err) {
        if (!ignore) {
          const message =
            err instanceof TypeError
              ? 'Could not reach the music service. Check your connection and try again.'
              : err.message
          setState({ data: null, loading: false, error: message })
        }
      }
    }

    run()
    return () => {
      ignore = true
    }
    // asyncFn is recreated on every render, so the deps list is passed in by the caller
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, attempt])

  return { ...state, retry: () => setAttempt((n) => n + 1) }
}
