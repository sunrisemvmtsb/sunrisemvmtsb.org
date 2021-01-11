import type {} from 'styled-components/cssprop'
import path from 'path'
import React from 'react'
import { AppContext, AppProps } from 'next/app'
import { TinaProvider, ModalProvider, TinaCMS, useCMS } from 'tinacms'
import { createGlobalStyle, css } from 'styled-components'
import Header from '../components/molecules/Header'
import Footer from '../components/molecules/Footer'
import CustomGitClient from '../infrastructure/CustomGitClient'
import NextGitMediaStore from '../infrastructure/NextGitMediaStore'
import Preview from '../contexts/Preview'
import PageCreatorPlugin from '../plugins/PageCreatorPlugin'
import NewsCreatorPlugin from '../plugins/NewsCreatorPlugin'
import { useConfigScreenPlugin } from '../plugins/Config'

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

path.resolve('./content/')

const Contents = ({ Component, pageProps }: AppProps) => {
  const config = useConfigScreenPlugin(pageProps.config)

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
          <Component {...pageProps} />
        </main>
        <Footer />
      </div>
    </>
  )
}

const Application = (props: AppProps) => {
  const cms = React.useMemo(() => {
    const git = new CustomGitClient('/api/tina')
    const cms = new TinaCMS({
      enabled: !!props.pageProps.preview,
      media: new NextGitMediaStore(git),
      toolbar: true,
      sidebar: true,
      plugins: [
        PageCreatorPlugin,
        NewsCreatorPlugin,
      ]
    })
    cms.registerApi('git', git)
    return cms
  }, [])

  React.useEffect(() => {
    props.pageProps.preview ?
      sessionStorage.setItem('preview', 'active') :
      sessionStorage.removeItem('preview')
  }, [props.pageProps.preview])

  return (
    <ErrorBoundary>
      <Preview.Provider preview={!!props.pageProps.preview}>
        <ModalProvider>
          <TinaProvider cms={cms}>
            <Contents {...props} />
          </TinaProvider>
        </ModalProvider>
      </Preview.Provider>
    </ErrorBoundary>
  )
}

class ErrorBoundary extends React.Component {
  componentDidCatch(error, errorInfo) {

  }
  render() {
    return this.props.children
  }
}

export default Application
