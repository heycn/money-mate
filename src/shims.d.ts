import * as React from 'react'
declare module 'react' {
  interface HTMLAttributes<T> extends AriaAttributes, DOMAttributes<T> {
    truncate?: boolea
    flex?: boolean
    relative?: boolean
    text?: string
    grid?: boolean
    before?: string
    after?: string
    shadow?: boolean
    w?: string
    h?: string
    bg?: string
    mt?: string
    rounded?: string
    fixed?: boolean
    border?: boolean
    z?: string
    block?: boolean
    my?: string
    b?: string
    transition?: string
    absolute?: boolean
    top?: string
    left?: string
  }
  interface SVGProps<T> extends SVGAttributes<T>, ClassAttributes<T> {
    w?: string
    h?: string
  }
}
