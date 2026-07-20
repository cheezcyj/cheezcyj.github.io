import {
  getCollection,
  type CollectionEntry,
  type CollectionKey,
} from 'astro:content'
import {
  getProjectDateIssues,
  getProjectMediaIssues,
  isPlaceholderAsset,
  isPlaceholderLink,
  isPlaceholderText,
  isValidDateValue,
  isValidLegacyUrl,
  isValidRootRelativeAssetPath,
} from '../config/content-policy.mjs'

export type SiteCollection = CollectionKey
export type SiteEntry = CollectionEntry<SiteCollection>

function isNonEmpty(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0
}

function getImages(entry: SiteEntry): Array<{ src: string; alt: string }> {
  const images: Array<{ src: string; alt: string }> = []

  if (entry.data.cover) images.push(entry.data.cover)
  if (entry.collection === 'design' || entry.collection === 'projects') {
    images.push(...entry.data.gallery)
  }

  return images
}

function getLinks(entry: SiteEntry): string[] {
  if (entry.collection === 'design') {
    return entry.data.externalUrl ? [entry.data.externalUrl] : []
  }

  if (entry.collection === 'projects') {
    return [entry.data.repositoryUrl, entry.data.demoUrl].filter(isNonEmpty)
  }

  return []
}

export function getPublicationIssues(entry: SiteEntry): string[] {
  const issues: string[] = []
  const { data } = entry

  if (data.draft !== false) issues.push('draft-not-explicitly-false')
  if (data.sourceStatus !== 'verified') issues.push('source-not-verified')

  if (!isNonEmpty(data.title)) issues.push('empty-title')
  if (!isNonEmpty(data.description)) issues.push('empty-description')

  if (
    isPlaceholderText(
      `${data.title} ${data.description} ${entry.body ?? ''}`,
    ) ||
    isPlaceholderText(data.title)
  ) {
    issues.push('placeholder-text')
  }

  for (const image of getImages(entry)) {
    if (!isNonEmpty(image.alt)) issues.push('empty-image-alt')
    if (
      entry.collection !== 'projects' &&
      !isValidRootRelativeAssetPath(image.src)
    ) {
      issues.push('invalid-media-src')
    }
    if (isPlaceholderAsset(image.src)) {
      issues.push('placeholder-image')
    }
  }

  for (const link of getLinks(entry)) {
    if (isPlaceholderLink(link)) issues.push('placeholder-link')
  }

  for (const legacyUrl of data.legacyUrls) {
    if (!isValidLegacyUrl(legacyUrl)) issues.push('invalid-legacy-url')
  }

  if (data.updatedAt && !isValidDateValue(data.updatedAt)) {
    issues.push('invalid-updated-date')
  }

  switch (entry.collection) {
    case 'design':
      if (!Number.isInteger(entry.data.year)) issues.push('invalid-year')
      if (entry.data.disciplines.length === 0) {
        issues.push('empty-disciplines')
      }
      break
    case 'projects':
      if (entry.data.stack.length === 0) issues.push('empty-stack')
      if (entry.data.startedAt && !isValidDateValue(entry.data.startedAt)) {
        issues.push('invalid-started-date')
      }
      if (entry.data.completedAt && !isValidDateValue(entry.data.completedAt)) {
        issues.push('invalid-completed-date')
      }
      issues.push(...getProjectDateIssues(entry.data))
      issues.push(
        ...getProjectMediaIssues(entry.data).map((issue) => issue.code),
      )
      break
    case 'study':
      if (entry.data.contentStatus !== 'complete') {
        issues.push('study-not-complete')
      }
      if (!isNonEmpty(entry.data.program)) issues.push('empty-program')
      if (entry.data.learnedAt && !isValidDateValue(entry.data.learnedAt)) {
        issues.push('invalid-learned-date')
      }
      break
    case 'posts':
      if (!isValidDateValue(entry.data.publishedAt)) {
        issues.push('invalid-published-date')
      }
      if (entry.data.authors.length === 0) issues.push('empty-authors')
      break
  }

  return [...new Set(issues)]
}

export function isPublishableEntry(entry: SiteEntry): boolean {
  return getPublicationIssues(entry).length === 0
}

function relevantDate(entry: SiteEntry): number {
  switch (entry.collection) {
    case 'design':
      return Date.UTC(entry.data.year, 0, 1)
    case 'projects':
      return (
        entry.data.completedAt?.getTime() ??
        entry.data.startedAt?.getTime() ??
        entry.data.updatedAt?.getTime() ??
        0
      )
    case 'study':
      return (
        entry.data.learnedAt?.getTime() ?? entry.data.updatedAt?.getTime() ?? 0
      )
    case 'posts':
      return entry.data.publishedAt.getTime()
  }
}

export function sortEntries<T extends SiteEntry>(entries: readonly T[]): T[] {
  return [...entries].sort((left, right) => {
    const leftHasOrder = left.data.order !== undefined
    const rightHasOrder = right.data.order !== undefined

    if (leftHasOrder !== rightHasOrder) return leftHasOrder ? -1 : 1
    if (leftHasOrder && rightHasOrder && left.data.order !== right.data.order) {
      return left.data.order! - right.data.order!
    }

    const dateDifference = relevantDate(right) - relevantDate(left)
    if (dateDifference !== 0) return dateDifference

    const titleDifference = left.data.title.localeCompare(
      right.data.title,
      'ko-KR',
      { sensitivity: 'base' },
    )

    return titleDifference || left.id.localeCompare(right.id)
  })
}

export async function getPublishedEntries<C extends SiteCollection>(
  collection: C,
): Promise<Array<CollectionEntry<C>>> {
  const entries = await getCollection(collection)
  const published = entries.filter((entry) => isPublishableEntry(entry))

  return sortEntries(published) as Array<CollectionEntry<C>>
}

export async function getFeaturedEntries<C extends SiteCollection>(
  collection: C,
): Promise<Array<CollectionEntry<C>>> {
  const entries = await getPublishedEntries(collection)

  return entries.filter((entry) => entry.data.featured)
}
