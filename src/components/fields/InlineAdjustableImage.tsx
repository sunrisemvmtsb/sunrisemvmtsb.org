import React from 'react'
import { css } from 'styled-components'
import { Field } from 'tinacms'
import { InlineGroup, InlineImage } from 'react-tinacms-inline'

export type Data = {
  path: string,
  alt: string,
  x: 'center' | 'left' | 'right',
  y: 'center' | 'top' | 'bottom',
  fit: 'contain' | 'cover' | 'fill'
}

const InlineAdjustableImage = ({
  data,
  name,
  className,
}: {
  data: Data,
  name: string,
  className?: string,
}) => {
  return (
    <div
      className={className}
      css={css`
        position: relative;
        img {
          display: block;
          width: 100%;
          height: 100%;
          object-fit: ${data.fit};
          object-position: ${data.x} ${data.y};
        }
      `}>
      <InlineGroup
        name={name}
        focusRing={{ offset: 0, borderRadius: 0 }}
        insetControls
        fields={[
          {
            name: 'alt',
            label: 'Alt Text',
            component: 'text',
            defaultValue: '',
            description: 'Written copy to help screen-reading tools describe images to visually impaired readers',
          },
          {
            name: 'fit',
            label: 'Resizing',
            description: 'Choose how the image should adjust to being resized. Contain will ensure the image retrains its aspect ratio while not covering the total area. Cover will cover the total area while maintaining the aspect ratio. Fill will cover the total area by stretching the image, not maintaining the aspect ratio.',
            component: 'select',
            defaultValue: 'cover',
            options: ['cover', 'contain', 'fill'],
          } as Field,
          {
            name: 'x',
            label: 'Horizontal Position',
            component: 'select',
            options: ['center', 'left', 'right'],
            defaultValue: 'center',
            description: 'Adjust how the image is positioned horizontally when resized',
          } as Field,
          {
            name: 'y',
            label: 'Vertical Position',
            component: 'select',
            options: ['center', 'top', 'bottom'],
            defaultValue: 'center',
            description: 'Adjust how the image is positioned vertically when resized',
          } as Field,
        ]}>
        <InlineImage
          name="path"
          alt={data.alt}
          parse={(media) => media.id}
          focusRing={{ offset: 0, borderRadius: 0 }} />
      </InlineGroup>
    </div>
  )
}

export default InlineAdjustableImage
