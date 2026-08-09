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

const expectedEntriesSha256 =
  '86ae8c3b3c0394afc0297ea3578f3c69f634cde091e13c5711e413d601019850'
const expectedGroups = [
  { name: '커리큘럼', itemCount: 23, weekSequences: [1, 7, 13, 19] },
  { name: 'AI실무기본', itemCount: 23, weekSequences: [24, 39, 45, 46] },
]

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

async function main() {
  const [manifestSource, inventorySource] = await Promise.all([
    readFile(manifestPath, 'utf8'),
    readFile(inventoryPath, 'utf8'),
  ])
  const manifest = JSON.parse(manifestSource)
  const { data, body } = parseContentFile(inventorySource)

  expect(manifest.schemaVersion === 2, 'Unexpected inventory schema version.')
  expect(
    manifest.sourceDescription === '보존된 이어드림스쿨 6기 학습 목차',
    'Unexpected source description.',
  )
  const entriesSha256 = createHash('sha256')
    .update(JSON.stringify(manifest.entries))
    .digest('hex')
  expect(
    manifest.entriesSha256 === expectedEntriesSha256,
    'Unexpected inventory entries SHA-256.',
  )
  expect(
    entriesSha256 === manifest.entriesSha256,
    `Inventory entries SHA-256 mismatch: ${entriesSha256}`,
  )
  expect(manifest.itemCount === 46, 'Manifest itemCount must be 46.')
  expect(manifest.entries.length === 46, 'Manifest must contain 46 entries.')
  expect(
    isDeepStrictEqual(manifest.groups, expectedGroups),
    'Unexpected inventory group metadata.',
  )

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
    data.source?.file === 'docs/legacy-study-inventory.json',
    'Unexpected study source file.',
  )
  expect(
    data.source?.originalLabel === '보존된 이어드림스쿨 6기 학습 목차',
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
  console.log(`- Inventory SHA-256: ${entriesSha256}`)
  console.log('- Missing or duplicate entries: 0')
}

await main()
