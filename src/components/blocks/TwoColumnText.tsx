import React from 'react'
import { css } from 'styled-components'
import Markdown from '../fields/Markdown'
import BlockItem from '../fields/BlockItem'

export type Data = {
  leftContent: string,
  rightContent: string,
}

export const template = {
  label: 'Two Column Text',
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
      & + & {
        padding-top: 32px;
      }
    `}>
      <BlockItem index={index}>
        <div css={css`
          display: grid;
          grid-template-columns: 1fr 1fr;
          padding: 0 32px;
          grid-column-gap: 64px;
          grid-auto-flow: column;
          max-width: 920px;
          margin: 0 auto;
        `}>
          <Markdown
            name="leftContent"
            content={data.leftContent} />
          <Markdown
            name="rightContent"
            content={data.rightContent} />
        </div>
      </BlockItem>
    </div>
  )
}
