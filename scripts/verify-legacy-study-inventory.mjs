import { execFileSync } from 'node:child_process'
import { createHash } from 'node:crypto'
import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { isDeepStrictEqual } from 'node:util'
import { parse } from 'yaml'

const projectRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '..',
)
const manifestPath = path.join(
  projectRoot,
  'docs',
  'legacy-study-inventory.json',
)
const inventoryPath = path.join(
  projectRoot,
  'src',
  'content',
  'study',
  'yeardream-school-6-inventory.md',
)

const expectedSource = {
  ref: 'origin/legacy-jekyll',
  commit: '63b397e42164bac6d50149c14b7901da5a67e42d',
  path: '_includes/modals.html',
  blobSha: 'bb232b80eeb02ca9b6017da9fd954fd4c25c1d9c',
  contentSha256:
    'c34ddf32262b1e92f8dfad8998ec35c4011554ae38488bd7cc312570950263cd',
  byteLength: 15664,
}

const errors = []

function expect(condition, message) {
  if (!condition) errors.push(message)
}

function parseContentFile(source) {
  const frontmatter = source.match(/^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/)
  if (!frontmatter) throw new Error('Study inventory has no YAML frontmatter.')

  const data = parse(frontmatter[1])
  if (!data || typeof data !== 'object' || Array.isArray(data)) {
    throw new Error('Study inventory frontmatter must be an object.')
  }

  return { data, body: source.slice(frontmatter[0].length) }
}

function parseMarkdownEntries(body) {
  const entries = []
  const rowPattern =
    /^\|\s*(\d+)\s*\|\s*`(week|topic|item)`\s*\|\s*(—|\d+)\s*\|\s*`([^`]*)`\s*\|\s*`([^`]*)`\s*\|\s*`([^`]*)`\s*\|\s*$/gmu

  for (const match of body.matchAll(rowPattern)) {
    entries.push({
      sequence: Number(match[1]),
      kind: match[2],
      parentSequence: match[3] === '—' ? null : Number(match[3]),
      displayTitle: match[4],
      dataTitle: match[5],
      dataWeek: match[6],
    })
  }

  return entries
}

function attributeValue(attributes, name) {
  return attributes.match(new RegExp(`\\b${name}="([^"]*)"`))?.[1]
}

function parseLegacyEntries(source) {
  const entries = []
  const anchorPattern = /<a\b([^>]*)>([^<]+)<\/a>/gu
  let currentWeek = null
  let currentTopic = null
  let group = null

  for (const match of source.matchAll(anchorPattern)) {
    const attributes = match[1]
    const classes = attributeValue(attributes, 'class')?.split(/\s+/u) ?? []
    if (!classes.includes('yeardream-menu-link')) continue

    const sequence = entries.length + 1
    const displayTitle = match[2]
    const dataTitle = attributeValue(attributes, 'data-title')
    const dataWeek = attributeValue(attributes, 'data-week')
    const dataSummary = attributeValue(attributes, 'data-summary')
    let kind
    let parentSequence

    if (classes.includes('yeardream-menu-week')) {
      kind = 'week'
      parentSequence = null
      group = dataWeek
      currentWeek = sequence
      currentTopic = null
    } else if (classes.includes('yeardream-menu-topic')) {
      kind = 'topic'
      parentSequence = currentWeek
      currentTopic = sequence
    } else {
      kind = 'item'
      parentSequence = dataWeek?.includes(' / ') ? currentTopic : currentWeek
    }

    const entry = {
      sequence,
      kind,
      group,
      parentSequence,
      displayTitle,
      dataTitle,
      dataWeek,
    }
    if (dataSummary !== undefined) entry.dataSummary = dataSummary
    entries.push(entry)
  }

  return entries
}

function runGit(args, { optional = false, encoding = 'utf8' } = {}) {
  try {
    return execFileSync('git', args, {
      cwd: projectRoot,
      encoding,
      maxBuffer: 2 * 1024 * 1024,
      stdio: ['ignore', 'pipe', 'pipe'],
    })
  } catch (error) {
    if (optional && typeof error.status === 'number') return null
    throw error
  }
}

