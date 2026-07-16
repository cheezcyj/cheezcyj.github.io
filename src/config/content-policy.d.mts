export type ProjectDateIssue =
  | 'completed-before-started'
  | 'completed-missing-completedAt'
  | 'planned-has-completedAt'

export const LEGACY_PLACEHOLDER_ASSETS: readonly string[]
export const V0_SAMPLE_ASSET_PATTERN: RegExp
export const PLACEHOLDER_TEXT_PATTERN: RegExp

export function isPlaceholderAsset(value: unknown): boolean
export function isPlaceholderText(value: unknown): boolean
export function isPlaceholderLink(value: unknown): boolean
export function isValidLegacyUrl(value: unknown): value is string
export function normalizeLegacyUrl(value: string): string
export function isValidDateValue(value: unknown): boolean
export function getProjectDateIssues(project: {
  status?: unknown
  startedAt?: unknown
  completedAt?: unknown
}): ProjectDateIssue[]
