import { readdir, readFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { parse } from 'yaml'

const projectRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '..',
)
const collectionRoot = path.join(projectRoot, 'src', 'content')
const collections = ['design', 'projects', 'study', 'posts']

const sourceStatuses = new Set([
  'verified',
  'legacy-placeholder',
  'inventory-only',
])
const studyStatuses = new Set(['inventory-only', 'draft', 'complete'])
const dateFields = {
  design: ['updatedAt'],
  projects: ['updatedAt', 'startedAt', 'completedAt'],
  study: ['updatedAt', 'learnedAt'],
  posts: ['updatedAt', 'publishedAt'],
}

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

function isNonEmpty(value) {
  return typeof value === 'string' && value.trim().length > 0
}

function normalizeId(relativePath, data) {
  const fromPath = relativePath
    .replace(/\\/g, '/')
    .replace(/\.(?:md|mdx)$/i, '')
  const candidate = isNonEmpty(data.slug) ? data.slug : fromPath

  return candidate.replace(/^\/+|\/+$/g, '').toLowerCase()
}

function normalizePublicUrl(value) {
  const [pathname] = value.split(/[?#]/)
  const normalized = `/${pathname.replace(/^\/+|\/+$/g, '')}/`

  return normalized.replace(/\/{2,}/g, '/').toLowerCase()
}

function isValidDate(value) {
  if (value instanceof Date) return !Number.isNaN(value.getTime())
  if (typeof value !== 'string' && typeof value !== 'number') return false

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return false

  if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return date.toISOString().slice(0, 10) === value
  }

  return true
}

function isPlaceholderLink(value) {
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

function imagesFor(collection, data) {
  return [data.cover, ...(collection === 'design' ? (data.gallery ?? []) : [])]
    .filter(Boolean)
    .map((image) => ({ src: image?.src, alt: image?.alt }))
}

function linksFor(collection, data) {
  if (collection === 'design') return [data.externalUrl].filter(Boolean)
  if (collection === 'projects') {
    return [data.repositoryUrl, data.demoUrl].filter(Boolean)
  }
  return []
}

function publicationIssues(collection, data, source) {
  const issues = []
  const sourceStatus = data.sourceStatus ?? 'verified'

  if (data.draft === true) issues.push('draft')
  if (sourceStatus !== 'verified') issues.push('source-not-verified')
  if (!isNonEmpty(data.title)) issues.push('empty-title')
  if (!isNonEmpty(data.description)) issues.push('empty-description')

  if (
    placeholderTextPattern.test(source) ||
    (isNonEmpty(data.title) && /^project\s*\d+$/i.test(data.title))
  ) {
    issues.push('placeholder-text')
  }

  for (const image of imagesFor(collection, data)) {
    if (!isNonEmpty(image.alt)) issues.push('empty-image-alt')
    if (
      isNonEmpty(image.src) &&
      (legacyPlaceholderAssets.has(image.src.toLowerCase()) ||
        v0SampleAssetPattern.test(image.src))
    ) {
      issues.push('placeholder-image')
    }
  }

  for (const link of linksFor(collection, data)) {
    if (!isNonEmpty(link) || isPlaceholderLink(link)) {
      issues.push('placeholder-link')
    }
  }

  for (const field of dateFields[collection]) {
    if (data[field] !== undefined && !isValidDate(data[field])) {
      issues.push(`invalid-date:${field}`)
    }
  }

  if (collection === 'posts' && data.publishedAt === undefined) {
    issues.push('missing-date:publishedAt')
  }
  if (collection === 'study' && data.contentStatus !== 'complete') {
    issues.push('study-not-complete')
  }

  return [...new Set(issues)]
}

function isPublishable(collection, data, source = '') {
  return publicationIssues(collection, data, source).length === 0
}

function parseContentFile(source, relativePath) {
  const frontmatter = source.match(/^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/)
  if (!frontmatter) {
    throw new Error(`${relativePath}: missing YAML frontmatter`)
  }

  const data = parse(frontmatter[1])
  if (!data || typeof data !== 'object' || Array.isArray(data)) {
    throw new Error(`${relativePath}: frontmatter must be an object`)
  }

  return data
}

async function findContentFiles(directory) {
  const files = []
  const entries = await readdir(directory, { withFileTypes: true })

  for (const entry of entries) {
    const absolutePath = path.join(directory, entry.name)
    if (entry.isDirectory()) {
      files.push(...(await findContentFiles(absolutePath)))
    } else if (/\.(?:md|mdx)$/i.test(entry.name)) {
      files.push(absolutePath)
    }
  }

  return files.sort()
}

function runSelfTests() {
  const validProject = {
    title: 'Verified project',
    description: 'A complete project record.',
    draft: false,
    sourceStatus: 'verified',
    stack: ['Astro'],
    repositoryUrl: 'https://github.com/cheezcyj/verified-project',
  }

  const cases = [
    ['valid project', 'projects', validProject, true],
    ['draft project', 'projects', { ...validProject, draft: true }, false],
    [
      'nonverified project',
      'projects',
      { ...validProject, sourceStatus: 'inventory-only' },
      false,
    ],
    [
      'root GitHub link',
      'projects',
      { ...validProject, repositoryUrl: 'https://github.com/' },
      false,
    ],
    [
      'incomplete study',
      'study',
      {
        title: 'Study note',
        description: 'A study inventory item.',
        draft: false,
        sourceStatus: 'verified',
        contentStatus: 'inventory-only',
      },
      false,
    ],
    [
      'complete study',
      'study',
      {
        title: 'Study note',
        description: 'A complete study note.',
        draft: false,
        sourceStatus: 'verified',
        contentStatus: 'complete',
      },
      true,
    ],
  ]

  for (const [name, collection, data, expected] of cases) {
    if (isPublishable(collection, data, JSON.stringify(data)) !== expected) {
      throw new Error(`publication self-test failed: ${name}`)
    }
  }
}

const errors = []
const entries = []
const collectionIds = new Map()
const publicUrls = new Map()
const legacyUrls = new Map()

try {
  runSelfTests()

  for (const collection of collections) {
    const directory = path.join(collectionRoot, collection)
    const files = await findContentFiles(directory)

    for (const absolutePath of files) {
      const relativePath = path.relative(directory, absolutePath)
      const repositoryPath = path.relative(projectRoot, absolutePath)
      const source = await readFile(absolutePath, 'utf8')

      try {
        const data = parseContentFile(source, repositoryPath)
        const id = normalizeId(relativePath, data)
        const idKey = `${collection}:${id}`
        const publicUrl = normalizePublicUrl(`/${collection}/${id}/`)
        const sourceStatus = data.sourceStatus ?? 'verified'

        if (!id) errors.push(`${repositoryPath}: empty collection id`)
        if (collectionIds.has(idKey)) {
          errors.push(
            `${repositoryPath}: duplicate collection id with ${collectionIds.get(idKey)}`,
          )
        } else {
          collectionIds.set(idKey, repositoryPath)
        }

        if (publicUrls.has(publicUrl)) {
          errors.push(
            `${repositoryPath}: duplicate public URL candidate with ${publicUrls.get(publicUrl)}`,
          )
        } else {
          publicUrls.set(publicUrl, repositoryPath)
        }

        if (!sourceStatuses.has(sourceStatus)) {
          errors.push(`${repositoryPath}: invalid sourceStatus ${sourceStatus}`)
        }
        if (collection === 'study' && !studyStatuses.has(data.contentStatus)) {
          errors.push(
            `${repositoryPath}: invalid study contentStatus ${data.contentStatus}`,
          )
        }
        if (!isNonEmpty(data.title))
          errors.push(`${repositoryPath}: empty title`)
        if (!isNonEmpty(data.description)) {
          errors.push(`${repositoryPath}: empty description`)
        }

        for (const image of imagesFor(collection, data)) {
          if (!isNonEmpty(image.alt)) {
            errors.push(`${repositoryPath}: empty image alt`)
          }
          if (
            sourceStatus === 'verified' &&
            isNonEmpty(image.src) &&
            (legacyPlaceholderAssets.has(image.src.toLowerCase()) ||
              v0SampleAssetPattern.test(image.src))
          ) {
            errors.push(
              `${repositoryPath}: verified entry uses a blocked placeholder image`,
            )
          }
        }

        for (const field of dateFields[collection]) {
          if (data[field] !== undefined && !isValidDate(data[field])) {
            errors.push(`${repositoryPath}: invalid date in ${field}`)
          }
        }
        if (collection === 'posts' && data.publishedAt === undefined) {
          errors.push(`${repositoryPath}: missing publishedAt`)
        }

        for (const legacyUrl of data.legacyUrls ?? []) {
          if (!isNonEmpty(legacyUrl)) {
            errors.push(`${repositoryPath}: empty legacyUrl`)
            continue
          }

          const key = legacyUrl.trim().toLowerCase()
          if (legacyUrls.has(key)) {
            errors.push(
              `${repositoryPath}: duplicate legacyUrl with ${legacyUrls.get(key)}`,
            )
          } else {
            legacyUrls.set(key, repositoryPath)
          }

          if (legacyUrl.startsWith('/') && !legacyUrl.includes('#')) {
            const candidate = normalizePublicUrl(legacyUrl)
            if (publicUrls.has(candidate)) {
              errors.push(
                `${repositoryPath}: legacyUrl conflicts with public URL candidate from ${publicUrls.get(candidate)}`,
              )
            } else {
              publicUrls.set(candidate, repositoryPath)
            }
          }
        }

        const issues = publicationIssues(collection, data, source)
        const published = issues.length === 0
        const publicCandidate =
          data.draft !== true &&
          sourceStatus === 'verified' &&
          (collection !== 'study' || data.contentStatus === 'complete')

        if (publicCandidate) {
          for (const issue of issues.filter(
            (issue) =>
              !['draft', 'source-not-verified', 'study-not-complete'].includes(
                issue,
              ),
          )) {
            errors.push(
              `${repositoryPath}: public candidate failed validation (${issue})`,
            )
          }
        }

        if (published && data.draft === true) {
          errors.push(`${repositoryPath}: draft entry reached published query`)
        }
        if (published && sourceStatus !== 'verified') {
          errors.push(
            `${repositoryPath}: nonverified entry reached published query`,
          )
        }
        if (
          published &&
          collection === 'study' &&
          data.contentStatus !== 'complete'
        ) {
          errors.push(
            `${repositoryPath}: incomplete study reached published query`,
          )
        }

        entries.push({ collection, repositoryPath, published })
      } catch (error) {
        errors.push(error instanceof Error ? error.message : String(error))
      }
    }
  }
} catch (error) {
  errors.push(error instanceof Error ? error.message : String(error))
}

if (errors.length > 0) {
  console.error('Content verification failed:')
  for (const error of errors) console.error(`- ${error}`)
  process.exitCode = 1
} else {
  const publishedCount = entries.filter((entry) => entry.published).length
  console.log('Content verification passed.')
  console.log(`- Content entries scanned: ${entries.length}`)
  console.log(`- Published entries: ${publishedCount}`)
  console.log(`- Duplicate collection IDs: 0`)
  console.log(`- Duplicate public URL candidates: 0`)
  console.log(`- Duplicate legacy URLs: 0`)
  console.log(`- Placeholder publication violations: 0`)
  console.log(`- Date errors: 0`)
}
