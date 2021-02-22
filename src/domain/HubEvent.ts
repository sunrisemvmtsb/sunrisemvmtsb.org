export type Team =
  | 'Outreach'
  | 'Finance'
  | 'Actions'

export type EventType =
  | 'Meeting'
  | 'Phonebank'
  | 'Action'

type HubEvent = {
  id: string,
  title: string,
  start: string,
  type: EventType | null,
  team: Team | null,
  url: string,
}

export default HubEvent
