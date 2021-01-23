import React from 'react'
import { css } from 'styled-components'
import ButtonLink from '../atoms/ButtonLink'
import Preview from '../../contexts/Preview'
import AuthService from 'src/services/AuthService.client'
import container from '../../infrastructure/Container.client'

const Footer = () => {
  const auth = container.get(AuthService)
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
              await auth.signout()
              window.location.reload()
              return
            }

            auth.signin()
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
