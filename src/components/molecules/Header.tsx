import React from 'react'
import { css } from 'styled-components'
import { Data as ConfigData } from '../../plugins/Config'
import Logo from '../atoms/Illustrations/Logo.svg'
import ButtonLink from '../atoms/ButtonLink'

const Header = ({
  config,
}: {
  config: ConfigData,
}) => {
  return (
    <header css={css`
      height: 72px;
      background-color: black;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 32px;
    `}>
      <div
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
      </div>
      <div>
        <div
          css={css`
            display: grid;
            grid-auto-flow: column;
            grid-auto-columns: auto;
            grid-column-gap: 16px;
            align-items: center;
          `}>
          {config.header.links.map((link, index) => {
            switch (link.type) {
              case 'Plain':
                return (
                  <a
                    key={index}
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
                return <ButtonLink key={index} color="White" href={link.url}>{link.title}</ButtonLink>
              
              case 'YellowButton':
                return <ButtonLink key={index} color="Yellow" href={link.url}>{link.title}</ButtonLink>
            }
          })}
        </div>
      </div>
    </header>
  )
}

export default Header
