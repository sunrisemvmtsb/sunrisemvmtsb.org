import React from 'react'
import { css } from 'styled-components'

export type Variant =
  | 'SectionTitle'
  | 'ContentTitle'
  | 'Body'
  | 'Caption'


const Variant = {
  family: (variant: Variant) => {
    switch (variant) {
      case 'SectionTitle': return 'Source Sans Pro'
      case 'ContentTitle': return 'Source Sans Pro'
      case 'Body': return 'Source Serif Pro'
      case 'Caption': return 'Source Serif Pro'
      default: return 'Source Serif Pro'
    }
  },
  size: (variant: Variant) => {
    switch (variant) {
      case 'SectionTitle': return 40
      case 'ContentTitle': return 30
      case 'Body': return 18
      case 'Caption': return 14
      default: return 18
    }
  },
  weight: (variant: Variant) => {
    switch (variant) {
      case 'SectionTitle': return 900
      case 'ContentTitle': return 700
      case 'Body': return 400
      case 'Caption': return 400
      default: return 400
    }
  },
  transform: (variant: Variant) => {
    switch (variant) {
      case 'SectionTitle': return 'uppercase'
      case 'ContentTitle': return 'none'
      case 'Body': return 'none'
      case 'Caption': return 'none'
      default: return 'none'
    }
  }
}

const Typography = ({
  variant,
  children,
}: React.PropsWithChildren<{
  variant: Variant,
}>) => {
  return (
    <div css={css`
      &, textarea {
        font-family: ${Variant.family(variant)};
        font-weight: ${Variant.weight(variant)};
        font-size: ${Variant.size(variant)}px;
        text-transform: ${Variant.transform(variant)};
        color: inherit;
      }
    `}>
      {children}
    </div>
  )
}

export default Typography
