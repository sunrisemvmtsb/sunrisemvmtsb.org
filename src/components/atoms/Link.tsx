import React from 'react'
import { css } from 'styled-components'
import NextLink from 'next/link'

const Link = ({
  href,
  target,
  children,
}: React.PropsWithChildren<{
  href: string,
  target?: string,
  rel?: string,
}>) => {
  return target ?
  (
    <a
      target={target}
      href={href}
      css={css`
        font-family: Source Sans Pro;
        font-size: 18px;
        font-weight: 700;
        line-height: 1.2;
        color: var(--sunrise-yellow);
        text-transform: uppercase;
        padding: 0;
        border: 0;
        background: 0;
        cursor: pointer;
        border-radius: 0;
        outline: 0;
        border-bottom: 1px solid transparent;
        &:hover {
          border-color: currentColor;
        }
      `}>
      {children}
    </a>
  ) :
  (
    <NextLink href={href}>
      <a css={css`
        font-family: Source Sans Pro;
        font-size: 18px;
        font-weight: 700;
        line-height: 1.2;
        color: var(--sunrise-yellow);
        text-transform: uppercase;
        padding: 0;
        border: 0;
        background: 0;
        cursor: pointer;
        border-radius: 0;
        outline: 0;
        border-bottom: 1px solid transparent;
        &:hover {
          border-color: currentColor;
        }
      `}>
        {children}
      </a>
    </NextLink>
  )
}

export default Link
