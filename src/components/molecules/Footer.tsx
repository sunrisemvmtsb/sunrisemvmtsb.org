import React from 'react'
import { css } from 'styled-components'
import ButtonLink from '../atoms/ButtonLink'
import { useCMS } from 'tinacms'
import Preview from '../../contexts/Preview'

const signin = async () => {
  const validChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  const array = new Uint8Array(40)
  crypto.getRandomValues(array)
  const chars = array.map((x) => validChars.charCodeAt(x % validChars.length))
  const csrf = String.fromCharCode(...chars)

  const state = btoa(JSON.stringify({ csrf, redirect: window.location.href }))

  const url = '/api/auth/signin'
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'same-origin',
    body: JSON.stringify({ state }),
  })
  const data = await response.json()
  window.location.assign(data.url)
}

const signout = async () => {
  const url = '/api/auth/signout'
  const response = await fetch(url, {
    method: 'POST',
    credentials: 'same-origin',
  })
  if (!response.ok) throw Error('failed to sign out')
  sessionStorage.removeItem('preview')
  window.dispatchEvent(new Event('storage'))
}

const Footer = () => {
  const cms = useCMS()
  const preview = Preview.use()

  React.useEffect(() => {
    return cms.events.subscribe('cms:disable', () => {
      signout()
    })
  }, [])

  return (
    <footer css={css`
      padding: 120px;
      background-color: black;
    `}>
      <div css={css`
        max-width: 1200px;
      `}>
        <div css={css`
          padding-bottom: 32px;
        `}>
          <ButtonLink
            href="https://secure.actblue.com/donate/sunrisemvmt"
            target="_blank"
            color="White">
            Donate
          </ButtonLink>
        </div>
        <button
          onClick={() => {
            preview ? cms.disable() : signin()
          }}
          css={css`
            font-family: Source Sans Pro;
            font-size: 18px;
            font-weight: 700;
            line-height: 2;
            color: var(--sunrise-yellow);
            text-transform: uppercase;
            padding: 0;
            border: 0;
            background: 0;
            cursor: pointer;
            border-radius: 0;
            outline: 0;
            &:hover {
              text-decoration: underline;
            }
          `}>
          {preview ? 'Exit Admin' : 'Admin'}
        </button>
      </div>
    </footer>
  )
}

export default Footer
