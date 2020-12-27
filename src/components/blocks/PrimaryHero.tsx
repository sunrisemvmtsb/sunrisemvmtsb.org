import React from 'react'
import { css } from 'styled-components'
import { BlocksControls, InlineBlocks } from 'react-tinacms-inline'
import InlineAdjustableImage, { Data as InlineAdjustableImageData } from '../fields/InlineAdjustableImage'
import { useCMS } from 'tinacms'

export type Data = {
  background: InlineAdjustableImageData,
}

export const template = {
  label: 'Primary Hero',
  fields: [],
  defaultItem: {
    background: {
      path: '/images/placeholder.svg',
      alt: '',
      x: 'center',
      y: 'center',
      fit: 'cover',
    },
  },
}

export const Component = ({
  index,
  data,
}: {
  index: number,
  data: Data,
}) => {
  const cms = useCMS()

  return (
    <BlocksControls
      focusRing={{ borderRadius: 0, offset: 0 }}
      index={index}>
      <header css={css`
        position: relative;
        padding: 120px;
      `}>
        <div css={css`
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          z-index: 0;
        `}>
          <InlineAdjustableImage
            name="background"
            data={data.background}
            css={css`
              width: 100%;
              height: 100%;
              z-index: 1;
            `} />
          <div css={css`
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: #753559;
            z-index: 2;
            pointer-events: none;
            mix-blend-mode: multiply;
            opacity: 0.8;
          `} />
        </div>
        <div css={css`
          position: relative;
          z-index: 1;
          pointer-events: ${cms.enabled ? 'none' : 'all'};
          padding-right: 464px;
        `}>
          <h1 css={css`
            font-size: 104px;
            margin: 0;
            text-transform: uppercase;
            font-weight: 700;
            color: #fff;
            line-height: 93.6px;
          `}>
            <span css={css`display: block;`}>We are</span>
            <span css={css`
              display: block;
              color: #ffde16;
            `}>
              Sunrise
            </span>
            <span css={css`display: block;`}>Santa Barbara</span>
          </h1>
        </div>
      </header>
    </BlocksControls>
  )
}
