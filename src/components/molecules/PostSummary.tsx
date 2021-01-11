import React from 'react'
import { css } from 'styled-components'

const PostSummary = ({
  author,
  category,
  title,
}: {
  author: string,
  category: string,
  title: string,
}) => {
  return (
    <article css={css`
      display: grid;
      grid-template-columns: 80px 1fr;
      grid-template-rows: auto auto 1fr;
      grid-column-gap: 8px;
    `}>
      <img
        src="/images/placeholder.svg"
        css={css`
          width: 80px;
          height: 80px;
          object-fit: cover;
          object-position: center center;
          grid-row: 1 / span 3;
          grid-column: 1 / span 1;
        `}/>
      <p css={css`
        font-family: Source Sans Pro;
        font-weight: 700;
        font-size: 12px;
        line-height: 15px;
        display: flex;
        align-items: center;
        color: var(--sunrise-magenta);
        margin: 0;
        grid-row: 1 / span 1;
        grid-column: 2 / span 1;
        text-transform: uppercase;
      `}>
        {category}
      </p>
      <h3 css={css`
        font-family: Source Serif Pro;
        font-size: 18px;
        line-height: 23px;
        font-weight: 400;
        color: #000;
        margin: 0;
        margin-bottom: 4px;
        grid-row: 2 / span 1;
        grid-column: 2 / span 1;
      `}>
        {title}
      </h3>
      <p css={css`
        font-family: Source Serif Pro;
        font-weight: 700;
        font-size: 12px;
        line-height: 15px;
        margin: 0;
        grid-row: 3 / span 1;
        grid-column: 2 / span 1;
      `}>
        {author}
      </p>
    </article>
  )
}

export default PostSummary
