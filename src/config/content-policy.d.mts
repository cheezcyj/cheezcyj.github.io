export type ProjectDateIssue =
  | 'completed-before-started'
  | 'completed-missing-completedAt'
  | 'planned-has-completedAt'

export type ProjectMediaIssueCode =
  | 'invalid-project-media-src'
  | 'empty-project-media-alt'
  | 'invalid-project-media-width'
  | 'invalid-project-media-height'
  | 'duplicate-project-gallery-src'
  | 'cover-gallery-src-duplicate'

export interface ProjectMediaIssue {
  code: ProjectMediaIssueCode
  path: Array<string | number>
}

export const LEGACY_PLACEHOLDER_ASSETS: readonly string[]
export const V0_SAMPLE_ASSET_PATTERN: RegExp
export const PLACEHOLDER_TEXT_PATTERN: RegExp

export function isPlaceholderAsset(value: unknown): boolean
export function isPlaceholderText(value: unknown): boolean
export function isPlaceholderLink(value: unknown): boolean
export function isValidLegacyUrl(value: unknown): value is string
export function normalizeLegacyUrl(value: string): string
export function isValidRootRelativeAssetPath(value: unknown): value is string
export function getProjectMediaIssues(project: {
  cover?: {
    src?: unknown
    alt?: unknown
    width?: unknown
    height?: unknown
  }
  gallery?: Array<{
    src?: unknown
    alt?: unknown
    width?: unknown
    height?: unknown
  }>
}): ProjectMediaIssue[]
export function isValidDateValue(value: unknown): boolean
export function getProjectDateIssues(project: {
  status?: unknown
  startedAt?: unknown
  completedAt?: unknown
}): ProjectDateIssue[]
