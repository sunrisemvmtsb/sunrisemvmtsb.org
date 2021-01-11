import React from 'react'

const Context = React.createContext(false)

const use = () => {
  return React.useContext(Context)
}

const Provider = ({ children, preview }: React.PropsWithChildren<{
  preview: boolean
}>) => {
  const [current, setCurrent] = React.useState(preview)
  React.useEffect(() => {
    setCurrent(sessionStorage.getItem('preview') === 'active')
  }, [])
  React.useEffect(() => {
    const listener = () => {
      setCurrent(sessionStorage.getItem('preview') === 'active')
    }
    window.addEventListener('storage', listener)
    return () => window.removeEventListener('storage', listener)
  }, [])
  return (
    <Context.Provider value={current}>
      {children}
    </Context.Provider>
  )
}

function component<T>(Editor: React.ComponentType<T>, Static: React.ComponentType<T>): React.ComponentType<T> {
  return (props: T) => {
    const preview = use()
    return preview ?
      React.createElement(Editor, props) :
      React.createElement(Static, props)
  }
}

export default {
  Provider, use, component,
}
