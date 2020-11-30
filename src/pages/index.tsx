import glob from 'glob'
import Head from 'next/head'
import { css } from 'styled-components'
import { GetStaticProps } from 'next'
import { useCMS, usePlugin } from 'tinacms'
import { InlineForm, InlineBlocks } from 'react-tinacms-inline'
import { useGithubJsonForm } from 'react-tinacms-github'
import { getGithubPreviewProps, parseJson, GithubFile } from 'next-tinacms-github'
import InlineAdjustableImage, { Data as InlineAdjustableImageData } from '../components/fields/InlineAdjustableImage'
import HomeHero from '../components/heros/HomeHero'
import * as CallToAction from '../components/blocks/CallToAction'

type HeroData = {
  background: InlineAdjustableImageData
}

type BlocksData =
  | { _template: 'CallToAction' } & CallToAction.Data

type HomeData = {
  hero: HeroData,
  blocks: Array<BlocksData>
}

const Home = ({
  file,
}: {
  file: GithubFile<HomeData>
}) => {
  const [data, form] = useGithubJsonForm(file, {
    label: 'Home Page'
  }) as [HomeData, any]
  usePlugin(form)

  return (
    <InlineForm form={form}>
      <HomeHero
        data={{
          background: {
            data: data.hero.background,
            name: 'hero.background',
          }
        }} />
      <InlineBlocks
        name="blocks"
        blocks={{ CallToAction }} />
    </InlineForm>
  )
}

export default Home

export const getStaticProps: GetStaticProps = async ({
  preview,
  previewData,
}) => {
  if (preview) {
    return getGithubPreviewProps({
      ...previewData,
      fileRelativePath: 'content/index.json',
      parse: parseJson,
    })
  }

  return {
    props: {
      sourceProvider: null,
      error: null,
      preview: false,
      file: {
        fileRelativePath: 'content/index.json',
        data: (await import('../../content/index.json')).default,
      },
    },
  }
}
