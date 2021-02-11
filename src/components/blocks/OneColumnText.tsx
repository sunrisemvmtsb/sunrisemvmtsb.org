import React from 'react'
import { css } from 'styled-components'
import Markdown from '../fields/Markdown'
import BlockItem from '../fields/BlockItem'

export type Data = {
  content: string,
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
            margin: 0 auto;
            max-width: 920px;
            padding: 24px 32px;
          `}>
          <Markdown
            name="content"
            content={data.content} />
        </div>
      </BlockItem>
    </div>
  )
}

export default Component