function verifyLocalLegacySource(manifest) {
  const commit = runGit(
    ['rev-parse', '--verify', `${manifest.sourceRef}^{commit}`],
    { optional: true },
  )

  if (commit === null) {
    console.log(
      `- Local source comparison: skipped (${manifest.sourceRef} is not available)`,
    )
    return
  }

  const normalizedCommit = commit.trim()
  expect(
    normalizedCommit === manifest.sourceCommit,
    `Local source commit mismatch: ${normalizedCommit}`,
  )

  const objectSpec = `${manifest.sourceRef}:${manifest.sourcePath}`
  const blobSha = runGit(['rev-parse', objectSpec]).trim()
  const sourceBuffer = runGit(['cat-file', 'blob', objectSpec], {
    encoding: null,
  })
  const sourceSha256 = createHash('sha256').update(sourceBuffer).digest('hex')

  expect(blobSha === manifest.sourceBlobSha, `Source blob mismatch: ${blobSha}`)
  expect(
    sourceBuffer.length === manifest.sourceByteLength,
    `Source byte length mismatch: ${sourceBuffer.length}`,
  )
  expect(
    sourceSha256 === manifest.sourceContentSha256,
    `Source SHA-256 mismatch: ${sourceSha256}`,
  )

  const legacyEntries = parseLegacyEntries(sourceBuffer.toString('utf8'))
  expect(
    isDeepStrictEqual(legacyEntries, manifest.entries),
    'Legacy source entries do not match the tracked manifest.',
  )
  console.log(
    `- Local source comparison: ${legacyEntries.length} entries match`,
  )
}

