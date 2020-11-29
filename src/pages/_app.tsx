import path from 'path'
import React from 'react'
import { AppProps } from 'next/app'
import { TinaProvider, TinaCMS } from 'tinacms'
import { GithubClient, TinacmsGithubProvider } from 'react-tinacms-github'
import { NextGithubMediaStore } from 'next-tinacms-github'
import { GitClient, GitMediaStore } from '@tinacms/git-client'
import NextGitMediaStore from '../infrastructure/NextGitMediaStore'
import { createGlobalStyle } from 'styled-components'

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

const App = ({ Component, pageProps }: AppProps) => {
  const github = React.useMemo(() => {
    return new GithubClient({
      proxy: '/api/proxy-github',
      authCallbackRoute: '/api/create-github-access-token',
      clientId: process.env.GITHUB_CLIENT_ID,
      baseRepoFullName: process.env.GITHUB_REPO,
      baseBranch: process.env.GITHUB_BASE_BRANCH,
    })
  }, [])

  const git = React.useMemo(() => new GitClient('/___tina'), [])

  const cms = React.useMemo(() => {
    return new TinaCMS({
      enabled: true,
      apis: { github },
      media: new NextGithubMediaStore(github),
      toolbar: true,
    })
  }, [])

  const onLogin = React.useCallback(async () => {
    const token = localStorage.getItem('tinacms-github-token') || null
    const headers = new Headers()
    if (token) headers.append('Authorization', 'Bearer ' + token)
    const response = await fetch(`/api/preview`, { headers: headers })
    const data = await response.json()
    if (response.status == 200) window.location.href = window.location.pathname
    else throw new Error(data.message)
  }, [])
  
  const onLogout = React.useCallback(async () => {
    await fetch(`/api/reset-preview`)
    window.location.reload()
  }, [])

  return (
    <TinaProvider cms={cms}>
      <TinacmsGithubProvider onLogin={onLogin} onLogout={onLogout} error={pageProps.error}>
        <GlobalStyle />
        <Component {...pageProps} />
      </TinacmsGithubProvider>
    </TinaProvider>
  )
}

export default App
