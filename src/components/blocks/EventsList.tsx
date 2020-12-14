import React from 'react'
import { css } from 'styled-components'
import { BlocksControls, InlineText, InlineTextarea, InlineImage } from 'react-tinacms-inline'
import Typography from '../Typography'
import { CalendarEvent } from '../../infrastructure/GoogleCalendar'

export type Data = {
  
}

export const template = {
  label: 'Events List',
  defaultItem: {},
  fields: []
}

const formatDate = (input: string) => {
  const date = new Date(input)
  return `${date.getMonth() + 1}/${date.getDate()}`
}

const formatDateTime = (input: string) => {
  const date = new Date(input)
  return `${date.getMonth()}/${date.getDate()} ${(date.getHours() + 13) % 12}:${date.getHours().toString().padStart(2, '0')} PST`
}

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
      formatDate(input.start.date) :
      formatDateTime(input.start.dateTime),
    type: parseEventType(input),
    team: parseTeam(input),
  }
}

export const Component = ({
  index,
  events,
}: {
  index: number,
  events?: Array<CalendarEvent>,
}) => {
  return (
    <BlocksControls
      index={index}
      focusRing={{ offset: { x: 0, y: 0 }, borderRadius: 0 }}>
      <div css={css`
        padding: 120px;
        background-color: var(--sunrise-yellow);
      `}>
        <div css={css`
          margin: 0 auto;
          max-width: 1200px;
          position: relative;
          padding-bottom: 48px;
        `}>
          <Typography variant="SectionTitle">
            Our upcoming events
          </Typography>
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
              <div css={css`
                font-family: Source Sans Pro;
                font-weight: 700;
                font-size: 18px;
                line-height: 23px;
                padding-top: 16px;
              `}>
                {event.start}
              </div>
              {event.team &&
                <div css={css`
                  padding-top: ${event.start ? 8 : 16}px;
                  font-family: Source Sans Pro;
                  font-size: 12px;
                  line-height: 15px;
                  text-decoration-line: underline;
                  color: var(--sunrise-magenta);
                `}>
                  Learn more about the {event.team} Team
                </div>
              }
            </li>
          ))}
        </ul>
      </div>
    </BlocksControls>
  )
}
