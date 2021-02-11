import React from 'react'
import { css } from 'styled-components'
import SiteConfig from '../../domain/SiteConfig'
import Logo from '../atoms/Illustrations/Logo.svg'
import ButtonLink from '../atoms/ButtonLink'
import IconButton from '../atoms/IconButton'
import Link from '../atoms/Link'
import { useRouter } from 'next/router'

const Header = ({
  config,
}: {
  config: SiteConfig,
}) => {
  const router = useRouter()
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false)

  React.useEffect(() => {
    document.body.style.overflowY = mobileMenuOpen ? 'hidden' : ''
  }, [mobileMenuOpen])

  React.useEffect(() => {
    const handler = () => setMobileMenuOpen(false)
    router.events.on('routeChangeStart', handler)
    return () => router.events.off('routeChangeStart', handler)
  }, [router, setMobileMenuOpen])

  return (
    <header css={css`
      height: 72px;
      background-color: black;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 32px;
      @media(max-width: 768px) {
        height: 60px;
        padding: 0 16px;
      }
    `}>
      <a
        href="/"
        css={css`
          display: flex;
          align-items: center;
          justify-content: center;
        `}>
        <Logo
          css={css`
            display: block;
            fill: var(--sunrise-yellow);
            margin-right: 8px;
            height: 32px;
          `} />
        <div>
          <div css={css`
            font-family: Source Sans Pro;
            color: var(--sunrise-yellow);
            text-transform: uppercase;
            line-height: 1;
            font-size: 10px;
            padding-left: 2px;
          `}>
            Sunrise Mvmt
          </div>
          <div css={css`
            font-family: Source Sans Pro;
            color: var(--sunrise-yellow);
            text-transform: uppercase;
            line-height: 1;
            font-weight: 900;
            font-size: 24px;
          `}>
            Santa Barbara
          </div>
        </div>
      </a>
      <div css={css`
        display: none;
        color: rgba(255,255,255,0.87);
        @media(max-width: 768px) {
          display: block;
        }
      `}>
        <IconButton
          icon="Menu"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)} />
      </div>
      {!mobileMenuOpen ? null :
        <div
          css={css`
            position: fixed;
            top: 59px;
            left: 0;
            right: 0;
            bottom: 0;
            background-color: rgba(0,0,0,0.6);
            overflow-y: auto;
            -webkit-overflow-scrolling: touch;
            z-index: 999999999;
          `}
          onClick={() => {
            setMobileMenuOpen(false)
          }}>
          <div
            css={css`
              background-color: #000;
              padding: 32px 24px;
              display: flex;
              flex-wrap: wrap;
            `}
            onClick={(e) => {
              e.stopPropagation()
            }}>
            {config.header.links.map((link, index) => {
              switch (link.type) {
                case 'Plain':
                  return (
                    <div
                      key={index}
                      css={css`
                        margin: 0 8px 16px;
                        width: 100%;
                      `}>
                      <Link href={link.url}>{link.title}</Link>
                    </div>
                  )

                case 'WhiteButton':
                case 'YellowButton':
                  return (
                    <div
                      key={index}
                      css={css`
                        margin-bottom: 16px;
                        margin-left: 8px;
                        margin-right: 8px;
                      `}>
                      <ButtonLink color={link.type === 'YellowButton' ? 'Yellow' : 'White'} href={link.url}>{link.title}</ButtonLink>
                    </div>
                  )
              }
            })}
          </div>
        </div>
      }
      <div css={css`
        @media(max-width: 768px) {
          display: none;
        }
      `}>
        <div
          css={css`
            display: grid;
            grid-auto-flow: column;
            grid-auto-columns: auto;
            grid-column-gap: 24px;
            align-items: center;
          `}>
          {config.header.links.map((link) => {
            switch (link.type) {
              case 'Plain':
                return (
                  <a
                    key={link.id}
                    href={link.url}
                    css={css`
                      display: block;
                      color: var(--sunrise-yellow);
                      font-weight: 700;
                      text-transform: uppercase;
                    `}>
                    {link.title}
                  </a>
                )

              case 'WhiteButton':
                return <ButtonLink key={link.id} color="White" href={link.url}>{link.title}</ButtonLink>
              
              case 'YellowButton':
                return <ButtonLink key={link.id} color="Yellow" href={link.url}>{link.title}</ButtonLink>
            }
          })}
        </div>
      </div>
    </header>
  )
}

export default Header
