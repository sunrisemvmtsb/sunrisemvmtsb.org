import React from 'react'
import type { Field } from 'tinacms'
import dynamic from 'next/dynamic'
import Preview from '../../hooks/Preview'

const InlineGroup = dynamic<any>(() => {
  return import(/* webpackChunkName: "tina" */ 'react-tinacms-inline').then((m) => m.InlineGroup)
})


export type Props = React.PropsWithChildren<{
  name: string
  insetControls?: boolean,
  fields?: Array<Field>,
  focusRing?: {
    offset?: number | { x?: number, y?: number }
  }
}>

const Editor = (props: Props) => {
  return <InlineGroup {...props} focusRing={{ borderRadius: 0, offset: 0, ...(props.focusRing ?? {}) }} />
}

const Static = (props: Props) => {
  return <div>{props.children}</div>
}

const Group = Preview.component(Editor, Static)
export default Group
