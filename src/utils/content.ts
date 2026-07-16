import {
  getCollection,
  type CollectionEntry,
  type CollectionKey,
} from 'astro:content'

export type SiteCollection = CollectionKey
export type SiteEntry = CollectionEntry<SiteCollection>

const legacyPlaceholderAssets = new Set([
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

const v0SampleAssetPattern =
  /\/(?:design-(?:analytics-dashboard-dark|aurora-banking-app-dark-ui|creative-studio-landing-page|editorial-magazine-website-layout|skincare-brand-landing-page)|frontend-(?:component-library-storybook|kanban-board-app|weather-dashboard-charts)|placeholder(?:-logo|-user)?|apple-icon|icon(?:-dark-32x32|-light-32x32)?)\.(?:png|jpe?g|svg)$/i

const placeholderTextPattern =
  /(?:lorem ipsum|start bootstrap|hello@choeyoojeong\.dev)/i

function isNonEmpty(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0
}

function isValidDate(value: unknown): value is Date {
  return value instanceof Date && !Number.isNaN(value.getTime())
}

function isPlaceholderLink(value: string): boolean {
  if (value === '#') return true

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

function getImages(entry: SiteEntry): Array<{ src: string; alt: string }> {
  const images: Array<{ src: string; alt: string }> = []

  if (entry.data.cover) images.push(entry.data.cover)
  if (entry.collection === 'design') images.push(...entry.data.gallery)

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

  if (data.draft) issues.push('draft')
  if (data.sourceStatus !== 'verified') issues.push('source-not-verified')

  if (!isNonEmpty(data.title)) issues.push('empty-title')
  if (!isNonEmpty(data.description)) issues.push('empty-description')

  if (
    placeholderTextPattern.test(
      `${data.title} ${data.description} ${entry.body ?? ''}`,
    ) ||
    /^project\s*\d+$/i.test(data.title)
  ) {
    issues.push('placeholder-text')
  }

  for (const image of getImages(entry)) {
    if (!isNonEmpty(image.alt)) issues.push('empty-image-alt')
    if (
      legacyPlaceholderAssets.has(image.src.toLowerCase()) ||
      v0SampleAssetPattern.test(image.src)
    ) {
      issues.push('placeholder-image')
    }
  }

  for (const link of getLinks(entry)) {
    if (isPlaceholderLink(link)) issues.push('placeholder-link')
  }

  if (data.updatedAt && !isValidDate(data.updatedAt)) {
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
      if (entry.data.startedAt && !isValidDate(entry.data.startedAt)) {
        issues.push('invalid-started-date')
      }
      if (entry.data.completedAt && !isValidDate(entry.data.completedAt)) {
        issues.push('invalid-completed-date')
      }
      break
    case 'study':
      if (entry.data.contentStatus !== 'complete') {
        issues.push('study-not-complete')
      }
      if (!isNonEmpty(entry.data.program)) issues.push('empty-program')
      if (entry.data.learnedAt && !isValidDate(entry.data.learnedAt)) {
        issues.push('invalid-learned-date')
      }
      break
    case 'posts':
      if (!isValidDate(entry.data.publishedAt)) {
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
