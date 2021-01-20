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

const CallToAction = {
  Component: dynamic<CallToActionProps>(() => import('./CallToAction')) as any,
  template: {
    label: 'Call To Action',
    defaultItem: CallToActionData.default,
    fields: []
  },
}

const EventsList = {
  Component: dynamic<EventsListProps>(() => import('./EventsList')) as any,
  template:  {
    label: 'Events List',
    defaultItem: {},
    fields: []
  }
}

const NewsHeadlines = {
  Component: dynamic<NewsHeadlinesProps>(() => import('./NewsHeadlines')) as any,
  template:  {
    label: 'News Headlines',
    defaultItem: {},
    fields: []
  }
}

const PrimaryHero = {
  Component: dynamic<PrimaryHeroProps>(() => import('./PrimaryHero')) as any,
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

const HeadlineHero = {
  Component: dynamic<HeadlineHeroProps>(() => import('./HeadlineHero')) as any,
  template:  {
    label: 'Headline Hero',
    fields: [],
    defaultItem: {
      lead: 'Lead',
      title: 'Title'
    },
  }
}

const OneColumnText = {
  Component: dynamic<OneColumnTextProps>(() => import('./OneColumnText')) as any,
  template: {
    label: 'One Column Text',
    defaultItem: { content: '' },
    fields: []
  }
}

const TwoColumnText = {
  Component: dynamic<TwoColumnTextProps>(() => import('./TwoColumnText')) as any,
  template: {
    label: 'Two Column Text',
    defaultItem: {
      leftContent: '',
      rightContent: '',
    },
    fields: []
  }
}


const TeamExplorer = {
  Component: dynamic<TeamExplorerProps>(() => import('./TeamExplorer')) as any,
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
