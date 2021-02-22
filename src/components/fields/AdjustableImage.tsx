import React from 'react'
import { css } from 'styled-components'
import type { Field } from 'tinacms'
import Group from './Group'
import Image from './Image'
import Preview from '../../hooks/Preview'

export type Data = {
  path: string,
  alt: string,
  x: 'center' | 'left' | 'right',
  y: 'center' | 'top' | 'bottom',
  fit: 'contain' | 'cover' | 'fill'
}

export type Props = {
  data: Data,
  name: string,
  className?: string,
}

const Editor = ({
  data,
  name,
  className,
}: Props) => {
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
      <Group
        name={name}
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
        <Image
          name="path"
          src={data.path}
          alt={data.alt} />
      </Group>
    </div>
  )
}

const Static = ({
  data,
  name,
  className,
}: Props) => {
  return (
    <div
      className={className}
      css={css`
        position: relative;
      `}>
      <img
        alt={data.alt}
        src={data.path}
        css={css`
          display: block;
          width: 100%;
          height: 100%;
          object-fit: ${data.fit};
          object-position: ${data.x} ${data.y};
        `} />
    </div>
  )
}

const AdjustableImage = Preview.component(Editor, Static)
export default AdjustableImage
