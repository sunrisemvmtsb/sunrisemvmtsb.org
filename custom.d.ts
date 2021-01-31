declare module '*.svg' {
  import React from 'react'
  const value: React.ComponentType
  export default value
}

declare module 'formidable-serverless' {
  export { IncomingForm } from 'formidable'
}

declare module 'remark-unwrap-images' {
  import { Attacher } from 'unist'
  const stuff: Attacher
  export default stuff
}

declare interface IResizeObserverEntry {
  readonly borderBoxSize: Readonly<{ blockSize: number, inlineSize: number }>
  readonly contentBoxSize: Readonly<{ blockSize: number, inlineSize: number }>
  readonly contentRect: DOMRectReadOnly
  readonly target: Element | SVGElement
}

declare class ResizeObserver {
  constructor(callback: (entries: ReadonlyArray<IResizeObserverEntry>, observer: ResizeObserver) => void)
  disconnect(): void
  observe(target: Element | SVGElement, options?: { box: 'content-box' | 'border-box' | 'device-pixel-content-box' }): void
  unobserve(target: Element | SVGElement): void
}
