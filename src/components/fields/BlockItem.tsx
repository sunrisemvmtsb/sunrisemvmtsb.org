import React from 'react'
import type { BlocksControlsProps } from 'react-tinacms-inline'
import Preview from '../../contexts/Preview'
import dynamic from 'next/dynamic'

const BlocksControls = dynamic<BlocksControlsProps>(() => {
  return import('react-tinacms-inline').then((m) => m.BlocksControls)
})


const Editor = ({
  children,
  index,
}: {
  index: number,
  children: React.ReactChild | Array<React.ReactChild>
}) => {
  return (
    <BlocksControls
      insetControls={true}
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
}: {
  index: number,
  children: React.ReactChild | Array<React.ReactChild>
}) => {
  const preview = Preview.use()
  if (preview) return <Editor index={index} children={children} />
  else return <Static index={index} children={children} />
}

export default BlockItem
