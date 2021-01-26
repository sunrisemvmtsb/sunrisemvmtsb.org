import React from 'react'
import { css } from 'styled-components'
import ReactMarkdown from 'react-markdown'
import Gfm from 'remark-gfm'
import ImageFixer from '../../infrastructure/RemarkImageFixer'
import UnwrapImages from 'remark-unwrap-images'
import Image from 'next/image'
import Typography from '../Typography'

const ImageRenderer = (props: any) => {
  const mounted = React.useRef(true)
  React.useEffect(() => {
    mounted.current = true
    return () => {mounted.current = false }
  }, [])

  const [height, setHeight] = React.useState(500)

  return (
    <figure css={css`
      display: block;
      margin: 0;
      width: 100%;
      height: fit-content(750px);
      position: relative;
      padding-top: 24px;
      padding-bottom: 8px;
    `}>
      <Image
        src={props.src}
        layout="intrinsic"
        width={750}
        height={height}
        objectFit="cover"
        onLoad={async (e) => {
          const target = e.target as HTMLImageElement
          await target.decode()
          if (!mounted.current) return
          setHeight(target.naturalHeight / target.naturalWidth * 750)
        }} />
      <figcaption css={css`
        padding-top: 4px;
        text-align: center;
        color: rgba(0,0,0,0.6);
      `}>
        <Typography variant="Caption">
          {props.title}
        </Typography>
      </figcaption>
    </figure>
  )
}

const Markdown = ({
  children,
}: {
  children: string
}) => {
  return (
    <div css={css`
      color: #33342E;
      h1 {
        font-family: 'Source Sans Pro';
        font-size: 40px;
        font-weight: 900;
        line-height: 50px;
        margin: 0;
        text-transform: uppercase;
        padding-top: 16px;
      }

      h2 {
        font-family: 'Source Sans Pro';
        font-style: normal;
        font-weight: bold;
        font-size: 30px;
        line-height: 1.25;
        padding-top: 16px;
        margin: 0;
      }

      h3,
      h4,
      h5,
      h6 {
        font-family: 'Source Sans Pro';
        font-style: normal;
        font-weight: bold;
        font-size: 24px;
        line-height: 1.25;
        margin: 0;
        padding-top: 12px;
      }

      p, li {
        font-family: 'Source Serif Pro';
        font-weight: 400;
        font-size: 18px;
        line-height: 1.4;
        margin: 0;
        padding-top: 12px;
      }

      ul {
        margin: 0;
        padding-top: 12px;
      }

      li {
        padding: 4px 0;
      }
      li:first-child,
      li:last-child {
        padding: 0
      }

      li ul {
        padding-top: 0;
      }

      h1:first-child,
      h2:first-child,
      h3:first-child,
      h4:first-child,
      h5:first-child,
      h6:first-child,
      p:first-child {
        padding-top: 0;
      }

      a {
        color: #8F0D56;
      }
      a:hover {
        text-decoration: underline;
      }

      color: #33342E;
    `}>
      <ReactMarkdown
        plugins={[Gfm, ImageFixer, UnwrapImages]}
        
        renderers={{
          image: ImageRenderer,
        }}>
        {children}
      </ReactMarkdown>
    </div>
  )
}

export default Markdown
