import React from 'react'
import { css } from 'styled-components'
import ButtonLink from '../atoms/ButtonLink'
import Preview from '../../hooks/Preview'
import AuthService from 'src/services/AuthService.client'
import container from '../../infrastructure/Container.client'
import SiteConfig from '../../domain/SiteConfig'
import Link from '../atoms/Link'
import LinkButton from '../atoms/LinkButton'
import Typography from '../Typography'
import Icon from '../atoms/Icon'

const Footer = ({
  config,
}: {
  config: SiteConfig,
}) => {
  const auth = container.get(AuthService)
  const preview = Preview.use()

  return (
    <footer css={css`
      padding: 72px;
      background-color: black;
    `}>
      <div css={css`
        max-width: 1200px;
        margin: 0 auto;
        display: flex;
        justify-content: space-between;
      `}>
        <div css={css`
          width: 50%;
          flex-shrink: 1;
        `}>
          {config.footer.buttons.length === 0 ? null :
            <div css={css`
              padding-bottom: 16px;
              display: flex;
              flex-wrap: wrap;
            `}>
            {config.footer.buttons.map((button) => (
              <div
                key={button.id}
                css={css`
                  padding-right: 16px;
                  padding-bottom: 16px;
                  flex-shrink: 0;
                `}>
                <ButtonLink
                  href={button.url}
                  target="_blank"
                  color={button.color}>
                  {button.title}
                </ButtonLink>
              </div>
            ))}
            </div>
          }
          <div
            css={css`
              display: grid;
              grid-auto-flow: row dense;
              justify-content: start;
              grid-template-columns: auto auto;
              grid-column-gap: 48px;
              grid-row-gap: 16px;
            `}>
            {config.footer.links.map((link) => (
              <div key={link.id}>
                <Link target="_blank" rel="noopener noreferrer" href={link.url}>{link.title}</Link>
              </div>
            ))}
            <div>
              <LinkButton
                onClick={async () => {
                  if (preview) {
                    await auth.signout()
                    window.location.reload()
                    return
                  }

                  auth.signin()
                }}>
                {preview ? 'Exit Admin' : 'Admin'}
              </LinkButton>
            </div>
          </div>
        </div>
        <div css={css`
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          width: 50%;
          flex-shrink: 1;
        `}>
          <div>
            <LinkButton
              onClick={() => window.scrollTo({ top: 0 })}>
              To the top
              <span
                aria-hidden="true"
                css={css`
                  margin-left: 4px;
                  margin-top: -4px;
                  display: inline-block;
                `}>
                ↑
              </span>
            </LinkButton>
          </div>
          <div css={css`
            display: grid;
            grid-auto-flow: column;
            grid-auto-columns: auto;
            grid-column-gap: 8px;
            justify-content: flex-end;
            margin-top: 32px;
          `}>
            {Object.entries(config.footer.social).map(([site, username]) => {
              const siteKey = site as keyof SiteConfig['footer']['social']
              switch (siteKey) {
                case 'email':
                  return <SvgLink key={site} url={`mailto:${username}`} icon="Email" />
                case 'facebook':
                  return <SvgLink key={site} url={`mailto:${username}`} icon="Facebook" />
                case 'instagram':
                  return <SvgLink key={site} url={`mailto:${username}`} icon="Instagram" />
                case 'twitter':
                  return <SvgLink key={site} url={`mailto:${username}`} icon="Twitter" />
              }
            })}
          </div>
          {config.footer.disclaimer &&
            <div css={css`
              color: #fff;
              padding: 16px;
              border: 1px solid #fff;
              font-size: 12px;
              margin-top: 32px;
              font-family: Sourse Serif Pro;
            `}>
              {config.footer.disclaimer}  
            </div>
          }
          <div css={css`
            margin-top: 32px;
            color: #ffde16;
            font-size: 24px;
            text-transform: uppercase;
            font-weight: 700;
            font-family: Source Sans Pro;
            text-align: right;
          `}>
            © {new Date().getFullYear()} Sunrise Movement Santa Barbara
          </div>
        </div>
      </div>
    </footer>
  )
}

const SvgLink = ({
  url,
  icon,
}: {
  url: string,
  icon: Icon,
}) => {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      css={css`
        background-color: var(--sunrise-yellow);
        border-radius: 50%;
        width: 36px;
        height: 36px;
        padding: 6px;
        transition: transform 100ms ease-in-out;
        :hover {
          transform: scale(1.2);
        }
      `}>
      <Icon
        icon={icon}
        css={css`
          fill: #000;
          width: 24px;
          height: 24px;
        `} />
    </a>
  )
}

export default Footer
