import React from 'react'
import type { InlineTextProps } from 'react-tinacms-inline'
import Preview from '../../contexts/Preview'
import dynamic from 'next/dynamic'

const InlineTextarea = dynamic<InlineTextProps>(() => {
  return import(/* webpackChunkName: "tina" */ 'react-tinacms-inline').then((m) => m.InlineTextarea)
})

export type Props = {
  name: string,
  placeholder?: string,
  children: React.ReactChild,
}

const Editor = (props: Props) => {
  return <InlineTextarea focusRing={{ borderRadius: 0 }} {...props} />
}

const Static = (props: Props) => {
  return (
    <div>{props.children}</div>
  )
}

const Textarea = (props: Props) => {
  const preview = Preview.use()
  if (preview) return <Editor {...props} />
  else return <Static {...props} />
}

export default Textarea
