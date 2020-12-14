import React from 'react'
import { css } from 'styled-components'
import { BlocksControls, InlineBlocks, InlineText, InlineGroup } from 'react-tinacms-inline'
import InlineMarkdownField from '../InlineMarkdownField'
import Typography from '../Typography'
import Color from 'color'
import { useRouter } from 'next/router'
import { containeranalysis } from 'googleapis/build/src/apis/containeranalysis'

type TeamLead = {
  name: string,
  image: string,
}

type Team = {
  name: string,
  leads: Array<TeamLead>,
  description: string,
  color: string,
}

export type Data = {
  teams: Array<Team>,
}

const defaultTeamExplorer = {
  teams: [
    {
      name: 'Administrative Coordinators',
      leads: [],
      description: '',
      color: '#FFDE16',
      _template: 'Team',
    },
    {
      name: 'Actions',
      leads: [],
      description: '',
      color: '#FF2F2F',
      _template: 'Team',
    }
  ]
}

export const template = {
  label: 'Team Explorer',
  defaultItem: defaultTeamExplorer,
  fields: []
}

const TeamEntryTemplate = ({
  index,
  data,
  selected,
  setSelected,
}: {
  index: number,
  data: Team,
  selected?: number,
  setSelected?: (index: number) => void
}) => {
  const leads = data.leads.length !== 0 ?
    data.leads :
    [{ name: 'No lead yet', image: '/images/placeholder.svg' }]

  const router = useRouter()
  const team = router.query.team
  const [didScroll, setDidScroll] = React.useState(false)

  return (
    <div css={css`
      padding: ${selected === index ? 12 : 16}px;
      border: ${selected === index ? `2px solid ${data.color}` : '0'};
      background-color: ${selected === index ? Color(data.color).fade(0.75).string() : 'none'};
    `}>
      <BlocksControls
        focusRing={{ borderRadius: 0 }}
        index={index}>
        <div
          css={css`
            display: flex;
            flex-direction: column;
            align-items: center;
            cursor: pointer;
          `}
          onClick={() => setSelected?.(index)}>
          <div css={css`
            display: flex;
            padding-bottom: 16px;
          `}>
            {leads.map((lead, index) => {
              return (
                <div
                  key={lead.name + index.toString()}
                  css={css`
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    margin-left: -32px;
                    &:first-child { margin-left: 0; }
                  `}>
                  <img
                    src={lead.image}
                    css={css`
                      width: 120px;
                      height: 120px;
                      border-radius: 50%;
                      border: 5px solid ${data.color};
                      overflow: hidden;
                      margin-bottom: 4px;
                      display: block;
                    `} />
                  <p css={css`
                    font-family: 'Source Sans Pro';
                    font-style: normal;
                    font-weight: bold;
                    font-size: 12px;
                    line-height: 15px;
                    text-transform: uppercase;
                    color: #33342E;
                    margin: 0;
                  `}>
                    {lead.name}
                  </p>
                </div>
              )
            })}
          </div>
          <p css={css`
            margin: 0;
            font-weight: 700;
            font-size: 18px;
            line-height: 1;
            text-transform: uppercase;
            width: 144px;
            text-align: center;
          `}>
            {data.name}
          </p>
        </div>
      </BlocksControls>
    </div>
  )
}

export const Component = ({
  index,
  data,
}: {
  index: number,
  data: Data,
}) => {
  
  const [selected, setSelected] = React.useState(0)
  const current = data.teams[selected]

  const router = useRouter()
  const team = router.query.team
  const [didScroll, setDidScroll] = React.useState(false)

  React.useEffect(() => {
    if (!team) return
    const index = data
      .teams
      .findIndex(({ name }) => {
        return name.toLowerCase().replace(' ', '-') === team
      })
    if (index === -1) return
    setSelected(index)
  }, [team])

  return (
    <div
      ref={(div) => {
        if (!div || !team || didScroll) return
        div.scrollIntoView()
        setDidScroll(true)
      }}
      css={css`
        padding-top: 48px;
        &:first-child { padding-top: 0; }
      `}>
      <BlocksControls
        index={index}
        focusRing={{ borderRadius: 0, offset: { x: 0, y: 16 } }}>
        <div css={css`
          position: relative;
          height: 70vh;
        `}>
          <div css={css`
            width: 80%;
          `}>
            <InlineBlocks
              name="teams"
              direction="horizontal"
              itemProps={{
                selected,
                setSelected,      
              }}
              css={css`
                display: grid;
                grid-template-columns: 1fr 1fr 1fr;
                grid-template-rows: auto;
                grid-auto-flow: column dense;
                justify-items: center;
              `}
              blocks={{
                Team: {
                  Component: TeamEntryTemplate,
                  template: {
                    label: 'Team',
                    defaultItem: {
                      name: '',
                      leads: [],
                      description: '',
                      color: '#FFDE16',
                    },
                    fields: [
                      {
                        label: 'Name',
                        name: 'name',
                        component: 'text',
                      },
                      {
                        label: 'Color',
                        name: 'color',
                        component: 'color',
                      },
                      {
                        label: 'Leads',
                        name: 'leads',
                        component: 'group-list',
                        fields: [
                          {
                            label: 'Name',
                            name: 'name',
                            component: 'text',
                          },
                          {
                            label: 'Image',
                            name: 'image',
                            component: 'image',
                            defaultValue: '/images/placeholder.svg',
                          },
                        ]
                      }
                    ]
                  }
                }
              }}/>
          </div>
          <div css={css`
            position: absolute;
            top: 0;
            right: 0;
            bottom: 0;
            overflow-y: auto;
            width: 512px;
            box-shadow: -8px 0px 6px -5px rgba(0, 0, 0, 0.25);
            padding: 32px;
          `}>
            <InlineGroup
              name={`teams[${selected}]`}
              focusRing={{ borderRadius: 0, offset: { x: 32, y: 32 } }}>
              <div css={css`
                padding-bottom: 24px;
              `}>
                <Typography variant="ContentTitle">
                  <InlineText
                    name="name"
                    focusRing={{ borderRadius: 0 }}>
                    {current.name}
                  </InlineText>
                </Typography>
              </div>
              <InlineMarkdownField
                name="description"
                content={current.description} />
            </InlineGroup>
          </div>
        </div>
      </BlocksControls>
    </div>
  )
}
