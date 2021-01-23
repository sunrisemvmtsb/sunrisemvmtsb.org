import React from 'react'
import { css } from 'styled-components'
import type { InlineWysiwygFieldProps } from 'react-tinacms-editor'
import Markdown from '../atoms/Markdown'
import dynamic from 'next/dynamic'
import Preview from 'src/contexts/Preview'

const InlineWysiwyg = dynamic<InlineWysiwygFieldProps>(() => {
  return import(/* webpackChunkName: "tina" */ 'react-tinacms-editor').then((m) => m.InlineWysiwyg)
}, { ssr: false })

export type Props = {
  name: string,
  content: string,
}

const EditorInner = ({ name, content }: Props) => {
  return (
    <InlineWysiwyg
      className="sunrisemvmtsb-markdown-editor"
      name={name}
      format="markdown"
      focusRing={{ borderRadius: 0, offset: { x: 16, y: 24 } }}
      imageProps={{
        parse: (media) => media.id
      }}>
      {!content &&
        <div css={css`
          font-family: 'Source Serif Pro';
          font-size: 18px;
          font-style: italic;
          line-height: 1.4;
          color: rgba(0,0,0,0.48);
          padding: 8px 0;
        `}>
          Write something here.
        </div>
      }
      <Markdown>{content}</Markdown>
    </InlineWysiwyg>
  )
}

const StaticInner = ({ name, content }: Props) => {
  return (
    <Markdown>{content}</Markdown>
  )
}

const Inner = Preview.component(EditorInner, StaticInner)

const MarkdownField = (props: Props) => {
  return (
    <div css={css`
      color: #33342E;

      .sunrisemvmtsb-markdown-editor h1 {
        font-family: 'Source Sans Pro';
        font-size: 40px;
        font-weight: 900;
        line-height: 50px;
        margin: 0;
        text-transform: uppercase;
        padding-top: 16px;
      }

      .sunrisemvmtsb-markdown-editor h2 {
        font-family: 'Source Sans Pro';
        font-style: normal;
        font-weight: bold;
        font-size: 30px;
        line-height: 1.25;
        padding-top: 16px;
        margin: 0;
      }

      .sunrisemvmtsb-markdown-editor h3,
      .sunrisemvmtsb-markdown-editor h4,
      .sunrisemvmtsb-markdown-editor h5,
      .sunrisemvmtsb-markdown-editor h6 {
        font-family: 'Source Sans Pro';
        font-style: normal;
        font-weight: bold;
        font-size: 24px;
        line-height: 1.25;
        margin: 0;
        padding-top: 12px;
      }

      .sunrisemvmtsb-markdown-editor p {
        font-family: 'Source Serif Pro';
        font-weight: 400;
        font-size: 18px;
        line-height: 1.4;
        margin: 0;
        padding-top: 12px;
      }

      .sunrisemvmtsb-markdown-editor .tinacms-image-wrapper {
        margin: 0;
        padding-top: 12px;
      }

      .sunrisemvmtsb-markdown-editor img {
        display: block;
        width: 100%;
      }

      .sunrisemvmtsb-markdown-editor a {
        color: var(--sunrise-magenta);
      }

      .sunrisemvmtsb-markdown-editor ul {
        margin: 0;
        padding-top: 12px;
      }

      .sunrisemvmtsb-markdown-editor li {
        padding: 4px 0;
      }
      .sunrisemvmtsb-markdown-editor li:first-child,
      .sunrisemvmtsb-markdown-editor li:last-child {
        padding: 0
      }

      .sunrisemvmtsb-markdown-editor li ul {
        padding-top: 0;
      }

      .sunrisemvmtsb-markdown-editor h1:first-child,
      .sunrisemvmtsb-markdown-editor h2:first-child,
      .sunrisemvmtsb-markdown-editor h3:first-child,
      .sunrisemvmtsb-markdown-editor h4:first-child,
      .sunrisemvmtsb-markdown-editor h5:first-child,
      .sunrisemvmtsb-markdown-editor h6:first-child,
      .sunrisemvmtsb-markdown-editor p:first-child,
      .sunrisemvmtsb-markdown-editor .tinacms-image-wrapper:first-child {
        padding-top: 0;
      }
    `}>
      <Inner {...props} />
    </div>
  )
}

export default MarkdownField
