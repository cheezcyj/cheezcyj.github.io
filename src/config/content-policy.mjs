/**
 * Shared publication safeguards used by Astro schemas, runtime queries, and
 * the standalone Node validation script. Keep this module dependency-free so
 * every execution environment applies the same policy.
 */

export const LEGACY_PLACEHOLDER_ASSETS = Object.freeze([
  '/img/profile.png',
  '/img/profile2.png',
  '/img/portfolio/cabin.png',
  '/img/portfolio/cake.png',
  '/img/portfolio/circus.png',
  '/img/portfolio/game.png',
  '/img/portfolio/safe.png',
  '/img/portfolio/submarine.png',
  '/screenshot.png',
])

const legacyPlaceholderAssetSet = new Set(LEGACY_PLACEHOLDER_ASSETS)

export const V0_SAMPLE_ASSET_PATTERN =
  /\/(?:design-(?:analytics-dashboard-dark|aurora-banking-app-dark-ui|creative-studio-landing-page|editorial-magazine-website-layout|skincare-brand-landing-page)|frontend-(?:component-library-storybook|kanban-board-app|weather-dashboard-charts)|placeholder(?:-logo|-user)?|apple-icon|icon(?:-dark-32x32|-light-32x32)?)\.(?:png|jpe?g|svg)$/i

export const PLACEHOLDER_TEXT_PATTERN =
  /(?:lorem ipsum|start bootstrap|hello@choeyoojeong\.dev)/i

/** @param {unknown} value */
export function isPlaceholderAsset(value) {
  return (
    typeof value === 'string' &&
    (legacyPlaceholderAssetSet.has(value.toLowerCase()) ||
      V0_SAMPLE_ASSET_PATTERN.test(value))
  )
}

/** @param {unknown} value */
export function isPlaceholderText(value) {
  return (
    typeof value === 'string' &&
    (PLACEHOLDER_TEXT_PATTERN.test(value) || /^project\s*\d+$/i.test(value))
  )
}

/** @param {unknown} value */
export function isPlaceholderLink(value) {
  if (typeof value !== 'string' || value === '#') return true

  try {
    const url = new URL(value)
    const hostname = url.hostname.toLowerCase()

    return (
      !['http:', 'https:'].includes(url.protocol) ||
      (hostname === 'github.com' && url.pathname === '/') ||
      hostname === 'localhost' ||
      hostname.endsWith('.localhost') ||
      hostname === 'example.com' ||
      hostname.endsWith('.example.com')
    )
  } catch {
    return true
  }
}

/** @param {unknown} value */
export function isValidLegacyUrl(value) {
  if (typeof value !== 'string' || value.length === 0 || /[\s\\]/.test(value)) {
    return false
  }

  if (value.startsWith('#')) return value.length > 1
  if (!value.startsWith('/') || value.startsWith('//')) return false

  try {
    decodeURI(value)
    const url = new URL(value, 'https://legacy.invalid')
    return (
      url.origin === 'https://legacy.invalid' && url.pathname.startsWith('/')
    )
  } catch {
    return false
  }
}

/**
 * @param {string} value
 * @returns {string}
 */
export function normalizeLegacyUrl(value) {
  if (!isValidLegacyUrl(value)) {
    throw new TypeError(`Invalid legacy URL: ${value}`)
  }

  if (value.startsWith('#')) return value.toLowerCase()

  const url = new URL(value, 'https://legacy.invalid')
  let pathname = url.pathname.replace(/\/{2,}/g, '/')
  if (pathname.length > 1) pathname = pathname.replace(/\/+$/, '')

  return `${pathname}${url.search}${url.hash}`.toLowerCase()
}

