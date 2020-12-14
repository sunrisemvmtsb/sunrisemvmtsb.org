import React from 'react'
import { css } from 'styled-components'
import { BlocksControls, InlineText, InlineTextarea, InlineImage } from 'react-tinacms-inline'
import Typography from '../Typography'

export type Data = {
  callout: string,
  title: string,
  url: string,
  description: string,
  image: string,
}

export const template = {
  label: 'Call To Action',
  defaultItem: {
    callout: '',
    title: '',
    url: '',
    description: '',
    image: '/images/placeholder.svg',
  },
  fields: []
}

export const Component = ({
  index,
  data,
}: {
  index: number,
  data: Data,
}) => {
  return (
    <BlocksControls
      index={index}
      focusRing={{ offset: { x: 0, y: 0 }, borderRadius: 0 }}>
      <div css={css`
        padding: 120px;
        padding-top: 60px;
        background-color: #fffffb;
      `}>
        <div css={css`
          margin: 0 auto;
          max-width: 1200px;
          display: grid;
          grid-template-columns: 1fr 400px;
          grid-column-gap: 72px;
          position: relative;
        `}>
          <div css={css`
            display: grid;
            grid-template-rows: auto auto;
            grid-template-columns: auto 1fr;
            grid-row-gap: 32px;
            grid-column-gap: 40px;
          `}>
            <div css={css`
              grid-row: 1 / span 1;
              grid-column: 1 / span 2;
            `}>
              <Typography variant="SectionTitle">
                <InlineTextarea
                  name="callout"
                  focusRing={{ borderRadius: 0 }} />
              </Typography>
            </div>
            <div css={css`
              grid-row: 2 / span 1;
              grid-column: 1 / span 1;
              img {
                width: 120px;
                height: 120px;
              }
            `}>
              <InlineImage
                name="image"
                parse={(media) => media.id} />
            </div>
            <div css={css`
              grid-row: 2 / span 1;
              grid-column: 2 / span 1;
            `}>
              <div css={css`
                font-family: Source Sans Pro;
                font-style: normal;
                font-weight: 700;
                font-size: 30px;
                line-height: 38px;
                color: #8F0D56;
                text-decoration: underline;
                padding-bottom: 16px;
              `}>
                <InlineTextarea
                  name="title"
                  focusRing={{ borderRadius: 0 }} />
              </div>
              <Typography variant="Body">
                <InlineTextarea
                  name="description"
                  focusRing={{ borderRadius: 0 }} />
              </Typography>
            </div>
          </div>
          <div css={css`
            position: relative;
          `}>
            <div css={css`
              border-image-source: linear-gradient(to bottom, #8F0D56, #EF4C39, #FFDE16);
              border-style: solid;
              border-image-slice: 1;
              border-width: 5px;
              padding: 0 16px;
              padding-bottom: 24px;
              transform: translateY(-40%);
              z-index: calc(var(--tina-z-index-1) - 1);
              position: absolute;
              width: 100%;
            `}>
              <div css={css`
                background-color: var(--sunrise-yellow);
                margin-top: -53px;
                box-shadow: 0px 4px 16px rgba(0, 0, 0, 0.25);
                position: relative;
                min-height: 480px;
              `}>
              </div>
            </div>
          </div>
        </div>
      </div>
    </BlocksControls>
  )
}