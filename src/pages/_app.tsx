import path from 'path'
import React from 'react'
import { AppProps } from 'next/app'
import { TinaProvider, ModalProvider, TinaCMS, useCMS } from 'tinacms'
import { createGlobalStyle, css } from 'styled-components'
import Header from '../components/molecules/Header'
import Footer from '../components/molecules/Footer'
import CustomGitClient from '../infrastructure/CustomGitClient'
import NextGitMediaStore from '../infrastructure/NextGitMediaStore'

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

const Application = ({ Component, pageProps }: AppProps) => {
  const cms = React.useMemo(() => {
    const git = new CustomGitClient('/api/tina')
    const cms = new TinaCMS({
      enabled: !!pageProps.preview,
      media: new NextGitMediaStore(git),
      toolbar: true,
    })
    cms.registerApi('git', git)
    return cms
  }, [])


  return (
    <ModalProvider>
      <TinaProvider cms={cms}>
        <GlobalStyle />
        <div css={css`
          background-color: #fffffb;
        `}>
          <Header />
          <Component {...pageProps} />
          <Footer />
        </div>
      </TinaProvider>
    </ModalProvider>
  )
}

export default Application
