import type {} from 'styled-components/cssprop'
import React from 'react'
import { AppProps } from 'next/app'
import dynamic from 'next/dynamic'
import { createGlobalStyle, css } from 'styled-components'
import Header from '../components/molecules/Header'
import Footer from '../components/molecules/Footer'
import Preview from '../contexts/Preview'

import ContentService from '../services/ContentService'
import SiteConfig from '../domain/SiteConfig'

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

const CmsWrapper = dynamic(async () => {
  const { TinaProvider, TinaCMS } = await import('tinacms')
  const { default: ConfigEditorPlugin } = await import('../plugins/ConfigEditorPlugin')
  const { default: PageCreatorPlugin } = await import('../plugins/PageCreatorPlugin')
  const { default: NewsCreatorPlugin } = await import('../plugins/NewsCreatorPlugin')
  const { default: ContentMediaStorePlugin } = await import('../plugins/ContentMediaStorePlugin')

  return (props: AppProps) => {
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

    return (
      <TinaProvider cms={cms}>
        <CmsInner {...props} useConfig={ConfigEditorPlugin.use} />
      </TinaProvider>
    )
  }
})

const CmsInner = (props: AppProps & { useConfig: (config: SiteConfig) => SiteConfig }) => {
  const config = props.useConfig(props.pageProps.siteConfig)
  return (
    <Contents {...props} config={config} />
  )
}

const NormalWrapper = (props: AppProps) => {
  return (
    <Contents {...props} config={props.pageProps.siteConfig} />
  )
}

const Contents = ({ Component, pageProps, config }: AppProps & { config: SiteConfig }) => {
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

const AppComponent = Preview.component(CmsWrapper, NormalWrapper)

const Application = (props: AppProps) => {
  return (
    <Preview.Provider preview={!!props.pageProps.preview}>
      <AppComponent {...props} />
    </Preview.Provider>
  )
}

Application.getInitialProps = async () => {
  const siteConfig = await ContentService.instance.getSiteConfig()
  return { pageProps: { siteConfig } }
}

export default Application
