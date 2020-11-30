import React from 'react'
import { css } from 'styled-components'
import { BlocksControls, InlineBlock, InlineBlocks, InlineForm, InlineGroup, InlineText, AddBlockMenu } from 'react-tinacms-inline'
import InlineMarkdownField from '../components/InlineMarkdownField'
import { useForm, ModalProvider, usePlugin } from 'tinacms'
import Markdown from '../components/Markdown'
import Typography from '../components/Typography'
import Color from 'color'
import { GetStaticProps } from 'next'
import { useGithubJsonForm, useGithubToolbarPlugins } from 'react-tinacms-github'
import { getGithubPreviewProps, parseJson, GithubFile } from 'next-tinacms-github'


const Hero = () => {
  return (
    <header
      css={css`
        border-image-source: linear-gradient(to bottom, #8F0D56, #EF4C39, #FFDE16);
        border-style: solid;
        border-image-slice: 1;
        border-width: 5px;
        padding: 120px;
        background-color: #E3EEDF;
      `}>
      <div css={css`
        margin: 0 auto;
        max-width: 920px;
        display: flex;
        flex-direction: column;
        align-items: flex-start;
      `}>
        <p css={css`
          margin: 0;
          background-color: #000;
          color: #FFF;
          font-size: 18px;
          font-family: 'Source Serif Pro';
          font-style: italic;
          font-weight: 900;
          padding: 0 4px;
          line-height: 23px;
          margin-bottom: 8px;
          margin-left: 8px;
        `}>
          Sunrise Santa Barbara's
        </p>
        <h1 css={css`
          margin: 0;
          padding: 0 8px;
          background-color: #FFDE16;
          font-weight: 900;
          font-size: 60px;
          line-height: 75px;
          color: #000;
        `}>
          Hub Structure &amp; Teams
        </h1>
      </div>
    </header>
  )
}

type OneColumnText = {
  _template: 'OneColumnText',
  content: string,
}

const OneColumnTextTemplate = ({
  index,
  data,
}: {
  index: number,
  data: OneColumnText,
}) => {
  return (
    <div css={css`
      padding-top: 48px;
      &:first-child {
        padding-top: 0;
      }
    `}>
    <BlocksControls
      index={index}
      focusRing={{ offset: { x: 0, y: 16 }, borderRadius: 0 }}>
      <div css={css`
        margin: 0 auto;
        max-width: 920px;
      `}>
        <InlineMarkdownField
          name="content"
          content={data.content} />
      </div>
    </BlocksControls>
    </div>
  )
}

type TwoColumnText = {
  _template: 'TwoColumnText',
  leftContent: string,
  rightContent: string,
}

const TwoColumnTextTemplate = ({
  index,
  data,
}: {
  index: number,
  data: TwoColumnText,
}) => {
  return (
    <div css={css`
      padding-top: 48px;
      &:first-child {
        padding-top: 0;
      }
      & + & {
        padding-top: 32px;
      }
    `}>
      <BlocksControls
        index={index}
        focusRing={{ offset: { x: 0, y: 16 }, borderRadius: 0 }}>
        <div css={css`
          display: grid;
          grid-template-columns: 1fr 1fr;
          padding: 0 32px;
          grid-column-gap: 64px;
          grid-auto-flow: column;
          max-width: 920px;
          margin: 0 auto;
        `}>
          <InlineMarkdownField
            name="leftContent"
            content={data.leftContent} />
          <InlineMarkdownField
            name="rightContent"
            content={data.rightContent} />
        </div>
      </BlocksControls>
    </div>
  )
}


type TeamInfo = {
  name: string,
  leads: Array<{ name: string, image: string }>,
  description: string,
  color: string,
}

type TeamExplorer = {
  _template: 'TeamExplorer',
  teams: Array<TeamInfo>,
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

const TeamEntryTemplate = ({
  index,
  data,
  selected,
  setSelected,
}: {
  index: number,
  data: TeamInfo,
  selected?: number,
  setSelected?: (index: number) => void
}) => {
  const leads = data.leads.length !== 0 ?
    data.leads :
    [{ name: 'No lead yet', image: '/images/placeholder.svg' }]

  return (
    <div
      css={css`
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

const TeamExplorerTemplate = ({
  index,
  data,
}: {
  index: number,
  data: TeamExplorer,
}) => {
  const [selected, setSelected] = React.useState(0)
  const current = React.useMemo(() => data.teams[selected], [selected])

  return (
    <div css={css`
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
            <div css={css`
              padding-bottom: 24px;
            `}>
              <Typography variant="ContentTitle">
                <InlineText
                  name={`teams[${selected}]name`}
                  focusRing={{ borderRadius: 0 }}>
                  {current.name}
                </InlineText>
              </Typography>
            </div>
            <InlineMarkdownField
              name={`teams[${selected}]description`}
              content={current.description} />
          </div>
        </div>
      </BlocksControls>
    </div>
  )
}

type HubStructureBlock = OneColumnText | TwoColumnText | TeamExplorer

type HubStructureData = {
  blocks: Array<HubStructureBlock>
}

const HubStructure = ({
  file
}: {
  file: GithubFile<HubStructureData>
}) => {
  const [data, form] = useGithubJsonForm(file, {
    label: 'Hub Structure',
  })
  usePlugin(form)

  return (
    <>
      <Hero />
      <div css={css`
        padding: 120px 0;
      `}>
        <ModalProvider>
          <InlineForm form={form}>
            <InlineBlocks
              name="blocks"
              blocks={{
                OneColumnText: {
                  Component: OneColumnTextTemplate,
                  template: { label: 'One Column Text', defaultItem: { content: '' }, fields: [] },
                },
                TwoColumnText: {
                  Component: TwoColumnTextTemplate,
                  template: { label: 'Two Column Text', defaultItem: { leftContent: '', rightContent: '' }, fields: [] }
                },
                TeamExplorer: {
                  Component: TeamExplorerTemplate,
                  template: { label: 'Team Explorer', defaultItem: defaultTeamExplorer, fields: [] },
                },
              }} />
          </InlineForm>
        </ModalProvider>
      </div>
    </>
  )
}

export default HubStructure
export const getStaticProps: GetStaticProps = async ({
 preview,
 previewData,
}) => {
  if (preview) {
    console.log(previewData)
    return getGithubPreviewProps({
      ...previewData,
      fileRelativePath: 'content/hub-structure.json',
      parse: parseJson,
    })
  }

 return {
   props: {
     sourceProvider: null,
     error: null,
     preview: false,
     file: {
       fileRelativePath: 'content/hub-structure.json',
       data: (await import('../../content/hub-structure.json')).default,
     },
   },
 }
}
  