import type {} from 'styled-components/cssprop'
import React from 'react'
import { AppProps } from 'next/app'
import { TinaProvider, ModalProvider, TinaCMS } from 'tinacms'
import { createGlobalStyle, css } from 'styled-components'
import Header from '../components/molecules/Header'
import Footer from '../components/molecules/Footer'
import Preview from '../contexts/Preview'

import PageCreatorPlugin from '../plugins/PageCreatorPlugin'
import NewsCreatorPlugin from '../plugins/NewsCreatorPlugin'
import ConfigEditorPlugin from '../plugins/ConfigEditorPlugin'
import ContentMediaStorePlugin from '../plugins/ContentMediaStorePlugin'

import ContentService from '../services/ContentService'

const GlobalStyle = createGlobalStyle`
  html, body {
    padding: 0;
    margin: 0;
    font-family: Source Sans Pro, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen,
      Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif;
    box-sizing: border-box;
    background-color: #fffffb;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: #33342E;
    background-color: #000;
  }
  :root {
    --sunrise-yellow: #ffde16;
    --sunrise-tan: #F7F5E8;
    --sunrise-magenta: #8F0D56;
  }
  a {
    color: inherit;
    text-decoration: none;
  }
  * {
    box-sizing: inherit;
  }
`

const Contents = ({ Component, pageProps }: AppProps) => {
  const config = ConfigEditorPlugin.use(pageProps.siteConfig)

  return (
    <>
      <GlobalStyle />
      <div css={css`
        background-color: #fffffb;
      `}>
        <Header config={config} />
        <main css={css`
          padding-bottom: 120px;
        `}>
          <Component {...pageProps} siteConfig={config} />
        </main>
        <Footer />
      </div>
    </>
  )
}

const Application = (props: AppProps) => {
  const cms = React.useMemo(() => {
    const cms = new TinaCMS({
      enabled: !!props.pageProps.preview,
      media: new ContentMediaStorePlugin(),
      toolbar: true,
      sidebar: false,
      plugins: [
        new PageCreatorPlugin(),
        new NewsCreatorPlugin(),
      ]
    })
    return cms
  }, [])

  React.useEffect(() => {
    props.pageProps.preview ?
      sessionStorage.setItem('preview', 'active') :
      sessionStorage.removeItem('preview')
  }, [props.pageProps.preview])

  return (
      <Preview.Provider preview={!!props.pageProps.preview}>
        <ModalProvider>
          <TinaProvider cms={cms}>
            <Contents {...props} />
          </TinaProvider>
        </ModalProvider>
      </Preview.Provider>
  )
}

Application.getInitialProps = async () => {
  const siteConfig = await ContentService.instance.getSiteConfig()
  return { pageProps: { siteConfig } }
}

export default Application
