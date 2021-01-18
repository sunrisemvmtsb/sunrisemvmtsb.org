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

export default HubEvent
