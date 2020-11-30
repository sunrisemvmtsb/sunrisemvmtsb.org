import React from 'react'
import { css } from 'styled-components'
import { InlineBlocks, InlineForm } from 'react-tinacms-inline'
import { usePlugin } from 'tinacms'
import { GetStaticProps } from 'next'
import { useGithubJsonForm, useGithubToolbarPlugins } from 'react-tinacms-github'
import { getGithubPreviewProps, parseJson, GithubFile } from 'next-tinacms-github'
import * as OneColumnText from '../components/blocks/OneColumnText'
import * as TwoColumnText from '../components/blocks/TwoColumnText'
import * as TeamExplorer from '../components/blocks/TeamExplorer'
import HeadlineHero from '../components/heros/HeadlineHero'

type HubStructureBlock =
  | { _template: 'OneColumnText' } & OneColumnText.Data
  | { _template: 'TwoColumnText' } & TwoColumnText.Data
  | { _template: 'TeamExplorer' } & TeamExplorer.Data

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
      <HeadlineHero
        lead="Sunrise Santa Barbara’s"
        title="Hub Structure & Teams" />
      <div css={css`
        padding: 120px 0;
      `}>
        <InlineForm form={form}>
          <InlineBlocks
            name="blocks"
            blocks={{ OneColumnText, TwoColumnText, TeamExplorer }} />
        </InlineForm>
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
  