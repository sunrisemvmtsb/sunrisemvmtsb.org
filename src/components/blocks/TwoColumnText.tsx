import React from 'react'
import { css } from 'styled-components'
import Markdown from '../fields/Markdown'
import BlockItem from '../fields/BlockItem'

export type Data = {
  leftContent: string,
  rightContent: string,
}

export type Props = {
  index: number,
  data: Data,
}

const Component = ({
  index,
  data,
}: Props) => {
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
            display: grid;
            grid-template-columns: 1fr 1fr;
            grid-column-gap: 64px;
            grid-auto-flow: column;
            max-width: 920px;
            margin: 0 auto;
            padding: 24px 64px;
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

export default Component
