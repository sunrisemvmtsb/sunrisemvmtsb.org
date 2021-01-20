import React from 'react'
import { css } from 'styled-components'

const EveryActionForm = (props: { url: string }) => {
  const url = React.useMemo(() => encodeURIComponent(props.url), [props.url])
  const [height, setHeight] = React.useState(420)
  const previousHeight = React.useRef(420)
  const iframe = React.useRef<HTMLIFrameElement>()

  React.useEffect(() => {
    if (!iframe.current) return
    // Whenever the height is changed, ask the iframe to send it again, just to
    // make sure. EveryAction forms can sometimes jump around a bunch during render.
    iframe.current.contentWindow?.postMessage('reflow', window.location.origin)
  }, [height])

  return (
    <div css={css`
      position: relative;
      height: ${height}px;
      width: 100%;
      transition: height ${height === 420 ? '0s' : '0.4s'} linear;
    `}>
      <iframe
        src={`/api/embed/everyaction?url=${url}&padding=32`}
        ref={(element: HTMLIFrameElement | null) => {
          if (!element) return
          iframe.current = element
          element
            .contentWindow
            ?.addEventListener('message', (event: MessageEvent) => {
              if (typeof event.data !== 'number') return
              if (event.data === previousHeight.current) return
              previousHeight.current = event.data
              setHeight(event.data)
            })
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
