import React from 'react'
import { css } from 'styled-components'
import ButtonLink from '../atoms/ButtonLink'
import Preview from '../../contexts/Preview'
import base64 from 'base-64'
import AuthService from 'src/services/AuthService'

const signin = async () => {
  const validChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  const array = new Uint8Array(40)
  crypto.getRandomValues(array)
  const chars = array.map((x) => validChars.charCodeAt(x % validChars.length))
  const csrf = String.fromCharCode(...chars)

  const state = base64.encode(JSON.stringify({ csrf, redirect: window.location.href }))

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


const Footer = () => {
  const preview = Preview.use()

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
          onClick={async () => {
            if (preview) {
              await AuthService.instance.signout()
              window.location.reload()
              return
            }

            signin()
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
