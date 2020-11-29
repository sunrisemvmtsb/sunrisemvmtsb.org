import React from 'react'
import { css } from 'styled-components'

export type Variant =
  | 'ContentTitle'

const Variant = {
  family: (variant: Variant) => {
    switch (variant) {
      case 'ContentTitle': return 'Source Sans Pro'
      default: return 'Source Serif Pro'
    }
  },
  size: (variant: Variant) => {
    switch (variant) {
      case 'ContentTitle': return 30
      default: return 18
    }
  },
  weight: (variant: Variant) => {
    switch (variant) {
      case 'ContentTitle': return 700
      default: return 400
    }
  },
}

const Typography = ({
  variant,
  children,
}: React.PropsWithChildren<{
  variant: Variant,
}>) => {
  return (
    <span css={css`
      font-family: ${Variant.family(variant)};
      font-weight: ${Variant.weight(variant)};
      font-size: ${Variant.size(variant)}px;
    `}>
      {children}
    </span>
  )
}

export default Typography
