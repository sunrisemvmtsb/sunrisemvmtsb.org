import dynamic from 'next/dynamic'
import type { InlineBlocksProps } from 'react-tinacms-inline'
import type { Props as CallToActionProps } from './CallToAction'
import type { Props as EventsListProps } from './EventsList'
import type { Props as NewsHeadlinesProps } from './NewsHeadlines'
import type { Props as PrimaryHeroProps } from './PrimaryHero'
import type { Props as HeadlineHeroProps } from './HeadlineHero'
import type { Props as OneColumnTextProps } from './OneColumnText'
import type { Props as TwoColumnTextProps } from './TwoColumnText'
import type { Props as TeamExplorerProps } from './TeamExplorer'
import CallToActionData from '../../domain/blocks/CallToAction'

const CallToActionComponent = dynamic<CallToActionProps>(() => import(/* webpackChunkName: "blocks" */ './CallToAction'))
const CallToAction = {
  Component: CallToActionComponent as any,
  template: {
    label: 'Call To Action',
    defaultItem: CallToActionData.default,
    fields: []
  },
}

const EventsListComponent = dynamic<EventsListProps>(() => import(/* webpackChunkName: "blocks" */ './EventsList'))
const EventsList = {
  Component: EventsListComponent as any,
  template:  {
    label: 'Events List',
    defaultItem: {},
    fields: []
  }
}

const NewsHeadlinesComponent = dynamic<NewsHeadlinesProps>(() => import(/* webpackChunkName: "blocks" */ './NewsHeadlines'))
const NewsHeadlines = {
  Component: NewsHeadlinesComponent as any,
  template:  {
    label: 'News Headlines',
    defaultItem: {},
    fields: []
  }
}

const PrimaryHeroComponent = dynamic<PrimaryHeroProps>(() => import(/* webpackChunkName: "blocks" */ './PrimaryHero'))
const PrimaryHero = {
  Component: PrimaryHeroComponent as any,
  template:  {
    label: 'Primary Hero',
    fields: [],
    defaultItem: {
      background: {
        path: '/images/placeholder.svg',
        alt: '',
        x: 'center',
        y: 'center',
        fit: 'cover',
      },
    },
  }
}

const HeadlineHeroComponent = dynamic<HeadlineHeroProps>(() => import(/* webpackChunkName: "blocks" */ './HeadlineHero'))
const HeadlineHero = {
  Component: HeadlineHeroComponent as any,
  template:  {
    label: 'Headline Hero',
    fields: [],
    defaultItem: {
      lead: 'Lead',
      title: 'Title'
    },
  }
}

const OneColumnTextComponent = dynamic<OneColumnTextProps>(() => import(/* webpackChunkName: "blocks" */ './OneColumnText'))
const OneColumnText = {
  Component: OneColumnTextComponent as any,
  template: {
    label: 'One Column Text',
    defaultItem: { content: '' },
    fields: []
  }
}

const TwoColumnTextComponent = dynamic<TwoColumnTextProps>(() => import(/* webpackChunkName: "blocks" */ './TwoColumnText'))
const TwoColumnText = {
  Component: TwoColumnTextComponent as any,
  template: {
    label: 'Two Column Text',
    defaultItem: {
      leftContent: '',
      rightContent: '',
    },
    fields: []
  }
}


const TeamExplorerComponent = dynamic<TeamExplorerProps>(() => import(/* webpackChunkName: "blocks" */ './TeamExplorer'))
const TeamExplorer = {
  Component: TeamExplorerComponent as any,
  template: {
    label: 'Team Explorer',
    defaultItem: { teams: [] },
    fields: []
  },
}


const blocks: InlineBlocksProps['blocks'] = {
  CallToAction,
  EventsList,
  NewsHeadlines,
  PrimaryHero,
  HeadlineHero,
  OneColumnText,
  TwoColumnText,
  TeamExplorer,
}

export default blocks
