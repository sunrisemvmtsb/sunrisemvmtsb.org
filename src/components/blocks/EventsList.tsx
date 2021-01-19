import React from 'react'
import { css } from 'styled-components'
import Typography from '../Typography'
import { CalendarEvent } from '../../infrastructure/GoogleCalendar'
import Icon from '../atoms/Icon'
import BlockItem from '../fields/BlockItem'
import { Temporal } from 'proposal-temporal'
import ButtonLink from '../atoms/ButtonLink'
import SiteConfig from '../../domain/SiteConfig'

type Team =
  | 'Outreach'
  | 'Finance'
  | 'Actions'

type EventType =
  | 'Meeting'
  | 'Phonebank'
  | 'Action'

type HubEvent = {
  id: string,
  title: string,
  start: string,
  type: EventType | null,
  team: Team | null,
}

const parseEventType = (input: CalendarEvent): EventType | null => {
  const text = input.summary.toLowerCase() + input.description.toLowerCase()

  if (text.includes('meeting')) {
    return 'Meeting'
  } else if (text.includes('make calls') || text.includes('phonebank')) {
    return 'Phonebank'
  } else if (text.includes('empower hour')) {
    return 'Action'
  } else {
    return null
  }
}

const parseTeam = (input: CalendarEvent): Team | null => {
  const text = input.summary.toLowerCase() + input.description.toLowerCase()

  if (text.includes('outreach team')) {
    return 'Outreach'
  } else if (text.includes('finance team')) {
    return 'Finance'
  } else if (text.includes('actions team')) {
    return 'Actions'
  } else {
    return null
  }
}

const parseEvent = (input: CalendarEvent): HubEvent => {
  return {
    id: input.id,
    title: input.summary,
    start: 'date' in input.start ?
      Temporal.PlainDate.from(input.start.date).toLocaleString('default', {
        day: '2-digit',
        month: 'numeric',
      }) :
      Temporal.PlainDateTime.from(input.start.dateTime).toLocaleString('default', {
        day: '2-digit',
        month: 'numeric', 
        hour: 'numeric',
        minute: '2-digit',
      }),
    type: parseEventType(input),
    team: parseTeam(input),
  }
}

const teamUrl = (input: Team): string => {
  return `/hub-structure?team=${input.toLowerCase()}`
}

export type Props = {
  index: number,
  events?: Array<CalendarEvent>,
  siteConfig?: SiteConfig
}

const Component = ({
  index,
  events = [],
  siteConfig = SiteConfig.default,  
}: Props) => {
  return (
    <BlockItem index={index}>
      <div css={css`
        padding: 120px;
        background-color: var(--sunrise-yellow);
      `}>
        <div css={css`
          margin: 0 auto;
          max-width: 1200px;
          position: relative;
          padding-bottom: 48px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        `}>
          <Typography variant="SectionTitle">
            Our upcoming events
          </Typography>
          <ButtonLink
            color="Magenta"
            href={siteConfig.calendar}>
            See all
          </ButtonLink>
        </div>
        <ul css={css`
          display: grid;
          grid-auto-columns: 1fr;
          grid-column-gap: 32px;
          grid-auto-flow: column;
          list-style: none;
          padding: 0;
          margin: 0;
        `}>
          {events?.map(parseEvent).map((event) => (
            <li 
              key={event.id}
              css={css`
                box-shadow: 0px 2px 8px -1px rgba(0, 0, 0, 0.25);
                background-color: var(--sunrise-tan);
                margin: 0;
                padding: 16px;
                display: grid;
                grid-template-rows: auto 1fr auto auto;
                grid-auto-flow: row;
              `}>
              {event.type &&
                <div css={css`
                  font-family: Source Serif Pro;
                  font-style: italic;
                  font-weight: 700;
                  font-size: 18px;
                  line-height: 23px;
                  padding-bottom: 8px;
                `}>
                  {event.type}
                </div>
              }
              <h3 css={css`
                font-family: Source Sans Pro;
                font-weight: 700;
                font-size: 28px;
                line-height: 1;
                color: var(--sunrise-magenta);
                margin: 0;
              `}>
                {event.title}
              </h3>
              {event.team &&
                <a
                  href={teamUrl(event.team)}
                  css={css`
                    display: flex;
                    padding-top: 16px;
                    font-family: Source Sans Pro;
                    font-size: 12px;
                    line-height: 15px;
                    text-decoration: underline;
                    color: var(--sunrise-magenta);
                    align-items: center;
                  `}>
                  <Icon
                    icon="Info"
                    css={css`
                      width: 16px;
                      height: 16px;
                      display: block;
                      margin-right: 4px;
                      fill: currentColor;
                    `} />
                  <span
                    css={css`
                      font-size: 12px;
                      display: block;
                      margin-top: -3px;
                    `}>
                    Learn more about the {event.team} Team
                  </span>
                </a>
              }
              <div css={css`
                font-family: Source Sans Pro;
                font-weight: 700;
                font-size: 18px;
                line-height: 23px;
                padding-top: 16px;
              `}>
                {event.start}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </BlockItem>
  )
}

export default Component
