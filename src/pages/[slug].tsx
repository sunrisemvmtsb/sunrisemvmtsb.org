import React from 'react'
import { css } from 'styled-components'
import { InlineForm } from 'react-tinacms-inline'
import { usePlugin } from 'tinacms'
import { GetServerSideProps } from 'next'
import { useJsonForm, JsonFile } from '../infrastructure/CustomGitClient'
import * as OneColumnText from '../components/blocks/OneColumnText'
import * as TwoColumnText from '../components/blocks/TwoColumnText'
import * as TeamExplorer from '../components/blocks/TeamExplorer'
import * as CallToAction from '../components/blocks/CallToAction'
import * as HeadlineHero from '../components/blocks/HeadlineHero'
import Blocks from '../components/fields/Blocks'
import path from 'path'
import fs from 'fs'

type BlocksData =
  | { _template: 'HeadlineHero' } & HeadlineHero.Data
  | { _template: 'CallToAction' } & CallToAction.Data
  | { _template: 'OneColumnText' } & OneColumnText.Data
  | { _template: 'TwoColumnText' } & TwoColumnText.Data
  | { _template: 'TeamExplorer' } & TeamExplorer.Data

const blocks = {
  HeadlineHero, CallToAction, OneColumnText, TwoColumnText, TeamExplorer
}

type PageData = {
  title: string,
  description: string,
  blocks: Array<BlocksData>
}

const Page = ({
  file,
}: {
  file: JsonFile<PageData>,
}) => {
  const [data, form] = useJsonForm(file, {
    label: file.data.title,
  })
  usePlugin(form)

  return (
    <InlineForm form={form}>
      <Blocks
        name="blocks"
        blocks={{ HeadlineHero, CallToAction, OneColumnText, TwoColumnText, TeamExplorer }}
        data={file.data.blocks} />
    </InlineForm>
  )
}

export default Page

export const getServerSideProps: GetServerSideProps<{ file: JsonFile<PageData>, preview: boolean }, { slug: string }> = async ({
  preview,
  previewData,
  params,
}) => {
  const file = {
    fileRelativePath: `content/pages/${params.slug}.json`,
    data: JSON.parse(fs.readFileSync(path.resolve(process.cwd(), `./content/pages/${params.slug}.json`), 'utf-8')),
  }

  const config = {
    fileRelativePath: `content/config.json`,
    data: JSON.parse(fs.readFileSync(path.resolve(process.cwd(), `./content/pages/${params.slug}.json`), 'utf-8')),
  }

  return {
    props: { file, config, preview: !!preview }
  }
}


// export const getStaticProps: GetStaticProps = async ({
//  preview,
//  previewData,
//  params
// }) => {
//   if (preview) {
//     return getGithubPreviewProps({
//       ...previewData,
//       fileRelativePath: `content/pages/${params.slug}.json`,
//       parse: parseJson,
//     })
//   }

//   return {
//     props: {
//       sourceProvider: null,
//       error: null,
//       preview: false,
//       file: {
//         fileRelativePath: `content/pages/${params.slug}.json`,
//         data: (await import(`../../content/pages/${params.slug}.json`)).default,
//       },
//     },
//   }
// }

// export const getStaticPaths: GetStaticPaths = async () => {
//   const paths = glob.sync('content/pages/*.json')
//   return {
//     paths: paths.map((p) => ({
//       params: { slug: path.basename(p, '.json') },
//     })),
//     fallback: false,
//   }
// }
