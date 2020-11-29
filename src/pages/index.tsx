import glob from 'glob'
import Head from 'next/head'
import { GetStaticProps } from 'next'
import { useForm, Select } from 'tinacms'
import { InlineForm, InlineImage, InlineGroup, InlineField } from 'react-tinacms-inline'

type HomeProps = {
  jsonFile: {
    fileRelativePath: string,
    data: {
      hero: {
        background: {
          path: string,
          top: string,
          left: string,
        }
      },
    },
  },
  ctas: Array<{
    title: string,
    description: string,
    url: string,
    image: string,
    created: number,
  }>
}

const Hero = () => {
  return (
    <>
      <InlineGroup
        name="hero"
        focusRing={{ offset: 0, borderRadius: 0 }}>
        <header className="group">
          <div className="image">
            <InlineImage
              name="background"
              parse={(media) => media.id}
              focusRing={{ offset: 0, borderRadius: 0 }} />
            <div className="imageOverlay" />
          </div>
          <div className="content">
            <h1 className="title">
              <span className="titleLine">We are</span>
              <span className="titleLineEmphasis">Sunrise</span>
              <span className="titleLine">Santa Barbara</span>
            </h1>
          </div>
        </header>
      </InlineGroup>
      <style jsx>{`
        .group {
          position: relative;
          padding: 120px;
        }
        .image {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          z-index: 0;
        }
        .image :global(img) {
          width: 100%;
          height: 100%;
          display: block;
          object-fit: cover;
          object-position: center center;
          position: relative;
          z-index: 1;
        }
        .imageOverlay {
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
        }
        .content {
          position: relative;
          z-index: 1;
        }
        .title {
          font-size: 104px;
          margin: 0;
          text-transform: uppercase;
          font-weight: 700;
          color: #fff;
          line-height: 93.6px;
        }
        .titleLine {
          display: block;
        }
        .titleLineEmphasis {
          display: block;
          color: #ffde16;
        }
      `}</style>
    </>
  )
}

const Cta = () => {
  return 
}

const Home = (props: HomeProps) => {
  const [values, form] = useForm({
    id: 'home',
    label: 'Edit Home Page',
    initialValues: {
      hero: props.jsonFile.data.hero,
      ctas: props.ctas,
    },
    fields: [
      {
        name: 'hero',
        label: 'Hero',
        component: 'group',
        fields: [
          {
            name: 'background',
            label: 'Background',
            component: 'image',
          },
        ],
      },
    ],
    onSubmit(formData) {
    },
  })

  return (
    <InlineForm form={form}>
      <Hero />
      <div className="ctas-container">
        <div>
          {values.ctas.map((cta, index) => {
            return (
              <InlineGroup
                key={cta.title}
                name={`ctas.${index}`}
                fields={[
                  {
                    name: 'title',
                    label: 'Title',
                    component: 'string',
                  },
                ]}>
                {cta.title}
              </InlineGroup>
            )
          })}
        </div>
      </div>
      <style jsx>{`
        .ctas-container {
          width: 100%;
          max-width: 920px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 2fr 1fr;
          grid-auto-flow: column;
        }
      `}</style>
    </InlineForm>
  )
}

export default Home

export const getStaticProps: GetStaticProps = async (ctx) => {
  const content = await import('../../content/index.json')
  const ctaPaths = glob.sync('content/ctas/**/*.json')
  console.log(ctaPaths)

  return {
    props: {
      jsonFile: {
        fileRelativePath: '/content/index.json',
        data: content.default,
      },
      ctas: ctaPaths,
    },
  }
}
