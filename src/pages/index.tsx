import glob from 'glob'
import Head from 'next/head'
import { css } from 'styled-components'
import { GetStaticProps } from 'next'
import { usePlugin } from 'tinacms'
import { InlineForm, InlineImage, InlineGroup, InlineField } from 'react-tinacms-inline'
import { useGithubJsonForm } from 'react-tinacms-github'
import { getGithubPreviewProps, parseJson, GithubFile } from 'next-tinacms-github'
import InlineAdjustableImage, { Data as InlineAdjustableImageData } from '../components/fields/InlineAdjustableImage'

type HeroData = {
  background: InlineAdjustableImageData
}

type HomeData = {
  hero: HeroData,
  cta: {
    title: string,
    description: string,
    url: string,
    image: string,
    created: number,
  }
}

const Hero = ({
  data,
}: {
  data: HeroData
}) => {
  return (
    <>
      <InlineGroup
        name="hero"
        focusRing={{ offset: 0, borderRadius: 0 }}>
        <header css={css`
          position: relative;
          padding: 120px;
        `}>
          <div css={css`
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            z-index: 0;
          `}>
            <InlineAdjustableImage
              name="background"
              data={data.background}
              css={css`
                width: 100%;
                height: 100%;
                z-index: 1;
              `} />
            <div css={css`
              position: absolute;
              top: 0;
              left: 0;
              width: 100%;
              height: 100%;
              background-color: #753559;
              z-index: 2;
              pointer-events: none;
              mix-blend-mode: multiply;
              opacity: 0.8;
            `} />
          </div>
          <div css={css`
            position: relative;
            z-index: 1;
          `}>
            <h1 css={css`
              font-size: 104px;
              margin: 0;
              text-transform: uppercase;
              font-weight: 700;
              color: #fff;
              line-height: 93.6px;
            `}>
              <span css={css`display: block;`}>We are</span>
              <span css={css`
                display: block;
                color: #ffde16;
              `}>
                Sunrise
              </span>
              <span css={css`display: block;`}>Santa Barbara</span>
            </h1>
          </div>
        </header>
      </InlineGroup>
    </>
  )
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
      <Hero data={data.hero} />
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
