declare module '*.svg' {
  import React from 'react'
  const value: React.ComponentType
  export default value
}

declare module 'formidable-serverless' {
  export { IncomingForm } from 'formidable'
}
