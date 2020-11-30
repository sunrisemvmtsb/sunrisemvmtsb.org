import path from 'path'
import React from 'react'
import App, { AppProps } from 'next/app'
import { TinaProvider, TinaCMS, useCMS } from 'tinacms'
import { GithubClient, TinacmsGithubProvider } from 'react-tinacms-github'
import { NextGithubMediaStore } from 'next-tinacms-github'
import { GitClient, GitMediaStore } from '@tinacms/git-client'
import NextGitMediaStore from '../infrastructure/NextGitMediaStore'
import { createGlobalStyle, css } from 'styled-components'

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

const onLogin = async () => {
  const token = localStorage.getItem('tinacms-github-token') || null
  const headers = new Headers()
  if (token) headers.append('Authorization', 'Bearer ' + token)
  const response = await fetch(`/api/preview`, { headers: headers })
  const data = await response.json()
  if (response.status == 200) window.location.href = window.location.pathname
  else throw new Error(data.message)
}

const onLogout = async () => {
  await fetch(`/api/reset-preview`)
  window.location.reload()
}

export default class Application extends App {
  private cms: TinaCMS

  constructor(props) {
    super(props)
    const github = new GithubClient({
      proxy: '/api/proxy-github',
      authCallbackRoute: '/api/create-github-access-token',
      clientId: process.env.GITHUB_CLIENT_ID,
      baseRepoFullName: process.env.GITHUB_REPO,
      baseBranch: process.env.GITHUB_BASE_BRANCH,
    })
    this.cms = new TinaCMS({
      enabled: !!props.pageProps.preview,
      media: new NextGithubMediaStore(github),
      toolbar: !!props.pageProps.preview,
    })
    this.cms.registerApi('github', github)
    this.cms.events.subscribe('cms:enable', async () => {
      const authed = await github.isAuthenticated()
      if (authed) onLogin()
    })
    github.events.subscribe('*', console.log.bind(console))
  }

  render() {
    const { Component, pageProps } = this.props
    return (
      <TinaProvider cms={this.cms}>
        <TinacmsGithubProvider onLogin={onLogin} onLogout={onLogout} error={pageProps.error}>
          <GlobalStyle />
          <EditLink />
          <Component {...pageProps} />
        </TinacmsGithubProvider>
      </TinaProvider>
    )
  }
}

const EditLink = () => {
  const cms = useCMS()

  return (
    <button
      css={css`
        position: absolute;
        bottom: 0;
        right: 0;
      `}
      onClick={cms.toggle}>
      {cms.enabled ? 'Exit Edit Mode' : 'Edit This Site'}
    </button>
  )
}

