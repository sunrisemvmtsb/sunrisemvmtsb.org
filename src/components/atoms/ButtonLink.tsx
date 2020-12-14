import React from 'react'
import { css } from 'styled-components'

type Color =
  | 'Yellow'
  | 'White'

const Color = {
  backgroundColor: (color: Color) => {
    switch (color) {
      case 'Yellow': return 'var(--sunrise-yellow)'
      case 'White': return '#fff'
      default: return '#fff'
    }
  },
  color: (color: Color) => {
    switch (color) {
      case 'Yellow': return '#000'
      case 'White': return '#000'
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
  return (
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
      `}>
      {children}
    </a>
  )
}

export default ButtonLink