/** @param {unknown} value */
export function isValidRootRelativeAssetPath(value) {
  if (
    typeof value !== 'string' ||
    value.length === 0 ||
    !value.startsWith('/') ||
    value.startsWith('//') ||
    /[\s\\?#]/.test(value)
  ) {
    return false
  }

  try {
    const decoded = decodeURI(value)
    if (decoded.split('/').some((segment) => ['.', '..'].includes(segment))) {
      return false
    }

    const url = new URL(value, 'https://assets.invalid')
    return (
      url.origin === 'https://assets.invalid' &&
      url.pathname === value &&
      url.search === '' &&
      url.hash === ''
    )
  } catch {
    return false
  }
}

/**
 * @typedef {{ src?: unknown, alt?: unknown, width?: unknown, height?: unknown }} ProjectMediaReference
 * @typedef {'invalid-project-media-src' | 'empty-project-media-alt' | 'invalid-project-media-width' | 'invalid-project-media-height' | 'duplicate-project-gallery-src' | 'cover-gallery-src-duplicate'} ProjectMediaIssueCode
 * @typedef {{ code: ProjectMediaIssueCode, path: Array<string | number> }} ProjectMediaIssue
 */

/**
 * @param {{ cover?: ProjectMediaReference, gallery?: ProjectMediaReference[] }} project
 * @returns {ProjectMediaIssue[]}
 */
export function getProjectMediaIssues(project) {
  /** @type {ProjectMediaIssue[]} */
  const issues = []
  const gallery = Array.isArray(project.gallery) ? project.gallery : []
  const coverSource = isValidRootRelativeAssetPath(project.cover?.src)
    ? project.cover.src.toLowerCase()
    : undefined
  const gallerySources = new Set()

  for (const [kind, image, index] of [
    ['cover', project.cover, undefined],
    ...gallery.map((item, itemIndex) => ['gallery', item, itemIndex]),
  ]) {
    if (!image) continue
    const pathPrefix = kind === 'cover' ? ['cover'] : ['gallery', index]

    if (!isValidRootRelativeAssetPath(image.src)) {
      issues.push({
        code: 'invalid-project-media-src',
        path: [...pathPrefix, 'src'],
      })
    }
    if (typeof image.alt !== 'string' || image.alt.trim().length === 0) {
      issues.push({
        code: 'empty-project-media-alt',
        path: [...pathPrefix, 'alt'],
      })
    }
    if (!Number.isInteger(image.width) || image.width <= 0) {
      issues.push({
        code: 'invalid-project-media-width',
        path: [...pathPrefix, 'width'],
      })
    }
    if (!Number.isInteger(image.height) || image.height <= 0) {
      issues.push({
        code: 'invalid-project-media-height',
        path: [...pathPrefix, 'height'],
      })
    }

    if (kind !== 'gallery' || !isValidRootRelativeAssetPath(image.src)) {
      continue
    }

    const source = image.src.toLowerCase()
    if (source === coverSource) {
      issues.push({
        code: 'cover-gallery-src-duplicate',
        path: [...pathPrefix, 'src'],
      })
    }
    if (gallerySources.has(source)) {
      issues.push({
        code: 'duplicate-project-gallery-src',
        path: [...pathPrefix, 'src'],
      })
    }
    gallerySources.add(source)
  }

  return issues
}

/** @param {unknown} value */
export function isValidDateValue(value) {
  if (value instanceof Date) return !Number.isNaN(value.getTime())
  if (typeof value !== 'string' && typeof value !== 'number') return false

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return false

  if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return date.toISOString().slice(0, 10) === value
  }

  return true
}

/**
 * @typedef {'completed-before-started' | 'completed-missing-completedAt' | 'planned-has-completedAt'} ProjectDateIssue
 */

/**
 * @param {{ status?: unknown, startedAt?: unknown, completedAt?: unknown }} project
 * @returns {ProjectDateIssue[]}
 */
export function getProjectDateIssues(project) {
  /** @type {ProjectDateIssue[]} */
  const issues = []
  const hasCompletedAt =
    project.completedAt !== undefined && project.completedAt !== null

  if (project.status === 'completed' && !hasCompletedAt) {
    issues.push('completed-missing-completedAt')
  }

  if (project.status === 'planned' && hasCompletedAt) {
    issues.push('planned-has-completedAt')
  }

  if (
    isValidDateValue(project.startedAt) &&
    isValidDateValue(project.completedAt) &&
    new Date(project.completedAt).getTime() <
      new Date(project.startedAt).getTime()
  ) {
    issues.push('completed-before-started')
  }

  return issues
}
