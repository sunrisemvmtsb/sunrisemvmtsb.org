import React from 'react'
import ReactDOM from 'react-dom'
import { css } from 'styled-components'

let loadedPromise: Promise<void> | null = null
const loadScript = (): Promise<void> => {
  if (loadedPromise !== null) return loadedPromise
  loadedPromise = new Promise((resolve) => {
    const script = document.createElement('script')
    script.addEventListener('load', () => {
      loadedPromise = Promise.resolve()
      resolve()
    }, { once: true })
    document.head.appendChild(script)
    script.src = 'https://d3rse9xjbp8270.cloudfront.net/at.js'
  })
  return loadedPromise
}

const loadCss = () => {
  const id = 'style-everyaction'
  if (document.getElementById(id)) return
  const link = document.createElement('link')
  link.rel = 'stylesheet'
  link.id = id
  document.head.appendChild(link)
  link.href = 'https://d3rse9xjbp8270.cloudfront.net/at.min.css'
}

const EveryActionForm = ({
  url,
}: {
  url: string
}) => {
  const observerRef = React.useRef<ResizeObserver>()
  const [isSmall, setIsSmall] = React.useState(false)

  React.useEffect(() => {
    return () => {
      observerRef.current?.disconnect()
    }
  }, [])

  return (
    <div
      ref={(container: HTMLDivElement | null) => {
        if (!container) return
        if (container.dataset.formUrl === url) return
        if (!observerRef.current) {
          observerRef.current = new ResizeObserver((entries) => {
            setIsSmall(entries[0].target.clientWidth <= 480)
          })      
        }
        observerRef.current.disconnect()
        observerRef.current.observe(container)
        container.dataset.formUrl = url
        const window_ = window as unknown as any
        if (window_.nvtag) {
          window_.nvtag.process(container)
          return
        }

        loadCss()
        loadScript()
      }}
      className="ngp-form"
      css={css`
        overflow: visible;
        padding: 32px !important;

        label.at-text, & div.at-markup {
          font-family: Source Sans Pro;
        }
        header.at-title {
          display: none;
        }
        
        header.HeaderHtml {
          padding: 0;
          margin: 0;
          margin-bottom: 16px;
        }

        header.HeaderHtml h1 {
          margin: 0;
          font-family: Source Serif Pro;
          font-style: italic;
          font-size: 32px;
          font-weight: 700;
          line-height: 1;
          margin-bottom: 16px;
        }

        header.HeaderHtml p {
          margin: 0;
          font-size: 16px;
          font-family: Source Sans Pro;
        }

        fieldset.at-fieldset {
          padding: 0;
        }

        fieldset legend {
          display: none;
        }
      
        .at-row {
          margin-bottom: 8px;
        }

        .at-row>[class^="at-"] {
          margin: ${isSmall ? '0' : '0 4px' }!important;
        }

        .at-row>[class^="at-"]:first-child {
          margin-left: 0 !important;
        }

        .at-row>[class^="at-"]:last-child {
          margin-right: 0 !important;
        }

        input {
          margin-bottom: 0 !important;
          border-radius: 0 !important;
        }

        .at-form-submit {
          padding: 0 !important;
        }

        .at-form-submit .at-submit {
          margin: 0 !important;
          font-family: Source Sans Pro;
          font-weight: 700;
          font-size: 16px;
          line-height: 20px;
          text-transform: uppercase;
          display: inline-block;
          padding: 12px !important;
          background-color: #000 !important;
          color: #fff;
          border-radius: 0px !important;
        }

        input[type="checkbox"]:checked+span:before {
          background-color: #000 !important;
          border-color: #000 !important;
          border-radius: 0px !important;
        }
        input[type="checkbox"]:active+span:before {
          background-color: #000 !important;
          border-color: #000 !important;
        }
        input[type="checkbox"]:hover+span:before {
          border-color: #000 !important;
        }
        input[type="checkbox"]:focus+span:before {
          box-shadow: 0 0 4px 0 #ffde16 !important;
          border-color: #000 !important;
        }

        section.at-inner {
          background: none !important;
        }
        small.info {
          margin: 0 !important;
        }
      `} />
  )
}

export default EveryActionForm
