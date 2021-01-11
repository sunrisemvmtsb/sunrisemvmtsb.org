import React from 'react'
import { InlineText } from 'react-tinacms-inline'
import Preview from '../../contexts/Preview'

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
