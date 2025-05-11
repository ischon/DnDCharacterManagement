import { describe, it, expect } from 'vitest'
import { ICONS } from '@/helpers/icons.js'

describe('icons', () => {
  it('should build SVG for ADD icon with XSMALL size', () => {
    const svg = ICONS.ADD.XSMALL
    expect(svg).toContain(
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" style="fill: var(--color-text); height: calc(var(--font-size)*0.4); width: calc(var(--font-size)*0.4)">'
    )
    expect(svg).toContain('<path d="M440-440H200v-80h240v-240h80v240h240v80H520v240h-80v-240Z"/>')
    expect(svg).toContain('</svg>')
  })

  it('should build SVG for REMOVE icon with MEDIUM size', () => {
    const svg = ICONS.REMOVE.MEDIUM
    expect(svg).toContain(
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" style="fill: var(--color-text); height: calc(var(--font-size)*1); width: calc(var(--font-size)*1)">'
    )
    expect(svg).toContain(
      '<path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"/>'
    )
    expect(svg).toContain('</svg>')
  })

  it('should build SVG for INFO icon with LARGE size', () => {
    const svg = ICONS.INFO.LARGE
    expect(svg).toContain(
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" style="fill: var(--color-text); height: calc(var(--font-size)*1.3); width: calc(var(--font-size)*1.3)">'
    )
    expect(svg).toContain(
      '<path d="M440-280h80v-240h-80v240Zm40-320q17 0 28.5-11.5T520-640q0-17-11.5-28.5T480-680q-17 0-28.5 11.5T440-640q0 17 11.5 28.5T480-600Zm0 520q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z"/>'
    )
    expect(svg).toContain('</svg>')
  })

  it('should build SVG for MINUS icon with XLARGE size', () => {
    const svg = ICONS.MINUS.XLARGE
    expect(svg).toContain(
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" style="fill: var(--color-text); height: calc(var(--font-size)*1.6); width: calc(var(--font-size)*1.6)">'
    )
    expect(svg).toContain('<path d="M200-440v-80h560v80H200Z"/>')
    expect(svg).toContain('</svg>')
  })
})