async function main() {
  const [manifestSource, inventorySource] = await Promise.all([
    readFile(manifestPath, 'utf8'),
    readFile(inventoryPath, 'utf8'),
  ])
  const manifest = JSON.parse(manifestSource)
  const { data, body } = parseContentFile(inventorySource)

  expect(manifest.sourceRef === expectedSource.ref, 'Unexpected source ref.')
  expect(
    manifest.sourceCommit === expectedSource.commit,
    'Unexpected source commit.',
  )
  expect(manifest.sourcePath === expectedSource.path, 'Unexpected source path.')
  expect(
    manifest.sourceBlobSha === expectedSource.blobSha,
    'Unexpected source blob SHA.',
  )
  expect(
    manifest.sourceContentSha256 === expectedSource.contentSha256,
    'Unexpected source content SHA-256.',
  )
  expect(
    manifest.sourceByteLength === expectedSource.byteLength,
    'Unexpected source byte length.',
  )
  expect(manifest.itemCount === 46, 'Manifest itemCount must be 46.')
  expect(manifest.entries.length === 46, 'Manifest must contain 46 entries.')

  const kindCounts = { week: 0, topic: 0, item: 0 }
  const groupCounts = new Map()
  const dataTitles = new Set()
  const compositeKeys = new Set()

  for (const [index, entry] of manifest.entries.entries()) {
    const expectedSequence = index + 1
    expect(
      entry.sequence === expectedSequence,
      `Non-contiguous sequence at ${expectedSequence}.`,
    )
    expect(entry.kind in kindCounts, `Invalid kind at ${entry.sequence}.`)
    if (entry.kind in kindCounts) kindCounts[entry.kind] += 1
    groupCounts.set(entry.group, (groupCounts.get(entry.group) ?? 0) + 1)
    expect(
      entry.displayTitle?.trim(),
      `Empty displayTitle at ${entry.sequence}.`,
    )
    expect(entry.dataTitle?.trim(), `Empty dataTitle at ${entry.sequence}.`)
    expect(entry.dataWeek?.trim(), `Empty dataWeek at ${entry.sequence}.`)
    expect(
      entry.displayTitle === entry.dataTitle,
      `Display/data title mismatch at ${entry.sequence}.`,
    )
    expect(
      !dataTitles.has(entry.dataTitle),
      `Duplicate dataTitle: ${entry.dataTitle}`,
    )
    dataTitles.add(entry.dataTitle)

    const compositeKey = `${entry.dataWeek}\u0000${entry.dataTitle}`
    expect(
      !compositeKeys.has(compositeKey),
      `Duplicate dataWeek/dataTitle pair at ${entry.sequence}.`,
    )
    compositeKeys.add(compositeKey)

    if (entry.kind === 'week') {
      expect(
        entry.parentSequence === null,
        `Week ${entry.sequence} cannot have a parent.`,
      )
    } else {
      const parent = manifest.entries[entry.parentSequence - 1]
      expect(
        Number.isInteger(entry.parentSequence) &&
          entry.parentSequence > 0 &&
          entry.parentSequence < entry.sequence,
        `Invalid parent sequence at ${entry.sequence}.`,
      )
      expect(
        parent?.group === entry.group,
        `Parent group mismatch at ${entry.sequence}.`,
      )
      if (entry.kind === 'topic') {
        expect(
          parent?.kind === 'week',
          `Topic ${entry.sequence} needs a week parent.`,
        )
      } else {
        expect(
          parent?.kind === 'week' || parent?.kind === 'topic',
          `Item ${entry.sequence} needs a week or topic parent.`,
        )
      }
    }
  }

  expect(
    kindCounts.week === 8,
    `Expected 8 week entries, got ${kindCounts.week}.`,
  )
  expect(
    kindCounts.topic === 10,
    `Expected 10 topic entries, got ${kindCounts.topic}.`,
  )
  expect(kindCounts.item === 28, `Expected 28 items, got ${kindCounts.item}.`)
  expect(
    groupCounts.get('커리큘럼') === 23,
    'Curriculum group must contain 23 entries.',
  )
  expect(
    groupCounts.get('AI실무기본') === 23,
    'AI practical basics group must contain 23 entries.',
  )

  const markdownEntries = parseMarkdownEntries(body)
  const manifestMarkdownEntries = manifest.entries.map(
    ({
      sequence,
      kind,
      parentSequence,
      displayTitle,
      dataTitle,
      dataWeek,
    }) => ({
      sequence,
      kind,
      parentSequence,
      displayTitle,
      dataTitle,
      dataWeek,
    }),
  )
  expect(
    isDeepStrictEqual(markdownEntries, manifestMarkdownEntries),
    'Markdown inventory rows do not match the manifest.',
  )

  expect(data.draft === true, 'Study inventory must remain draft.')
  expect(data.featured === false, 'Study inventory cannot be featured.')
  expect(
    data.sourceStatus === 'inventory-only',
    'Study inventory sourceStatus must be inventory-only.',
  )
  expect(
    data.contentStatus === 'inventory-only',
    'Study inventory contentStatus must be inventory-only.',
  )
  expect(data.sequence === 0, 'Study inventory sequence must be 0.')
  expect(data.program === '이어드림스쿨 6기', 'Unexpected study program.')
  expect(
    data.source?.file === 'origin/legacy-jekyll:_includes/modals.html',
    'Unexpected study source file.',
  )
  expect(
    data.source?.originalLabel === 'Legacy Jekyll curriculum navigation',
    'Unexpected original source label.',
  )
  for (const field of [
    'cover',
    'learnedAt',
    'track',
    'phase',
    'week',
    'module',
  ]) {
    expect(
      !Object.hasOwn(data, field),
      `Study inventory cannot define ${field}.`,
    )
  }

  verifyLocalLegacySource(manifest)

  if (errors.length > 0) {
    console.error('Legacy study inventory verification failed:')
    for (const error of errors) console.error(`- ${error}`)
    process.exitCode = 1
    return
  }

  console.log('Legacy study inventory verification passed.')
  console.log(`- Entries: ${manifest.entries.length}`)
  console.log(
    `- Kinds: week ${kindCounts.week}, topic ${kindCounts.topic}, item ${kindCounts.item}`,
  )
  console.log('- Groups: curriculum 23, AI practical basics 23')
  console.log('- Publication gates: draft, inventory-only source and content')
  console.log('- Missing or duplicate entries: 0')
}

await main()
