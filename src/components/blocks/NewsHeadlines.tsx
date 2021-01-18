import React from 'react'
import { css } from 'styled-components'
import Typography from '../Typography'
import SocialFeed from '../molecules/SocialFeed'
import BlockItem from '../fields/BlockItem'
import NewsSummary from '../../domain/NewsSummary'
import { Temporal } from 'proposal-temporal'
import Image from '../../components/atoms/Image'
import SocialPost from '../../domain/SocialPost'


export const template = {
  label: 'News Headlines',
  defaultItem: {},
  fields: []
}

export const Component = ({
  index,
  posts = [],
  news = [],
}: {
  index: number,
  news?: Array<NewsSummary>,
  posts?: Array<SocialPost>,
}) => {
  const sorted = React.useMemo(() => {
    return news
      .slice()
      .sort((l, r) => Temporal.Instant.compare(r.published, l.published))
  }, [news])

  const [first, rest] = React.useMemo(() => {
    return [sorted[0], sorted.slice(1, 7)]
  }, [sorted])

  if (sorted.length === 0) return null

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
              align-content: start;
            `}>
              {rest.map((p) => (
                <SmallPost
                  key={p.title + p.published}
                  summary={p} />
              ))}
            </div>
            <FeaturedPost summary={first} />
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
  summary
}: {
  summary: NewsSummary,
}) => {
  return (
    <a
      href={summary.url}
      css={css`
        padding: 0 16px;
        display: flex;
        flex-direction: column;
        align-items: center;
        &:hover h3 {
          text-decoration: underline;
        }
      `}>
      <Image
        image={summary.image}
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
        {summary.category}
      </p>
      <h3 css={css`
        font-family: Source Serif Pro;
        font-weight: 400;
        font-size: 40px;
        line-height: 50px;
        text-align: center;
        margin: 0;
      `}>
        {summary.title}
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
        {summary.subtitle}
      </h4>
    </a>
  )
}

const SmallPost = ({
  summary,
}: {
  summary: NewsSummary,
}) => {
  return (
    <article>
      <a
        href={summary.url}
        css={css`
          display: grid;
          grid-template-columns: 80px 1fr;
          grid-template-rows: auto auto 1fr;
          grid-column-gap: 8px;
          &:hover h3 {
            text-decoration: underline;
          }
        `}>
        <Image
          image={summary.image}
          css={css`
            width: 80px;
            height: 80px;
            grid-row: 1 / span 3;
            grid-column: 1 / span 1;
          `} />
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
          {summary.category}
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
          {summary.title}
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
          {summary.author}
        </p>
      </a>
    </article>
  )
}
