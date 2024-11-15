"use strict"

const Sizes = Object.freeze({
    XSMALL: Symbol(0.4),
    SMALL: Symbol(0.7),
    MEDIUM: Symbol(1),
    LARGE: Symbol(1.3),
    XLARGE: Symbol(1.6),
    XXLARGE: Symbol(2),
});

const ICON_PREFIX = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 -960 960 960\" style=\"fill: var(--color-text); height: calc(var(--font-size)*{{factor}}); width: calc(var(--font-size)*{{factor}})\">"
const ICON_SUFFIX = "</svg>"

function buildIcon(icon, size) {
    let prefix = ICON_PREFIX
    prefix = ICON_PREFIX.replace(/{{factor}}/g, size.description)

    return prefix + icon + ICON_SUFFIX
}

const bodies = {
    "ADD": "<path d=\"M440-440H200v-80h240v-240h80v240h240v80H520v240h-80v-240Z\"/>"    ,
    "REMOVE": "<path d=\"M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z\"/>"    ,
    "INFO": "<path d=\"M440-280h80v-240h-80v240Zm40-320q17 0 28.5-11.5T520-640q0-17-11.5-28.5T480-680q-17 0-28.5 11.5T440-640q0 17 11.5 28.5T480-600Zm0 520q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z\"/>",
    "MINUS": "<path d=\"M200-440v-80h560v80H200Z\"/>"
}

export const ICONS = {}
for (let icon in bodies) {
    ICONS[icon] = {}
    for (let size in Sizes) {
        ICONS[icon][size] = buildIcon(bodies[icon], Sizes[size])
    }
}
console.log(ICONS)
