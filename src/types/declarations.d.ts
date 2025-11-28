declare module 'uuid' {
  export function v4(): string
  export function v5(namespace: string, name: string): string
  export interface V4Options {
    random?: number[]
    rng?: () => number[]
  }
}

declare module 'qrcode.react' {
  import { ComponentType } from 'react'

  interface QRCodeProps {
    value: string
    size?: number
    level?: 'L' | 'M' | 'Q' | 'H'
    includeMargin?: boolean
    renderAs?: 'canvas' | 'svg'
    fgColor?: string
    bgColor?: string
    quietZone?: number
    style?: React.CSSProperties
    imageSettings?: {
      src: string
      x?: number
      y?: number
      height: number
      width: number
      opacity?: number
      excavate?: boolean
    }
  }

  const QRCode: ComponentType<QRCodeProps>
  export default QRCode
}
