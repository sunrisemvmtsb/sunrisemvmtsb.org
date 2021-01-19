export type TeamLead = {
  name: string,
  image: string,
  id: string,
}

export const TeamLead = {
  default: (id: string) => ({
    name: '',
    image: '/images/placeholder.svg',
    id,
  })
}

export type Team = {
  name: string,
  leads: Array<TeamLead>,
  description: string,
  color: string,
  id: string,
}

export const Team = {
  default: (id: string) => ({
    name: '',
    leads: [],
    description: '',
    color: 'black',
    id,
  })
}

type TeamExplorer = {
  _template: 'TeamExplorer',
  teams: Array<Team>,
}

export default TeamExplorer
