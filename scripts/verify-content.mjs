import { readdir, readFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { parse } from 'yaml'
import {
  getProjectDateIssues,
  isPlaceholderAsset,
  isPlaceholderLink,
  isPlaceholderText,
  isValidDateValue,
  isValidLegacyUrl,
  normalizeLegacyUrl,
} from '../src/config/content-policy.mjs'

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

function isNonEmpty(value) {
  return typeof value === 'string' && value.trim().length > 0
}

function normalizeId(relativePath) {
  return relativePath
    .replace(/\\/g, '/')
    .replace(/\.(?:md|mdx)$/i, '')
    .replace(/^\/+|\/+$/g, '')
}

function normalizePublicUrl(value) {
  const [pathname] = value.split(/[?#]/)
  const normalized = `/${pathname.replace(/^\/+|\/+$/g, '')}/`

  return normalized.replace(/\/{2,}/g, '/').toLowerCase()
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

  if (data.draft === undefined) issues.push('missing-draft')
  else if (data.draft !== false) issues.push('draft-not-explicitly-false')

  if (data.sourceStatus === undefined) issues.push('missing-sourceStatus')
  else if (data.sourceStatus !== 'verified') {
    issues.push('source-not-verified')
  }

  if (!isNonEmpty(data.title)) issues.push('empty-title')
  if (!isNonEmpty(data.description)) issues.push('empty-description')

  if (
    isPlaceholderText(source) ||
    (isNonEmpty(data.title) && isPlaceholderText(data.title))
  ) {
    issues.push('placeholder-text')
  }

  for (const image of imagesFor(collection, data)) {
    if (!isNonEmpty(image.alt)) issues.push('empty-image-alt')
    if (isNonEmpty(image.src) && isPlaceholderAsset(image.src)) {
      issues.push('placeholder-image')
    }
  }

  for (const link of linksFor(collection, data)) {
    if (!isNonEmpty(link) || isPlaceholderLink(link)) {
      issues.push('placeholder-link')
    }
  }

  for (const field of dateFields[collection]) {
    if (data[field] !== undefined && !isValidDateValue(data[field])) {
      issues.push(`invalid-date:${field}`)
    }
  }

  if (Array.isArray(data.legacyUrls)) {
    for (const legacyUrl of data.legacyUrls) {
      if (!isValidLegacyUrl(legacyUrl)) issues.push('invalid-legacy-url')
    }
  } else if (data.legacyUrls !== undefined) {
    issues.push('invalid-legacy-urls')
  }

  if (collection === 'posts' && data.publishedAt === undefined) {
    issues.push('missing-date:publishedAt')
  }
  if (collection === 'study' && data.contentStatus !== 'complete') {
    issues.push('study-not-complete')
  }
  if (collection === 'projects') {
    issues.push(...getProjectDateIssues(data))
  }

  return [...new Set(issues)]
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
    status: 'completed',
    startedAt: '2026-01-01',
    completedAt: '2026-02-01',
    stack: ['Astro'],
    repositoryUrl: 'https://github.com/cheezcyj/verified-project',
  }

  const cases = [
    ['valid project', 'projects', validProject, true, undefined],
    [
      'draft project',
      'projects',
      { ...validProject, draft: true },
      false,
      'draft-not-explicitly-false',
    ],
    [
      'missing draft',
      'projects',
      { ...validProject, draft: undefined },
      false,
      'missing-draft',
    ],
    [
      'missing sourceStatus',
      'projects',
      { ...validProject, sourceStatus: undefined },
      false,
      'missing-sourceStatus',
    ],
    [
      'root GitHub link',
      'projects',
      { ...validProject, repositoryUrl: 'https://github.com/' },
      false,
      'placeholder-link',
    ],
    [
      'completed without completedAt',
      'projects',
      { ...validProject, completedAt: undefined },
      false,
      'completed-missing-completedAt',
    ],
    [
      'completedAt before startedAt',
      'projects',
      { ...validProject, completedAt: '2025-12-31' },
      false,
      'completed-before-started',
    ],
    [
      'planned with completedAt',
      'projects',
      { ...validProject, status: 'planned' },
      false,
      'planned-has-completedAt',
    ],
    [
      'invalid legacyUrl',
      'projects',
      { ...validProject, legacyUrls: ['javascript:alert(1)'] },
      false,
      'invalid-legacy-url',
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
      'study-not-complete',
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
      undefined,
    ],
  ]

  for (const [name, collection, data, expected, expectedIssue] of cases) {
    const issues = publicationIssues(collection, data, JSON.stringify(data))
    if ((issues.length === 0) !== expected) {
      throw new Error(`publication self-test failed: ${name}`)
    }
    if (expectedIssue && !issues.includes(expectedIssue)) {
      throw new Error(`publication self-test missed ${expectedIssue}: ${name}`)
    }
  }

  if (normalizeId('nested/Entry.mdx') !== 'nested/Entry') {
    throw new Error('collection id self-test failed: path-based canonical id')
  }

  for (const value of ['/legacy/path/', '#legacy-section']) {
    if (!isValidLegacyUrl(value)) {
      throw new Error(`legacy URL self-test rejected valid value: ${value}`)
    }
  }

  for (const value of [
    '',
    'https://example.com/legacy',
    'javascript:alert(1)',
    '//example.com/legacy',
    '/legacy path',
    '#',
  ]) {
    if (isValidLegacyUrl(value)) {
      throw new Error(`legacy URL self-test accepted invalid value: ${value}`)
    }
  }

  if (
    normalizeLegacyUrl('/Legacy/Path/') !== normalizeLegacyUrl('/legacy/path')
  ) {
    throw new Error('legacy URL self-test failed: normalized duplicate key')
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
        const id = normalizeId(relativePath)
        const idKey = `${collection}:${id.toLowerCase()}`
        const publicUrl = normalizePublicUrl(`/${collection}/${id}/`)
        const sourceStatus = data.sourceStatus

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

        if (!Object.hasOwn(data, 'draft')) {
          errors.push(`${repositoryPath}: missing required draft`)
        } else if (typeof data.draft !== 'boolean') {
          errors.push(`${repositoryPath}: draft must be a boolean`)
        }

        if (!Object.hasOwn(data, 'sourceStatus')) {
          errors.push(`${repositoryPath}: missing required sourceStatus`)
        } else if (!sourceStatuses.has(sourceStatus)) {
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
            isPlaceholderAsset(image.src)
          ) {
            errors.push(
              `${repositoryPath}: verified entry uses a blocked placeholder image`,
            )
          }
        }

        for (const field of dateFields[collection]) {
          if (data[field] !== undefined && !isValidDateValue(data[field])) {
            errors.push(`${repositoryPath}: invalid date in ${field}`)
          }
        }
        if (collection === 'posts' && data.publishedAt === undefined) {
          errors.push(`${repositoryPath}: missing publishedAt`)
        }

        if (collection === 'projects') {
          for (const issue of getProjectDateIssues(data)) {
            errors.push(`${repositoryPath}: invalid project dates (${issue})`)
          }
        }

        const entryLegacyUrls = data.legacyUrls ?? []
        if (!Array.isArray(entryLegacyUrls)) {
          errors.push(`${repositoryPath}: legacyUrls must be an array`)
        } else {
          for (const legacyUrl of entryLegacyUrls) {
            if (!isValidLegacyUrl(legacyUrl)) {
              errors.push(`${repositoryPath}: invalid legacyUrl ${legacyUrl}`)
              continue
            }

            const key = normalizeLegacyUrl(legacyUrl)
            if (legacyUrls.has(key)) {
              errors.push(
                `${repositoryPath}: duplicate legacyUrl with ${legacyUrls.get(key)}`,
              )
            } else {
              legacyUrls.set(key, repositoryPath)
            }

            if (legacyUrl.startsWith('/')) {
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
        }

        const issues = publicationIssues(collection, data, source)
        const published = issues.length === 0
        const publicCandidate =
          data.draft === false &&
          sourceStatus === 'verified' &&
          (collection !== 'study' || data.contentStatus === 'complete')

        if (publicCandidate) {
          for (const issue of issues.filter(
            (issue) =>
              ![
                'draft-not-explicitly-false',
                'missing-draft',
                'source-not-verified',
                'missing-sourceStatus',
                'study-not-complete',
              ].includes(issue),
          )) {
            errors.push(
              `${repositoryPath}: public candidate failed validation (${issue})`,
            )
          }
        }

        if (published && data.draft !== false) {
          errors.push(
            `${repositoryPath}: entry without explicit draft false reached published query`,
          )
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
