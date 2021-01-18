import React from 'react'
import { css } from 'styled-components'
import Markdown from '../fields/Markdown'
import BlockItem from '../fields/BlockItem'

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
      &:first-child [data-inner] {
        padding-top: 0;
      }
      &:last-child [data-inner] {
        padding-bottom: 0;
      }
    `}>
      <BlockItem index={index}>
        <div
          data-inner
          css={css`
            margin: 0 auto;
            max-width: 920px;
            padding: 24px 0;
          `}>
          <Markdown
            name="content"
            content={data.content} />
        </div>
      </BlockItem>
    </div>
  )
}
