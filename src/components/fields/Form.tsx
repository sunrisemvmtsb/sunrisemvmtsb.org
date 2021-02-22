import React from 'react'
import dynamic from 'next/dynamic'
import type { InlineFormProps } from 'react-tinacms-inline'
import Preview from '../../hooks/Preview'

const InlineForm = dynamic<InlineFormProps>(() => {
  return import(/* webpackChunkName: "tina" */ 'react-tinacms-inline').then((m) => m.InlineForm)
})

export type Props = InlineFormProps

const Editor = (props: Props) => {
  return <InlineForm {...props} />
}

const Static = (props: Props) => {
  return <>{props.children}</>
}

const Blocks = Preview.component(Editor, Static)
export default Blocks
