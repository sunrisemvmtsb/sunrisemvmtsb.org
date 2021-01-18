import React from 'react'
import { css } from 'styled-components'
import AdjustableImage from '../../domain/AdjustableImage'

export type Props = {
  image: AdjustableImage,
  className?: string,
}

const Image = ({
  image,
  className,
}: Props) => {
  return (
    <div
      className={className}
      css={css`
        position: relative;
      `}>
      <img
        alt={image.alt}
        src={image.path}
        css={css`
          display: block;
          width: 100%;
          height: 100%;
          object-fit: ${image.fit};
          object-position: ${image.x} ${image.y};
        `} />
    </div>
  )
}

export default Image
