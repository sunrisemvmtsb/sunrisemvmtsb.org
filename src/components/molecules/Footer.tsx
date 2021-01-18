import React from 'react'
import { css } from 'styled-components'
import ButtonLink from '../atoms/ButtonLink'
import { signIn, signOut, getSession, Session } from 'next-auth/client'
import { useCMS } from 'tinacms'
import Preview from '../../contexts/Preview'

const useSession = () => {
  const mounted = React.useRef(true)
  React.useLayoutEffect(() => {
    return () => { mounted.current = false }
  })
  const [ loading, setLoading ] = React.useState(true)
  const [ session, setSession ] = React.useState<Session | null | undefined>(undefined)

  React.useEffect(() => {
    getSession()
      .then((result) => {
        if (!mounted.current) return
        setSession(result)
        setLoading(false)
      })
      .catch(() => {
        if (!mounted.current) return
        setSession(null)
        setLoading(false)
      })
  })

  return [ session, loading ]
}

const Footer = () => {
  const cms = useCMS()
  const [ session, loading ] = useSession()
  const preview = Preview.use()

  const doSignOut = React.useCallback(() => {
    fetch('/api/reset-preview')
      .then((response) => {
        if (response.status !== 200) throw Error('failed')
        sessionStorage.removeItem('preview')
        window.dispatchEvent(new Event('storage'))
        signOut()
      })
  }, [cms])

  React.useEffect(() => {
    if (loading) return
    if (session && !preview) {
      fetch('/api/preview')
        .then((response) => {
          if (response.status !== 200) throw Error('failed')
          sessionStorage.setItem('preview', 'active')
          window.dispatchEvent(new Event('storage'))
          cms.enable()
          history.replaceState("", document.title, window.location.pathname + window.location.search)
        })
    }
  }, [session, loading])

  React.useEffect(() => {
    return cms.events.subscribe('cms:disable', () => {
      doSignOut()
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
