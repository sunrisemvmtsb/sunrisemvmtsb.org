import React from 'react'
import { Field } from 'tinacms'
import { InlineGroup } from 'react-tinacms-inline'
import Preview from '../../contexts/Preview'

export type Props = React.PropsWithChildren<{
  name: string
  fields?: Array<Field>
}>

const Editor = (props: Props) => {
  return <InlineGroup {...props} focusRing={{ borderRadius: 0, offset: 0 }} />
}

const Static = (props: Props) => {
  return <div>{props.children}</div>
}

const Group = Preview.component(Editor, Static)
export default Group
