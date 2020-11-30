import React from 'react'
import { css } from 'styled-components'

const HeadlineHero = ({
  lead,
  title,
}: {
  lead: string,
  title: string,
}) => {
  return (
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
        <p css={css`
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
          {lead}
        </p>
        <h1 css={css`
          margin: 0;
          padding: 0 8px;
          background-color: #FFDE16;
          font-weight: 900;
          font-size: 60px;
          line-height: 75px;
          color: #000;
        `}>
          {title}
        </h1>
      </div>
    </header>
  )
}

export default HeadlineHero
