type AdjustableImage = {
  path: string,
  alt: string,
  x: 'center' | 'left' | 'right',
  y: 'center' | 'top' | 'bottom',
  fit: 'contain' | 'cover' | 'fill'
}

const AdjustableImage = {
  default: {
    path: '/images/placeholder.svg',
    alt: '',
    x: 'center',
    y: 'center',
    fit: 'cover',
  } as AdjustableImage,
}

export default AdjustableImage
