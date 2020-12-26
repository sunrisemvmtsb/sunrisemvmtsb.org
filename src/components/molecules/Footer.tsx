import React from 'react'
import { css } from 'styled-components'
import ButtonLink from '../atoms/ButtonLink'
import { signIn, signOut, useSession, getSession } from 'next-auth/client'
import { useCMS } from 'tinacms'

const Footer = () => {
  const cms = useCMS()
  const [ session, loading ] = useSession()

  React.useEffect(() => {
    if (loading) return
    if (session && !sessionStorage.getItem('preview')) {
      fetch('/api/preview')
        .then((response) => {
          if (response.status !== 200) throw Error('failed')
          sessionStorage.setItem('preview', 'active')
          window.location.href = window.location.pathname
        })
    } else if (!session && sessionStorage.getItem('preview')) {
      fetch('/api/reset-preview')
        .then((response) => {
          if (response.status !== 200) throw Error('failed')
          sessionStorage.removeItem('preview')
          window.location.reload()
        })
    }
  }, [session, loading])

  React.useEffect(() => {
    return cms.events.subscribe('cms:disable', () => {
      signOut()
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
          onClick={async () => {
            if (loading) return

            if (session) {
              cms.disable()
              await signOut()
              await fetch(`/api/reset-preview`)
              window.location.reload()            
              return
            }

            signIn('google')
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
          {session ? 'Exit Admin' : 'Admin'}
        </button>
      </div>
    </footer>
  )
}

export default Footer
