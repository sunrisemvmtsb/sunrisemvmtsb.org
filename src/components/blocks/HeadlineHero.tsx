import React from 'react'
import { css } from 'styled-components'
import Textarea from '../fields/Textarea'
import BlockItem from '../fields/BlockItem'

export type Data = {
  lead: string,
  title: string,
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
    <BlockItem index={index}>
      <header
        css={css`
          border-image-source: linear-gradient(to bottom, #8F0D56, #EF4C39, #FFDE16);
          border-style: solid;
          border-image-slice: 1;
          border-width: 5px;
          padding: 120px;
          background-color: #E3EEDF;
        `}>
        <div css={css`
          margin: 0 auto;
          max-width: 920px;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
        `}>
          <div css={css`
            margin: 0;
            background-color: #000;
            color: #FFF;
            font-size: 18px;
            font-family: 'Source Serif Pro';
            font-style: italic;
            font-weight: 900;
            padding: 0 4px;
            line-height: 23px;
            margin-bottom: 8px;
            margin-left: 8px;
          `}>
            <Textarea
              name="lead"
              children={data.lead} />
          </div>
          <h1 css={css`
            margin: 0;
            padding: 0 8px;
            background-color: #FFDE16;
            font-weight: 900;
            font-size: 60px;
            line-height: 75px;
            color: #000;
          `}>
            <Textarea
              name="title"
              children={data.title}  />
          </h1>
        </div>
      </header>
    </BlockItem>
  )
}

export default Component
