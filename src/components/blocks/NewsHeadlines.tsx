import React from 'react'
import { css } from 'styled-components'
import Typography from '../Typography'
import { BlocksControls } from 'react-tinacms-inline'


export type Data = {}

export const template = {
  label: 'News Headlines',
  defaultItem: {},
  fields: []
}

export const Component = ({
  index,
}, {
  index: number,
}) => {
  return (
    <BlocksControls
      index={index}
      focusRing={{ offset: 0, borderRadius: 0 }}>
      <section css={css`
        padding: 120px;
        background-color: #fffffb;
      `}>
        <div css={css`
          max-width: 1200px;
          margin: 0 auto;
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
            `}>
              <div css={css`
                padding-bottom: 16px;
                border-bottom: 1px solid rgba(0, 0, 0, 0.1);
                display: grid;
                grid-template-columns: 48px 1fr;
                grid-auto-flow: column;
                grid-column-gap: 16px;
              `}>
                <div css={css`
                  background-color: var(--sunrise-yellow);
                  width: 48px;
                  height: 48px;
                  padding: 6px;
                `}>
                  <img
                    src="/images/logo.svg"
                    css={css`
                      width: 36px;
                      height: 36px;
                    `} />
                </div>
                <div>
                  <p css={css`
                    font-family: Source Sans Pro;
                    font-weight: 700;
                    font-size: 18px;
                    line-height: 1;
                    margin: 0;
                    color: #000;
                    padding-bottom: 8px;
                  `}>
                    Sunrise Santa Barbara
                  </p>
                  <div>
                    <a
                      css={css`
                        font-family: Source Sans Pro;
                        font-weight: 700;
                        font-size: 12px;
                        line-height: 12px;
                        color: #FFF;
                        text-transform: uppercase;
                        display: inline-flex;
                        padding: 4px;
                        background: #1B95E0;
                        align-items: center;
                        margin-right: 8px;
                      `}>
                      <img
                        src="/images/twitter.svg"
                        css={css`
                          width: 12px;
                          height: 12px;
                          margin-right: 4px;
                        `} />
                      Follow
                    </a>
                    <a
                      css={css`
                        font-family: Source Sans Pro;
                        font-weight: 700;
                        font-size: 12px;
                        line-height: 12px;
                        color: #FFF;
                        text-transform: uppercase;
                        display: inline-flex;
                        padding: 4px;
                        background: linear-gradient(51.55deg, #FEDA77 9.78%, #F58529 23.88%, #DD2A7B 39.79%, #8134AF 62.56%, #515BD4 88.78%);
                        align-items: center;
                        margin-right: 8px;
                      `}>
                      <img
                        src="/images/instagram.svg"
                        css={css`
                          width: 12px;
                          height: 12px;
                          margin-right: 4px;
                        `} />
                      Follow
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </BlocksControls>
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
