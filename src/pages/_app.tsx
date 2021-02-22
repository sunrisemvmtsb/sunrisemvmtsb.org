import type {} from 'styled-components/cssprop'
import 'reflect-metadata'
import React from 'react'
import { AppProps, AppContext, AppInitialProps } from 'next/app'
import dynamic from 'next/dynamic'
import { createGlobalStyle, css } from 'styled-components'
import Header from '../components/molecules/Header'
import Footer from '../components/molecules/Footer'
import Preview from '../hooks/Preview'
import SiteConfig from '../domain/SiteConfig'
import SiteConfigService from '../services/SiteConfigService'
import { NextApiRequest } from 'next'
import type ContentListPlugin from '../plugins/ContentListPlugin'

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
    --sunrise-dark-gray: #33342E;
    --theme-color-divider: rgba(0,0,0,0.12);
  }
  a {
    color: inherit;
    text-decoration: none;
  }
  * {
    box-sizing: inherit;
  }
  #tinacms-inline-settings [class^=ModalBody] {
    min-height: 40vh;
    max-height: 80vh;
  }
`

const CmsWrapper = dynamic(async () => {
  const { TinaProvider, TinaCMS } = await import(/* webpackChunkName: "tina" */ 'tinacms')
  const { default: ConfigEditorPlugin } = await import(/* webpackChunkName: "tina" */ '../plugins/ConfigEditorPlugin')
  const { default: PageCreatorPlugin } = await import(/* webpackChunkName: "tina" */ '../plugins/PageCreatorPlugin')
  const { default: NewsCreatorPlugin } = await import(/* webpackChunkName: "tina" */ '../plugins/NewsCreatorPlugin')
  const { default: ContentMediaStorePlugin } = await import(/* webpackChunkName: "tina" */ '../plugins/ContentMediaStorePlugin')
  const { default: ContentListPlugin } = await import(/*webpackChunkName: "tina" */ '../plugins/ContentListPlugin')
  const { default: AuthService } = await import(/* webpackChunkName: "tina" */ '../services/AuthService.client')
  const { default: container } = await import(/* webpackChunkName: "tina" */ '../infrastructure/Container.client')

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

    React.useEffect(() => {
      container.set(TinaCMS, cms)
      return cms.events.subscribe('cms:disabled', () => {
        const authService = container.get(AuthService)
        authService.signout()
      })
    }, [cms])

    return (
      <TinaProvider cms={cms}>
        <CmsInner {...props} ContentListPlugin={ContentListPlugin} useConfig={ConfigEditorPlugin.use} />
      </TinaProvider>
    )
  }
})

const CmsInner = (props: AppProps & {
  ContentListPlugin: typeof ContentListPlugin,
  useConfig: (config: SiteConfig) => SiteConfig,
}) => {
  props.ContentListPlugin.use()
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
        <Footer config={config} />
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

// const getContainer = async (req?: NextApiRequest) => {
//   if (req) {
//     const { v4: uuid } = await import('uuid')
//     const { default: inject } = await import('../infrastructure/Container.server')
//     return inject(uuid())
//   } else if (typeof window === 'undefined') {
//     const { default: inject } = await import('../infrastructure/Container.server')
//     return inject('prerender')
//   } else {
//     const { default: container } = await import('../infrastructure/Container.client')
//     return container
//   }
// }

Application.getInitialProps = async ({ ctx }: AppContext): Promise<AppInitialProps> => {
  // const container = await getContainer()
  // const siteConfigService = container.get(SiteConfigService)
  // const siteConfig = await siteConfigService.get()
  return { pageProps: { siteConfig: SiteConfig.default } }
}

export default Application
