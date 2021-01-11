import React from 'react'
import { css } from 'styled-components'
import Typography from '../Typography'
import SocialFeed, { SocialPost } from '../molecules/SocialFeed'
import BlockItem from '../fields/BlockItem'


export type Data = {}

export const template = {
  label: 'News Headlines',
  defaultItem: {},
  fields: []
}

export const Component = ({
  index,
  posts = [],
}: {
  index: number,
  posts?: Array<SocialPost>,
}) => {
  return (
    <BlockItem index={index}>
      <section css={css`
        padding: 120px;
        background-color: #fffffb;
        position: relative;
      `}>
        <div css={css`
          max-width: 1200px;
          margin: 0 auto;
          position: relative;
        `}>
          <div css={css`
            padding-bottom: 48px;
          `}>
            <Typography variant="SectionTitle">
              Hub Updates
            </Typography>
          </div>
          <div css={css`
            display: grid;
            grid-template-columns: 1fr 2fr 1fr;
            grid-auto-flow: column;
          `}>
            <div css={css`
              display: grid;
              grid-auto-rows: auto;
              grid-auto-flow: row;
              grid-row-gap: 16px;
              padding-right: 16px;
              padding-bottom: 16px;
              border-right: 1px solid var(--sunrise-magenta);
            `}>
              {Array(6).fill(0).map((_, i) => (
                <SmallPost
                  key={i}
                  category="Category"
                  author="Author Name"
                  title="Title of the post" />
              ))}
            </div>
            <FeaturedPost
              category="Category"
              title="Title of the post"
              subtitle="Subtitle of the post" />
            <div css={css`
              padding-left: 16px;
              border-left: 1px solid var(--sunrise-magenta);
              position: relative;
            `}>
              <SocialFeed posts={posts} />
            </div>
          </div>
        </div>
      </section>
    </BlockItem>
  )
}

const FeaturedPost = ({
  category,
  title,
  subtitle,
}: {
  category: string,
  title: string,
  subtitle: string,
}) => {
  return (
    <div css={css`
      padding: 0 16px;
      display: flex;
      flex-direction: column;
      align-items: center;
    `}>
      <img
        src="/images/placeholder.svg"
        css={css`
          height: 360px;
          width: 100%;
          object-fit: cover;
          object-position: center;
        `} />
      <p css={css`
        margin: 0;
        padding: 8px 0;
        font-family: Source Sans Pro;
        font-weight: 700;
        font-size: 18px;
        line-height: 23px;
        text-align: center;
        color: var(--sunrise-magenta);
      `}>
        Category
      </p>
      <h3 css={css`
        font-family: Source Serif Pro;
        font-weight: 400;
        font-size: 40px;
        line-height: 50px;
        text-align: center;
        margin: 0;
      `}>
        Title of the post
      </h3>
      <h4 css={css`
        font-family: Source Sans Pro;
        font-style: italic;
        font-weight: 700;
        font-size: 20px;
        line-height: 25px;
        text-align: center;
        padding-top: 16px;
        margin: 0;
      `}>
        Subtitle of the post
      </h4>
    </div>
  )
}

const SmallPost = ({
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
