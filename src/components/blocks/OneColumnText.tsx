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
      padding-top: 48px;
      &:first-child {
        padding-top: 0;
      }
    `}>
      <BlockItem index={index}>
        <div css={css`
          margin: 0 auto;
          max-width: 920px;
        `}>
          <Markdown
            name="content"
            content={data.content} />
        </div>
      </BlockItem>
    </div>
  )
}
