import React from 'react'
import { InlineImage } from 'react-tinacms-inline'
import Preview from '../../contexts/Preview'

export type Props = {
  name: string,
  src: string,
  alt?: string
}

const Editor = (props: Props) => {
  return (
    <InlineImage
      focusRing={{ borderRadius: 0, offset: 0 }}
      name={props.name}
      parse={(media) => media.id} />
  )
}

const Static = (props: Props) => {
  return (
    <img alt={props.alt} src={props.src} />
  )
}

const Image = (props: Props) => {
  const preview = Preview.use()
  if (preview) return <Editor {...props} />
  else return <Static {...props} />
}

export default Image
