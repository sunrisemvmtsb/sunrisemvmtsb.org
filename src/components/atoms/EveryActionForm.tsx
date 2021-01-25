import React from 'react'
import { css } from 'styled-components'
import { v4 as uuid } from 'uuid'

const EveryActionForm = (props: { url: string }) => {
  const url = React.useMemo(() => encodeURIComponent(props.url), [props.url])
  const [height, setHeight] = React.useState(420)
  const heightRef = React.useRef(420)
  const isResizingRef = React.useRef(false)
  const resizeCountRef = React.useRef(0)
  const mountedRef = React.useRef(true)
  const iframeRef = React.useRef<HTMLIFrameElement>()
  const sawWindowRef = React.useRef(false)
  const idRef = React.useRef(uuid())

  React.useEffect(() => {
    mountedRef.current = true
    return () => {
      mountedRef.current = false
    }
  }, [])

  const handleResizing = React.useCallback((iframe: HTMLIFrameElement) => {
    resizeCountRef.current = 0
    if (isResizingRef.current) return
    isResizingRef.current = true

    const handleEvent = (event: MessageEvent) => {
      if (!mountedRef.current) {
        window.removeEventListener('message', handleEvent)
        return
      }
      if (event.data.type !== 'EveryActionForm:respond' || event.data.id !== idRef.current) return
      if (event.data.height === heightRef.current){
        resizeCountRef.current += 1
      } else {
        resizeCountRef.current = 0
        heightRef.current = event.data.height
        setHeight(event.data.height)
      }
    }
    window.addEventListener('message', handleEvent)
    const handleInterval = () => {
      if (!mountedRef.current || resizeCountRef.current >= 5) {
        isResizingRef.current = false
        if (resizeCountRef.current >= 5) console.debug(`%c<EveryActionForm /> %cstopped resizing`, 'font-weight: bold;', 'font-weight: normal;')
        return clearInterval(interval)
      }
      iframe.contentWindow?.postMessage({ type: 'request' }, window.location.origin)
    }
    const interval: number = setInterval(handleInterval, 500)
    handleInterval()
  },[])

  React.useEffect(() => {
    const handler = (event: MessageEvent) => {
      if (event.data.type !== 'EveryActionForm:resize') return
      if (!iframeRef.current) return
      iframeRef.current.contentWindow?.postMessage({ type: 'request', id: idRef.current }, window.location.origin)
    }
    window.addEventListener('message', handler)
    return () => {
      window.removeEventListener('message', handler)
    }
  }, [])

  return (
    <div css={css`
      position: relative;
      height: ${height}px;
      width: 100%;
      transition: height 100ms linear;
    `}>
      <iframe
        src={`/api/embed/everyaction?url=${url}&padding=32`}
        ref={(element: HTMLIFrameElement | null) => {
          if (!element) return
          if(element !== iframeRef.current) {
            iframeRef.current = element
            handleResizing(element)
          }
        }}
        css={css`
          height: 100%;
          width: 100%;
          border: 0;
          background-color: transparent;
        `} />
    </div>
  )
}

export default EveryActionForm
