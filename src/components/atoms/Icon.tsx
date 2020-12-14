import React from 'react'

type Icon
  = 'Instagram'
  | 'Favorite'
  | 'Comment'
  | 'PlayArrow'
  | 'Videocam'
  | 'Info'

const Icon = ({
  icon,
  className,
}: {
  icon: Icon,
  className?: string,
}) => {
  switch (icon) {
    case 'Instagram':
      return instagram(className)
    case 'Favorite':
      return favorite(className)
    case 'Comment':
      return comment(className)
    case 'PlayArrow':
      return playArrow(className)
    case 'Videocam':
      return videocam(className)
    case 'Info':
      return info(className)
  }
}

export default Icon

const instagram = (className?: string) => (
  <svg viewBox="0 0 13 12" className={className}>
    <path d="M6.26343 1.0815C7.86543 1.0815 8.05543 1.0875 8.68843 1.1165C10.3144 1.1905 11.0739 1.962 11.1479 3.576C11.1769 4.2085 11.1824 4.3985 11.1824 6.0005C11.1824 7.603 11.1764 7.7925 11.1479 8.425C11.0734 10.0375 10.3159 10.8105 8.68843 10.8845C8.05543 10.9135 7.86643 10.9195 6.26343 10.9195C4.66143 10.9195 4.47143 10.9135 3.83893 10.8845C2.20893 10.81 1.45343 10.035 1.37943 8.4245C1.35043 7.792 1.34443 7.6025 1.34443 6C1.34443 4.398 1.35093 4.2085 1.37943 3.5755C1.45393 1.962 2.21143 1.19 3.83893 1.116C4.47193 1.0875 4.66143 1.0815 6.26343 1.0815ZM6.26343 0C4.63393 0 4.42993 0.007 3.78993 0.036C1.61093 0.136 0.399928 1.345 0.299928 3.526C0.270428 4.1665 0.263428 4.3705 0.263428 6C0.263428 7.6295 0.270428 7.834 0.299428 8.474C0.399428 10.653 1.60843 11.864 3.78943 11.964C4.42993 11.993 4.63393 12 6.26343 12C7.89293 12 8.09743 11.993 8.73743 11.964C10.9144 11.864 12.1284 10.655 12.2269 8.474C12.2564 7.834 12.2634 7.6295 12.2634 6C12.2634 4.3705 12.2564 4.1665 12.2274 3.5265C12.1294 1.3495 10.9189 0.1365 8.73793 0.0365C8.09743 0.007 7.89293 0 6.26343 0V0ZM6.26343 2.919C4.56193 2.919 3.18243 4.2985 3.18243 6C3.18243 7.7015 4.56193 9.0815 6.26343 9.0815C7.96493 9.0815 9.34443 7.702 9.34443 6C9.34443 4.2985 7.96493 2.919 6.26343 2.919ZM6.26343 8C5.15893 8 4.26343 7.105 4.26343 6C4.26343 4.8955 5.15893 4 6.26343 4C7.36793 4 8.26343 4.8955 8.26343 6C8.26343 7.105 7.36793 8 6.26343 8ZM9.46643 2.0775C9.06843 2.0775 8.74593 2.4 8.74593 2.7975C8.74593 3.195 9.06843 3.5175 9.46643 3.5175C9.86393 3.5175 10.1859 3.195 10.1859 2.7975C10.1859 2.4 9.86393 2.0775 9.46643 2.0775Z" />
  </svg>
)

const favorite = (className?: string) => (
  <svg viewBox="0 0 24 24" className={className}>
    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
  </svg>
)

const comment = (className?: string) => (
  <svg viewBox="0 0 24 24" className={className}>
    <path d="M21.99 4c0-1.1-.89-2-1.99-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14l4 4-.01-18zM18 14H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z"/>
  </svg>
)

const playArrow = (className?: string) => (
  <svg viewBox="0 0 24 24" className={className}><path d="M8 5v14l11-7z"/></svg>
)

const videocam = (className?: string) => (
  <svg viewBox="0 0 24 24" className={className}>
    <path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z"/>
  </svg>
)

const info = (className?: string) => (
  <svg viewBox="0 0 24 24" className={className}>
    <path d="M0 0h24v24H0z" fill="none"/><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/>
  </svg>
)
