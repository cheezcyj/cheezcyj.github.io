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
