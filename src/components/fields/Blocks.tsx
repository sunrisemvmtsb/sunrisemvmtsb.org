import React from 'react'
import { InlineBlocks, Block, InlineBlocksProps } from 'react-tinacms-inline'
import Preview from '../../contexts/Preview'
import { css } from 'styled-components'

export type Props = {
  name: string,
  blocks: InlineBlocksProps['blocks']
  itemProps?: InlineBlocksProps['itemProps'],
  data: Array<any>,
  direction?: InlineBlocksProps['direction'],
  className?: string,
}

const Editor = (props: Props) => {
  return <InlineBlocks {...props} />
}

const Static = (props: Props) => {
  return (
    <div className={props.className}>
      {props.data.map((data, index) => {
        return React.createElement(
          props.blocks[data._template].Component as any, { key: data._template + index, data, index, ...(props.itemProps ?? {}) }
        )
      })}
    </div>
  )
}

const Blocks = Preview.component(Editor, Static)
export default Blocks