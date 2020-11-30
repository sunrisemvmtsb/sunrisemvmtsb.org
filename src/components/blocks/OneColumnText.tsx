import React from 'react'
import { css } from 'styled-components'
import { BlocksControls } from 'react-tinacms-inline'
import InlineMarkdownField from '../InlineMarkdownField'

export type Data = {
  content: string,
}

export const template = {
  label: 'One Column Text',
  defaultItem: { content: '' },
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
    <div css={css`
      padding-top: 48px;
      &:first-child {
        padding-top: 0;
      }
    `}>
    <BlocksControls
      index={index}
      focusRing={{ offset: { x: 0, y: 16 }, borderRadius: 0 }}>
      <div css={css`
        margin: 0 auto;
        max-width: 920px;
      `}>
        <InlineMarkdownField
          name="content"
          content={data.content} />
      </div>
    </BlocksControls>
    </div>
  )
}
