export type TeamLead = {
  name: string,
  image: string,
}

export type Team = {
  _template: 'Team',
  name: string,
  leads: Array<TeamLead>,
  description: string,
  color: string,
}

type TeamExplorer = {
  _template: 'TeamExplorer',
  teams: Array<Team>,
}

export default TeamExplorer
