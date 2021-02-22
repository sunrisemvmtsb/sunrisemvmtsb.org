import React from 'react'
import { useForm, useCMS, Form, usePlugin, GlobalFormPlugin, useScreenPlugin } from 'tinacms'
import { UnorderedListIcon, ChevronRightIcon } from '@tinacms/icons'
import { ModalBody } from 'tinacms'
import * as uuid from 'uuid'
import { css } from 'styled-components'
import container from '../infrastructure/Container.client'
import SiteConfigService from '../services/SiteConfigService'
import PagesService from '../services/PagesService'
import usePromise from '../hooks/usePromise'
import PageSummary from '../domain/PageSummary'
import NewsService from '../services/NewsService'
import NewsSummary from '../domain/NewsSummary'

const PageItem = ({
  title,
  url,
}: {
  title: string,
  url: string,
}) => (
  <li css={css`
    padding: 16px;
    border-top: 1px solid var(--tina-color-grey-2);
    :first-child {
      border-top: 0;
    }
  `}>
    <a
      href={url}
      css={css`
        display: grid;
        grid-auto-flow: column;
        grid-template-columns: 1fr auto;
        grid-column-gap: 8px;
        align-items: center;
        &:hover [data-hoverable] {
          color: var(--tina-color-primary);
        }
      `}>
      <span>
        <span
          data-hoverable
          css={css`
            display: block;
            color: var(--tina-color-grey-8);
            font-size: var(--tina-font-size-1);
            font-weight: 600;
            padding-bottom: 4px;
            text-overflow: ellipsis;
            overflow-x: hidden;
          `}>
          {title}
        </span>
        <span css={css`
          color: var(--tina-color-grey-4);
          font-size: var(--tina-font-size-1);
          text-overflow: ellipsis;
          overflow-x: hidden;
          display: block;
        `}>
          {url}
        </span>
      </span>
      <span
        data-hoverable
        css={css`
          color: var(--tina-color-grey-4);
          svg {
            fill: currentColor;
            width: 18px;
            height: 18px;
          }
        `}>
        <ChevronRightIcon />
      </span>
    </a>
  </li>
)

const Component = ({
  pages,
  news,
}: {
  pages: Array<PageSummary>,
  news: Array<NewsSummary>,
}) => {
  return (
    <ModalBody
      padded
      css={css`
        max-height: 75vh;
        overflow-y: auto;
      `}>
      <div>
        <div css={css`
          font-size: var(--tina-font-size-1);
          font-weight: 600;
          padding-bottom: 8px;
        `}>
          Pages
        </div>
        <ul css={css`
          list-style: none;
          margin: 0;
          padding: 0;
          border-radius: var(--tina-radius-small);
          background-color: #fff;
          border: 1px solid var(--tina-color-grey-2);
          margin-bottom: 32px;
        `}>
          {[ { title: 'Home', slug: '' }, ...pages].map((page) => (
            <PageItem title={page.title} url={PageSummary.href(page)} key={page.slug} />
          ))}
        </ul>
        <div css={css`
          font-family: 'Inter', sans-serif;
          font-size: var(--tina-font-size-1);
          font-weight: 600;
          padding-bottom: 8px;
        `}>
          News
        </div>
        <ul css={css`
          list-style: none;
          margin: 0;
          padding: 0;
          border-radius: var(--tina-radius-small);
          background-color: #fff;
          border: 1px solid var(--tina-color-grey-2);
          margin-bottom: 32px;
        `}>
          {news.map((news) => (
            <PageItem title={news.title} url={NewsSummary.href(news)} key={news.slug} />
          ))}
        </ul>
      </div>
    </ModalBody>
  )
}

export default class ContentListPlugin {
  private static _instance: ContentListPlugin | null = null
  static get instance(): ContentListPlugin {
    if (this._instance === null) this._instance = new ContentListPlugin()
    return this._instance
  }

  private _pagesService: PagesService
  private _newsService: NewsService
  public constructor() {
    this._pagesService = container.get(PagesService)
    this._newsService = container.get(NewsService)
  }

  static use() {
    const [pages] = usePromise([], () => this.instance._pagesService.listPageSummaries())
    const [news] = usePromise([], () => this.instance._newsService.listNewsSummaries())

    return useScreenPlugin({
      name: 'Go to page',
      layout: 'popup',
      Icon: UnorderedListIcon,
      Component: Component as any,
      props: {
        pages,
        news,
      }
    })
  }
}
