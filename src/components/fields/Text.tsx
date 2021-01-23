import React from 'react'
import type { InlineTextProps } from 'react-tinacms-inline'
import Preview from '../../contexts/Preview'
import dynamic from 'next/dynamic'

const InlineText = dynamic<InlineTextProps>(() => {
  return import(/* webpackChunkName: "tina" */ 'react-tinacms-inline').then((m) => m.InlineText)
})


export type Props = {
  name: string,
  placeholder?: string,
  children: React.ReactChild,
}

const Editor = (props: Props) => {
  return <InlineText focusRing={{ borderRadius: 0 }} {...props} />
}

const Static = (props: Props) => {
  return (
    <div>{props.children}</div>
  )
}

const Text = Preview.component(Editor, Static)
export default Text
