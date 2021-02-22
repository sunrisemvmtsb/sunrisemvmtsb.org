import React from 'react'
import type { BlocksControlsProps } from 'react-tinacms-inline'
import Preview from '../../hooks/Preview'
import dynamic from 'next/dynamic'

const BlocksControls = dynamic<BlocksControlsProps>(() => {
  return import(/* webpackChunkName: "tina" */ 'react-tinacms-inline').then((m) => m.BlocksControls)
})


const Editor = ({
  children,
  index,
  inset = true,
}: {
  index: number,
  children: React.ReactChild | Array<React.ReactChild>
  inset?: boolean,
}) => {
  return (
    <BlocksControls
      insetControls={inset}
      index={index}
      focusRing={{ borderRadius: 0, offset: 0 }}
      children={children} />
  )
}

const Static = ({
  children,
  index,
}: {
  index: number,
  children: React.ReactChild | Array<React.ReactChild>
}) => {
  return <div>{children}</div>
}

const BlockItem = ({
  children,
  index,
  inset,
}: {
  index: number,
  children: React.ReactChild | Array<React.ReactChild>
  inset?: boolean,
}) => {
  const preview = Preview.use()
  if (preview) return <Editor index={index} children={children} inset={inset} />
  else return <Static index={index} children={children} />
}

export default BlockItem
