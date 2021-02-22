import React from 'react'

const usePromise = <T>(initial: T, cb: () => Promise<T>): [T, Error | null, boolean] => {
  const mounted = React.useRef(true)
  React.useEffect(() => {
    return () => { mounted.current = false }
  }, [])

  const [loading, setLoading] = React.useState(true)
  const [value, setValue] = React.useState(initial)
  const [error, setError] = React.useState(null)

  React.useEffect(() => {
    cb()
      .then((newValue) => {
        if (!mounted.current) return
        setLoading(false)
        setValue(newValue)
      })
      .catch((error) => {
        if (!mounted.current) return
        setLoading(false)
        setError(error)
      })
  }, [])

  return [value, error, loading]
}

export default usePromise
