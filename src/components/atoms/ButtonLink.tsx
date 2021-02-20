import React from 'react'
import { css } from 'styled-components'
import NextLink from 'next/link'

type Color =
  | 'Yellow'
  | 'White'
  | 'Magenta'

const Color = {
  backgroundColor: (color: Color) => {
    switch (color) {
      case 'Yellow': return 'var(--sunrise-yellow)'
      case 'White': return '#fff'
      case 'Magenta': return 'var(--sunrise-magenta)'
      default: return '#fff'
    }
  },
  color: (color: Color) => {
    switch (color) {
      case 'Yellow': return '#000'
      case 'White': return '#000'
      case 'Magenta': return '#FFF'
      default: return '#000'
    }
  }
}

const ButtonLink = ({
  color,
  href,
  target,
  children,
}: React.PropsWithChildren<{
  href: string,
  color: Color,
  target?: string
}>) => {
  return target ? (
    <a
      href={href}
      target={target}
      css={css`
        font-family: Source Sans Pro;
        font-weight: 700;
        font-size: 16px;
        line-height: 20px;
        text-transform: uppercase;
        display: inline-block;
        padding: 12px;
        background-color: ${Color.backgroundColor(color)};
        color: ${Color.color(color)};
        cursor: pointer;
      `}>
      {children}
    </a>
  ) :
  (
    <NextLink href={href}>
      <a css={css`
        font-family: Source Sans Pro;
        font-weight: 700;
        font-size: 16px;
        line-height: 20px;
        text-transform: uppercase;
        display: inline-block;
        padding: 12px;
        background-color: ${Color.backgroundColor(color)};
        color: ${Color.color(color)};
        cursor: pointer;
      `}>
        {children}
      </a>
    </NextLink>
  )
}

export default ButtonLink
