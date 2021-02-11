import React from 'react'
import { css } from 'styled-components'
import Icon from './Icon'

const IconButton = ({
  onClick,
  icon,
}: {
  onClick: () => void,
  icon: Icon,
}) => {
  return (
    <button
      onClick={onClick}
      css={css`
        font-family: Source Sans Pro;
        font-weight: 700;
        line-height: 1.2;
        text-transform: uppercase;
        padding: 8px;
        border: 0;
        background: 0;
        cursor: pointer;
        border-radius: 50%;
        outline: 0;
        display: inline-flex;
        color: inherit;
        position: relative;
        :hover::before {
          display: block;
          position: absolute;
          width: 100%;
          height: 100%;
          background-color: currentColor;
          opacity: 0.12;
          content: '';
          top: 0;
          left: 0;
          border-radius: 50%;
        }
      `}>
      <Icon
        icon={icon}
        css={css`
          width: 24px;
          height: 24px;
          fill: currentColor;
        `}/>
    </button>
  )
}

export default IconButton
