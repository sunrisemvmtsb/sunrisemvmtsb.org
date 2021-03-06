import React from 'react'
import dynamic from 'next/dynamic'
import type { InlineImageProps } from 'react-tinacms-inline'
import Preview from '../../hooks/Preview'

const InlineImage = dynamic<InlineImageProps>(() => {
  return import(/* webpackChunkName: "tina" */ 'react-tinacms-inline').then((m) => m.InlineImage)
})

export type Props = {
  name: string,
  src: string,
  alt?: string,
  className?: string,
}

const Editor = (props: Props) => {
  return (
    <InlineImage
      className={props.className}
      focusRing={{ borderRadius: 0, offset: 0 }}
      name={props.name}
      previewSrc={(() => props.src)}
      parse={(media) => media.id} />
  )
}

const Static = (props: Props) => {
  return (
    <img
      alt={props.alt}
      src={props.src}
      className={props.className} />
  )
}

const Image = (props: Props) => {
  const preview = Preview.use()
  if (preview) return <Editor {...props} />
  else return <Static {...props} />
}

export default Image
