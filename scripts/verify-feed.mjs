import { readFile, readdir } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { XMLParser, XMLValidator } from 'fast-xml-parser'
import { parse } from 'yaml'
import {
  isPlaceholderLink,
  isPlaceholderText,
} from '../src/config/content-policy.mjs'
import { siteConfig } from '../src/config/site.ts'

const projectRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '..',
)
const distRoot = path.join(projectRoot, 'dist')
const feedPath = path.join(distRoot, 'feed.xml')
const projectDistRoot = path.join(distRoot, 'projects')
const roadscannerPath = path.join(
  projectRoot,
  'src',
  'content',
  'projects',
  'roadscanner.md',
)

const errors = []

function expect(condition, message) {
  if (!condition) errors.push(message)
}

function asArray(value) {
  if (value === undefined) return []
  return Array.isArray(value) ? value : [value]
}

function parseFrontmatter(source, repositoryPath) {
  const frontmatter = source.match(/^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/)
  if (!frontmatter) throw new Error(`${repositoryPath}: missing frontmatter`)

  const data = parse(frontmatter[1])
  if (!data || typeof data !== 'object' || Array.isArray(data)) {
    throw new Error(`${repositoryPath}: frontmatter must be an object`)
  }

  return data
}

async function findProjectDetailRoutes(directory, relativeDirectory = '') {
  const routes = []
  const entries = await readdir(directory, { withFileTypes: true })

  for (const entry of entries) {
    if (!entry.isDirectory()) continue

    const childRelativeDirectory = path.posix.join(
      relativeDirectory,
      entry.name,
    )
    const childDirectory = path.join(directory, entry.name)
    const childEntries = await readdir(childDirectory, { withFileTypes: true })

    if (
      childEntries.some(
        (child) => child.isFile() && child.name === 'index.html',
      )
    ) {
      routes.push(
        new URL(`/projects/${childRelativeDirectory}/`, siteConfig.url).href,
      )
    }

    routes.push(
      ...(await findProjectDetailRoutes(
        childDirectory,
        childRelativeDirectory,
      )),
    )
  }

  return routes.sort()
}

async function main() {
  const [xml, roadscannerSource] = await Promise.all([
    readFile(feedPath, 'utf8'),
    readFile(roadscannerPath, 'utf8'),
  ])
  const roadscanner = parseFrontmatter(
    roadscannerSource,
    'src/content/projects/roadscanner.md',
  )

  expect(
    !/<!DOCTYPE|<!ENTITY/iu.test(xml),
    'RSS cannot contain a DTD or entity.',
  )
  const validation = XMLValidator.validate(xml)
  expect(
    validation === true,
    `RSS XML validation failed: ${JSON.stringify(validation)}`,
  )

  const parser = new XMLParser({
    ignoreAttributes: false,
    parseAttributeValue: false,
    parseTagValue: false,
    trimValues: true,
    maxNestedTags: 32,
  })
  const parsed = parser.parse(xml)
  const channel = parsed.rss?.channel
  const items = asArray(channel?.item)

  expect(parsed.rss?.['@_version'] === '2.0', 'RSS version must be 2.0.')
  expect(
    channel?.title === 'CHOE YOOJEONG — Portfolio Updates',
    'Unexpected RSS channel title.',
  )
  expect(
    channel?.description === siteConfig.description,
    'RSS description must match siteConfig.description.',
  )
  expect(channel?.language === 'ko-KR', 'RSS language must be ko-KR.')
  expect(
    channel?.link === `${siteConfig.url}/`,
    'RSS channel link must match the production site URL.',
  )
  expect(items.length === 1, `Expected one RSS item, got ${items.length}.`)

  const roadscannerItem = items.find((item) => item.title === roadscanner.title)
  const expectedLink = `${siteConfig.url}/projects/roadscanner/`
  const expectedPubDate = new Date(
    roadscanner.completedAt ?? roadscanner.startedAt ?? roadscanner.updatedAt,
  )

  expect(roadscannerItem, 'RoadScanner RSS item is missing.')
  expect(
    roadscannerItem?.description === roadscanner.description,
    'RoadScanner RSS description mismatch.',
  )
  expect(
    roadscannerItem?.link === expectedLink,
    'RoadScanner RSS link mismatch.',
  )
  expect(
    !Number.isNaN(Date.parse(roadscannerItem?.pubDate ?? '')),
    'RoadScanner pubDate must be valid.',
  )
  expect(
    roadscannerItem?.pubDate === expectedPubDate.toUTCString(),
    'RoadScanner pubDate does not use the expected project date.',
  )

  const categories = asArray(roadscannerItem?.category).sort()
  const expectedCategories = [...roadscanner.tags].sort()
  expect(
    JSON.stringify(categories) === JSON.stringify(expectedCategories),
    'RoadScanner RSS categories do not match project tags.',
  )

  const itemLinks = items.map((item) => item.link)
  expect(
    new Set(itemLinks).size === itemLinks.length,
    'RSS contains duplicate item links.',
  )
  for (const link of [channel?.link, ...itemLinks]) {
    expect(!isPlaceholderLink(link), `RSS contains an invalid link: ${link}`)
    expect(
      typeof link === 'string' && link.startsWith(`${siteConfig.url}/`),
      `RSS link is outside the production site: ${link}`,
    )
  }

  const projectRoutes = await findProjectDetailRoutes(projectDistRoot)
  expect(
    JSON.stringify([...itemLinks].sort()) === JSON.stringify(projectRoutes),
    `RSS links and generated project routes differ: ${JSON.stringify({ itemLinks, projectRoutes })}`,
  )

  expect(
    !xml.includes('CHEEZCYJ Portfolio Redesign'),
    'Draft project leaked into RSS.',
  )
  expect(
    !xml.includes('이어드림스쿨 6기 학습 목차 인벤토리'),
    'Study inventory leaked into RSS.',
  )
  expect(
    !/\{[{%]|[%}]\}|site\.posts|jekyll/iu.test(xml),
    'Jekyll Liquid leaked into RSS.',
  )
  expect(!/localhost/iu.test(xml), 'RSS contains localhost.')
  expect(!/file:\/\//iu.test(xml), 'RSS contains a file URL.')
  expect(!/[A-Z]:[\\/]/u.test(xml), 'RSS contains a local absolute path.')
  expect(!isPlaceholderText(xml), 'RSS contains placeholder text.')

  const homeHtml = await readFile(path.join(distRoot, 'index.html'), 'utf8')
  expect(
    /<link\s+rel="alternate"\s+type="application\/rss\+xml"\s+title="CHOE YOOJEONG — Portfolio Updates"\s+href="\/feed\.xml"\s*\/?>/u.test(
      homeHtml,
    ),
    'RSS discovery link is missing from the built home page.',
  )

  if (errors.length > 0) {
    console.error('RSS feed verification failed:')
    for (const error of errors) console.error(`- ${error}`)
    process.exitCode = 1
    return
  }

  console.log('RSS feed verification passed.')
  console.log(`- Feed: ${path.relative(projectRoot, feedPath)}`)
  console.log(`- Items: ${items.length}`)
  console.log(`- Project routes matched: ${projectRoutes.length}`)
  console.log('- Included: RoadScanner')
  console.log('- Excluded: draft project and study inventory')
  console.log('- Invalid, duplicate, placeholder, or local links: 0')
}

await main()
