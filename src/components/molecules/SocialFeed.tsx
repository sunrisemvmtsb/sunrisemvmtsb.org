import React from 'react'
import { css } from 'styled-components'
import Typography from '../Typography'
import Theme from '../Theme'
import Icon from '../atoms/Icon'

export type SocialPost =
  | {
      id: string,
      type: 'Instagram',
      url: string,
      image: string,
      caption: string,
      timestamp: number,
      avatar: string,
      profile: string,
      video: boolean,
      comments: number,
      interactions: number,
    }

const SocialFeed = ({
  posts,
}: {
  posts: Array<SocialPost>,
}) => {
  const sortedPosts = React.useMemo(() => {
    return posts.slice().sort((l, r) => {
      return l.timestamp - r.timestamp
    })
  }, [posts])

  return (
    <div css={css`
      position: relative;
      display: grid;
      grid-auto-flow: row;
      grid-template-rows: auto minmax(0, 1fr);
      overflow: hidden;
      height: 100%;
      position: absolute;
    `}>
      <div css={css`
        padding-bottom: 24px;
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
              href="https://instagram.com/sunrisemvmtsb"
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
      <div css={css`
        overflow-y: auto;
        display: grid;
        grid-auto-flow: row;
        grid-row-gap: 16px;
        padding-top: 24px;
      `}>
        {sortedPosts.map((post) => {
          switch (post.type) {
            case 'Instagram': {
              return (
                <InstagramPost
                  key={`Instagram-${post.id}`}
                  url={post.url}
                  image={post.image}
                  caption={post.caption}
                  video={post.video}
                  comments={post.comments}
                  interactions={post.interactions}
                  profile={post.profile}
                  avatar={post.avatar} />
              )
            }
          }
        })}
      </div>
    </div>
  )
}

export default SocialFeed

const InstagramPost = ({
  url,
  image,
  caption,
  video,
  comments,
  interactions,
  avatar,
  profile,
}: {
  url: string,
  image: string,
  caption: string,
  video: boolean,
  comments: number,
  interactions: number,
  avatar: string,
  profile: string,
}) => {
  const parsed = React.useMemo(() => {
    return caption
      .split('\n\n')
      .map(parse)
  }, [caption])

  return (
    <div css={css`
      border-bottom: 1px solid ${Theme.colors.grayBorder};
      padding-bottom: 24px;
      &:last-child {
        border-bottom: 0;
        padding-bottom: 0;
      }
    `}>
      <a
        target="_blank"
        rel="noopener noreferrer"
        href={`https://instagram.com/${profile}`}
        css={css`
          display: grid;
          grid-template-columns: auto 1fr auto;
          grid-column-gap: 8px;
          margin-bottom: 16px;
          align-items: center;
        `}>
        <img
          src={avatar}
          css={css`
            width: 40px;
            height: 40px;
            object-fit: cover;
            object-position: center;
            border-radius: 50%;
          `} />
        <div>
          <div css={css`
            font-family: Source Sans Pro;
            font-weight: 700;
            font-size: 18px;
            color: ${Theme.colors.magenta};
            &:hover {
              text-decoration: underline;
            }
          `}>
            {profile}
          </div>
          <div css={css`
            font-family: Source Sans Pro;
            font-size: 12px;
            line-height: 1;
            margin-top: -2px;
            color: #000;
            opacity: 0.5;
          `}>
            on Instagram
          </div>
        </div>
        <Icon
          icon="Instagram"
          css={css`
            fill: #000;
            width: 20px;
            height: 20px;
            opacity: 0.5;
          `} />
      </a>
      <a
        href={url}
        css={css`
          display: block;
          margin-bottom: 8px;
          position: relative;
        `}>
        <img
          src={image}
          css={css`
            width: 100%;
            display: block;
          `} />
        <div css={css`
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-color: ${Theme.colors.imageHoverOverlay};
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 32px;
          color: #fff;

          opacity: 0;
          &:hover {
            opacity: 1;
          }
        `}>
          {video &&
            <Icon
              icon="Videocam"
              css={css`
                width: 24px;
                height: 24px;
                position: absolute;
                top: 16px;
                right: 16px;
                fill: currentColor;
              `} />
          }
          <div css={css`
            display: flex;
            align-items: center;
            margin-right: 16px;
          `}>
            <Icon
              icon={video ? 'PlayArrow' : 'Favorite'}
              css={css`
                width: 24px;
                height: 24px;
                fill: currentColor;
                margin-right: 4px;
              `} />
            <span css={css`
              font-size: 24px;
              font-family: Source Sans Pro;
            `}>
              {interactions}
            </span>
          </div>
          <div css={css`
            display: flex;
            align-items: center;
          `}>
            <Icon
              icon="Comment"
              css={css`
                width: 24px;
                height: 24px;
                fill: currentColor;
                margin-right: 4px;
              `} />
            <span css={css`
              font-size: 24px;
              font-family: Source Sans Pro;
            `}>
              {comments}
            </span>
          </div>
        </div>
      </a>
      <Typography variant="Caption">
        {parsed.map((paragraph, pi) => {
          return (
            <p
              key={pi}
              css={css`
                margin: 0;
                margin-bottom: 4px;
                &:last-child {
                  margin-bottom: 0;
                }
              `}>
              {paragraph.map((token, ti) => {
                switch (token.type) {
                  case 'Text':
                    return <span key={ti}>{token.value}</span>
                  case 'Hashtag':
                    return (
                      <a
                        key={ti}
                        target="_blank"
                        rel="noopener noreferrer"
                        href={`https://instagram.com/explore/tags/${token.value.toLowerCase()}`}
                        css={css`
                          color: ${Theme.colors.magenta};
                        `}>
                        #{token.value}
                      </a>
                    )
                  case 'Mention':
                    return (
                      <a
                        key={ti}
                        target="_blank"
                        rel="noopener noreferrer"
                        href={`https://instagram.com/${token.value}`}
                        css={css`
                          color: ${Theme.colors.magenta};
                        `}>
                        @{token.value}
                      </a>
                    )
                }
              })}
            </p>
          )
        })}
      </Typography>
    </div>
  )
}

type Token
  = { type: 'Text', value: string }
  | { type: 'Hashtag', value: string }
  | { type: 'Mention', value: string }

const parse = (input: string): Array<Token> => {
  let active: Token | null = null
  const output = []
  const length = input.length
  for (let i = 0; i < length; i++) {
    const current = input[i]
    
    if (i === length - 1) {
      if (active && (current === '#' || current === '@')) {
        output.push(active)
        output.push({ type: 'Text', value: current })
      } else if (active) {
        active.value += current
        output.push(active)
      }
      continue
    }

    if (current === '#') {
      if (active) output.push(active)
      active = { type: 'Hashtag', value: '' }
      continue
    }

    if (current === '@') {
      if (active) output.push(active)
      active = { type: 'Mention', value: '' }
      continue
    }

    if (current === ' ' && active && active.type === 'Mention') {
      output.push(active)
      active = { type: 'Text', value: current }
      continue
    }

    if (current === ' ' && active && active.type === 'Hashtag') {
      output.push(active)
      active = { type: 'Text', value: current }
      continue
    }

    if (!active) {
      active = { type: 'Text', value: current }
      continue
    }

    active.value += current
  }

  return output
}
