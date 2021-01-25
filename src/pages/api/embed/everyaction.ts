import type { NextApiRequest, NextApiResponse } from 'next/types'

export default (req: NextApiRequest, res: NextApiResponse) => {
  res.setHeader('Content-Type', 'text/html')

  const url = req.query.url
  const padding = req.query.padding
  if (typeof url !== 'string' || req.method !== 'GET') {
    return res
      .status(404)
      .send('<!DOCTYPE html><html><body>Not Found</body></html>')
  }

  return res
    .status(200)
    .send(`<!DOCTYPE html>
<html>
  <head>
    <link rel="preconnect" href="https://fonts.gstatic.com" />
    <link rel="preconnect" href="https://d3rse9xjbp8270.cloudfront.net" />
    <link rel="preload" href="https://d3rse9xjbp8270.cloudfront.net/at.js" as="script" crossOrigin="anonymous" />
    <link rel="preload" href="https://d3rse9xjbp8270.cloudfront.net/at.min.css" as="style" />
    <link rel="stylesheet" href="https://d3rse9xjbp8270.cloudfront.net/at.min.css" />
    <link href="https://fonts.googleapis.com/css2?family=Source+Sans+Pro:ital,wght@0,400;0,700;0,900;1,400;1,700;1,900&family=Source+Serif+Pro:ital,wght@0,400;0,700;0,900;1,400;1,700;1,900&display=block" rel="stylesheet" />
    <script>
      console.time = () => {}
      console.timeStamp = () => {}
      console.timeEnd = () => {}
      const getHeight = () => {
        return document.documentElement.offsetHeight
      }
      window.nvtag_callbacks = window.nvtag_callbacks || []
      const nvtag_callbacks = window.nvtag_callbacks
      nvtag_callbacks.postRender = nvtag_callbacks.postRender || []
      nvtag_callbacks.postRender.push(() => {
        window.parent.postMessage({ type: 'EveryActionForm:resize', id: '${req.query.id}' }, window.location.origin)
      })
      window.addEventListener('load', () => {
        const observer = new MutationObserver(() => {
          window.parent.postMessage({ type: 'EveryActionForm:resize', id: '${req.query.id}' }, window.location.origin)
        })
        const div = document.querySelector('div.ngp-form')
        if (!div) return
        observer.observe(div, {
          subtree: true,
          childList: true,
          attributes: true,
          characterData: true,
        })
        window.parent.postMessage({ type: 'EveryActionForm:resize', id: '${req.query.id}' }, window.location.origin)
      })
      window.addEventListener('resize', () => {
        window.parent.postMessage({ type: 'EveryActionForm:resize', id: '${req.query.id}' }, window.location.origin)
      })
      window.addEventListener('message', (event) => {
        if (event.data.type !== 'request') return
        const height = getHeight()
        window.parent.postMessage({ type: 'EveryActionForm:respond', id: '${req.query.id}', height: height }, window.location.origin)
      })
    </script>
    <script type="text/javascript" src="https://d3rse9xjbp8270.cloudfront.net/at.js" crossOrigin="anonymous" async></script>
    <style>
      body {
        margin: 0;
        font-family: Source Sans Pro;
        box-sizing: border-box;
      }
      html, body {
        background-color: transparent !important;
      }
      label.at-text, div.at-markup {
        font-family: Source Sans Pro;
      }
      * {
        box-sizing: inherit;
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

      .ngp-form.at {
        overflow: visible;
        padding: ${padding ?? 0}px !important;
      }

      .at fieldset.at-fieldset {
        padding: 0;
      }

      .at fieldset legend {
        display: none;
      }
     
      .at-row {
        margin-bottom: 8px;
      }

      .at-row>[class^="at-"] {
        margin: 0 4px !important;
      }

      .at-row>[class^="at-"]:first-child {
        margin-left: 0 !important;
      }

      .at-row>[class^="at-"]:last-child {
        margin-right: 0 !important;
      }
      
      @media(max-width: 480px) {
        .at-row>[class^="at-"] {
          margin: 0 !important;
        }  
      }

      .at input {
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

      .at input[type="checkbox"]:checked+span:before {
        background-color: #000 !important;
        border-color: #000 !important;
        border-radius: 0px !important;
      }
      .at input[type="checkbox"]:active+span:before {
        background-color: #000 !important;
        border-color: #000 !important;
      }
      .at input[type="checkbox"]:hover+span:before {
        border-color: #000 !important;
      }
      .at input[type="checkbox"]:focus+span:before {
        box-shadow: 0 0 4px 0 #ffde16 !important;
        border-color: #000 !important;
      }

      section.at-inner {
        background: none !important;
      }
      .at small.info {
        margin: 0 !important;
      }
    </style>
  </head>
  <body>
    <div
      class="ngp-form"
      data-form-url="${url}"
      data-fastaction-endpoint="https://fastaction.ngpvan.com"
      data-inline-errors="true"
      data-fastaction-nologin="true"
      data-databag-endpoint="https://profile.ngpvan.com"
      data-databag="everybody"
      data-mobile-autofocus="false">
    </div>
  </body>
</html>`)
}
