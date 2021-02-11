import React from 'react'
import type { Field } from 'tinacms'
import { css } from 'styled-components'
import Markdown from '../fields/Markdown'
import Typography from '../Typography'
import Color from 'color'
import { useRouter } from 'next/router'
import BlockItem from '../fields/BlockItem'
import Textarea from '../fields/Textarea'
import Group from '../fields/Group'
import TeamExplorer, { Team, TeamLead } from '../../domain/blocks/TeamExplorer'
import { v4 as uuid } from 'uuid'
import Blocks from '../fields/Blocks'
import Icon from '../atoms/Icon'
import Image from '../fields/Image'

const TeamEntryTemplate = ({
  index,
  data,
  selected,
  setSelected,
}: {
  index: number,
  data: Team,
  selected?: number | null,
  setSelected?: (index: number | null) => void
}) => {
  const leads = data.leads.length !== 0 ?
    data.leads :
    [ { ...TeamLead.default('-1'), image: '/images/placeholder.svg', name: 'No Leads Yet' } ]

  const router = useRouter()
  const team = router.query.team
  const [didScroll, setDidScroll] = React.useState(false)

  return (
      <div css={css`
        padding: ${selected === index ? 14 : 16}px;
        border: ${selected === index ? `2px solid ${data.color}` : '0'};
        background-color: ${selected === index ? Color(data.color).fade(0.75).string() : 'none'};
      `}>
        <div
          css={css`
            display: flex;
            flex-direction: column;
            align-items: center;
            cursor: pointer;
          `}
          onClick={() => setSelected?.(index)}>
            <div css={css`
              max-width: 200px;
            `}>
            <Group
              name={`teams[${index}]`}
              insetControls
              fields={[
                {
                  name: 'leads',
                  label: 'Team Leads',
                  component: 'group-list',
                  defaultItem: () => TeamLead.default(uuid()),
                  itemProps: (item: TeamLead) => ({
                    key: item.id,
                    label: item.name,
                  }),
                  fields: [
                    {
                      name: 'name',
                      label: 'Name',
                      component: 'text',
                    },
                    {
                      name: 'image',
                      label: 'Image',
                      component: 'image',
                    } as Field,
                  ],
                } as Field,
              ]}>
              <div css={css`
                display: grid;
                grid-auto-flow: column;
                grid-auto-columns: minmax(0, 1fr);
                justify-items: start;
                justify-content: center;
                padding-bottom: 8px;
                overflow: hidden;
              `}>
              {leads.map((lead, index) => {
                return (
                  <div
                    key={lead.id}
                    css={css`
                    position: relative;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    margin-left: calc(${index / (leads.length - 1) * 100}% - 120px + ${120 * (leads.length - 1 - index) / (leads.length - 1)}px);
                    :hover {
                      z-index: ${leads.length};
                    }
                    & [data-name] {
                      visibility: hidden;
                    }
                    &:hover [data-name] {
                      visibility: visible;
                    }
                  `}>
                    <img
                      src={lead.image}
                      css={css`
                        border: 5px solid ${data.color};
                        margin-bottom: 4px;
                        width: 120px;
                        height: 120px;
                        border-radius: 50%;
                        overflow: hidden;
                        display: block;
                      `} />
                    <p data-name css={css`
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
            </Group>
            </div>
          <p css={css`
            margin: 0;
            font-weight: 700;
            font-size: 18px;
            line-height: 1;
            text-transform: uppercase;
            width: 144px;
            text-align: center;
            padding-bottom: 4px;
          `}>
            {data.name}
          </p>
        </div>
      </div>
  )
}

export type Props = {
  index: number,
  data: TeamExplorer,
}

const TeamTemplate = {
  template: {
    label: 'Team',
    fields: [],
  },
  Component: ({
    index,
    data,
    selected,
    setSelected,
  }: {
    index: number,
    data: Team,
    selected?: number | null,
    setSelected?: (index: number | null) => void,
  }) => {
    const isOpen = React.useMemo(() => selected === index, [selected, index])
    return (
      <BlockItem index={index}>
        <div css={css`
          padding: 0 32px;
        `}>
          <div
            css={css`
              border-bottom: 1px solid rgba(0, 0, 0, 0.12);
              padding: 12px 0;
              display: grid;
              grid-template-columns: auto 1fr;
              grid-gap: 16px;
              align-items: center;
            `}
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              setSelected?.(isOpen ? null : index)
            }}>
            <Icon
              icon={isOpen ? 'ExpandLess' : 'ExpandMore'}
              css={css`
                width: 24px;
                height: 24px;
              `} />
            <Typography variant="ContentTitle">
              <Textarea name="name">
                {data.name}
              </Textarea>
            </Typography>
          </div>
          {!isOpen ? null :
            <div css={css`
              padding: 32px;
              padding-top: 16px;
            `}>
              {data.leads.length === 0 ? null :
                <Group
                  insetControls
                  name="."
                  fields={[
                    {
                      label: 'Team Leads',
                      component: 'group-list',
                      name: 'leads',
                      defaultValue: () => TeamLead.default(uuid()),
                      itemProps: (item: TeamLead) => ({
                        key: item.id,
                        label: item.name,
                      }),
                      fields: [
                        {
                          label: 'Name',
                          name: 'name',
                          component: 'text',
                        },
                      ],
                    } as Field,
                  ]}>
                  <div css={css`
                    font-weight: 400;
                    font-size: 18px;
                  `}>
                    <div css={css`
                      font-family: 'Source Sans Pro';
                      font-weight: 700;
                    `}>
                      Team Leads
                    </div>
                    <ul css={css`
                      margin: 0;
                      padding: 24px;
                      padding-top: 4px;
                    `}>
                      {data.leads.map((lead) => (
                        <li
                          key={lead.id}
                          css={css`
                            line-height: 1.4;
                            margin: 0;
                            padding: 4px 0;
                            &:first-child, &:last-child {
                              padding: 0
                            }
                          `}>
                          {lead.name}
                        </li>
                      ))}
                    </ul>
                  </div>
                </Group>
              }
              <Markdown
                name="description"
                content={data.description} />
            </div>
          }
        </div>
      </BlockItem>
    )
  }
}

const Component = ({
  index,
  data,
}: Props) => {

  const [selected, setSelected] = React.useState<number | null>(null)
  const current = React.useMemo(() => data.teams[selected ?? 0], [data.teams, selected])
  const desktopSelected = React.useMemo(() => selected ?? 0, [selected])

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
      }}>
      <BlockItem index={index}>
        <div css={css`
          display: none;
          @media(max-width: 800px) {
            display: block;
          }
        `}>
          <Blocks
            data={data.teams}
            name="teams"
            blocks={{ Team: TeamTemplate }}
            itemProps={{ selected, setSelected }} />
        </div>
        <div css={css`
          position: relative;
          padding: 24px 0;
          height: 70vh;
          width: 100%;
          display: grid;
          grid-template-columns: 2fr minmax(360px, 1fr);
          @media(max-width: 800px) {
            display: none;
          }
        `}>
          <Group
            name=""
            fields={[
              {
                name: 'teams',
                label: 'Teams',
                component: 'group-list',
                defaultItem: () => Team.default(uuid()),
                itemProps: (item: Team) => ({
                  key: item.id,
                  label: item.name,
                }),
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
                ]
              } as Field,
            ]}>
            <div css={css`
                display: grid;
                grid-template-columns: auto auto auto;
                grid-auto-rows: auto;
                grid-auto-flow: dense;
                justify-items: center;
                justify-content: center;
                position: relative;
                grid-gap: 32px;
                padding: 0 16px;
                @media(max-width: 1024px) {
                  grid-template-columns: auto auto;
                } 
              `}>
              {data.teams.map((team, index) => (
                <TeamEntryTemplate
                  key={team.name}
                  data={team}
                  index={index}
                  selected={desktopSelected}
                  setSelected={setSelected} />
              ))}
            </div>
          </Group>
          <div css={css`
            overflow-y: auto;
            box-shadow: -8px 0px 6px -5px rgba(0, 0, 0, 0.25);
            padding: 32px;
          `}>
            <Group name={`teams[${desktopSelected}]`}>
              <div css={css`
                padding-bottom: 24px;
              `}>
                <Typography variant="ContentTitle">
                  <Textarea name="name">
                    {current.name}
                  </Textarea>
                </Typography>
              </div>
              <Markdown
                name="description"
                content={current.description} />
            </Group>
          </div>
        </div>
      </BlockItem>
    </div>
  )
}

export default Component
