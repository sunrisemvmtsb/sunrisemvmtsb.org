import React from 'react'
import { css } from 'styled-components'
import BlockItem from '../fields/BlockItem'
import Textarea from '../fields/Textarea'
import Image from '../fields/Image'
import Typography from '../Typography'
import EveryActionForm from '../atoms/EveryActionForm'
import CallToAction from '../../domain/blocks/CallToAction'
import Group from '../fields/Group'

export type Props = {
  index: number,
  data: CallToAction
}

const Component = ({
  index,
  data,
}: {
  index: number,
  data: CallToAction,
}) => {
  return (
    <BlockItem index={index}>
      <div css={css`
        padding: 120px;
        padding-top: 60px;
        background-color: #fffffb;
      `}>
        <div css={css`
          margin: 0 auto;
          max-width: 1200px;
          display: grid;
          grid-template-columns: 1fr 400px;
          grid-column-gap: 72px;
          position: relative;
        `}>
          <div css={css`
            display: grid;
            grid-template-rows: auto auto;
            grid-template-columns: auto 1fr;
            grid-row-gap: 32px;
            grid-column-gap: 40px;
            align-content: start;
          `}>
            <div css={css`
              grid-row: 1 / span 1;
              grid-column: 1 / span 2;
            `}>
              <Typography variant="SectionTitle">
                <Textarea
                  name="callout"
                  children={data.callout} />
              </Typography>
            </div>
            <div css={css`
              grid-row: 2 / span 1;
              grid-column: 1 / span 1;
              img {
                width: 120px;
                height: 120px;
              }
            `}>
              <Image
                name="image"
                src={data.image} />
            </div>
            <div css={css`
              grid-row: 2 / span 1;
              grid-column: 2 / span 1;
            `}>
              <div css={css`
                font-family: Source Sans Pro;
                font-style: normal;
                font-weight: 700;
                font-size: 30px;
                line-height: 38px;
                color: #8F0D56;
                text-decoration: underline;
                padding-bottom: 16px;
              `}>
                <Textarea
                  name="title"
                  children={data.title} />
              </div>
              <Typography variant="Body">
                <Textarea
                  name="description"
                  children={data.description} />
              </Typography>
            </div>
          </div>
          <div css={css`
            position: relative;
          `}>
              <div css={css`
                border-image-source: linear-gradient(to bottom, #8F0D56, #EF4C39, #FFDE16);
                border-style: solid;
                border-image-slice: 1;
                border-width: 5px;
                padding: 0 16px;
                padding-bottom: 24px;
                position: relative;
                width: 100%;
                margin-top: -160px;
              `}>
                <Group
                  name=""
                  insetControls
                  fields={[
                    {
                      name: 'form',
                      label: 'Form URL',
                      description: 'Go into EveryAction, find the embed code for your form, and find the URL in the embed code next to data-form-url. It will look like https://secure.everyaction.com/v1/Form/[Form ID].',
                      component: 'text',
                      format: (value) => value ?? '',
                      validate: (value) => {
                        try {
                          const url = new URL(value)
                          if (url.hostname !== 'secure.everyaction.com') return 'Not an EveryAction link'
                          if (!url.pathname.startsWith('/v1/Forms/')) return 'Not an EveryAction form embed. See instructions above.'
                        } catch (e) {
                          return 'Not a valid URL'
                        }
                      }
                    }
                  ]}>
                  <div css={css`
                    background-color: var(--sunrise-yellow);
                    margin-top: -53px;
                    box-shadow: 0px 4px 16px rgba(0, 0, 0, 0.25);
                    position: relative;
                    min-height: 420px;
                  `}>
                      {data.form && <EveryActionForm url={data.form} /> }
                  </div>
                </Group>
              </div>
          </div>
        </div>
      </div>
    </BlockItem>
  )
}

export default Component
