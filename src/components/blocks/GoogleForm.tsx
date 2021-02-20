import React from 'react'
import { css } from 'styled-components'
import GoogleForm from '../../domain/blocks/GoogleForm'
import BlockItem from '../fields/BlockItem'

export type Props = {
  data: GoogleForm,
  index: number,
}

const Component = (props: Props) => {
  const validUrl = React.useMemo(() => {
    if (props.data.url.startsWith('https://docs.google.com/forms/d/e/')) return props.data.url.replace('edit', 'viewform')
    return null
  }, [props.data.url])

  return (
    <BlockItem index={props.index}>
      <div css={css`
        padding: 64px 0;
        @media(max-width: 640px) {
          padding: 32px 0;
        }
      `}>
        {validUrl === null ?
          <div css={css`
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 32px 0;
          `}>
            <pre><code>"{props.data.url}"</code></pre> is not a valid Google Forms URL.
          </div> :
          <iframe
            src={`${validUrl}?embedded=true`}
            css={css`
              height: ${Math.min(props.data.height, 75)}vh;
              width: 100%;
              border: 0;
            `} />
        }
      </div>
    </BlockItem>
  )
}

export default Component
