import { createHash } from 'node:crypto'
import { readFile, readdir, stat } from 'node:fs/promises'
import { extname, resolve, relative, sep } from 'node:path'
import { fileURLToPath } from 'node:url'

const repositoryRoot = resolve(fileURLToPath(new URL('..', import.meta.url)))
const manifestPath = resolve(
  repositoryRoot,
  'docs/asset-migration-manifest.json',
)
const publicRoot = resolve(repositoryRoot, 'public')
const v0PublicRoot = resolve(repositoryRoot, '../cheezcyj-blog-redesign/public')

const requiredFields = [
  'sourcePath',
  'publicPath',
  'publicUrl',
  'sha256',
  'sizeBytes',
  'mimeType',
  'width',
  'height',
  'sourceStatus',
  'currentlyReferenced',
  'safeToDisplay',
  'notes',
]

const allowedStatuses = new Set([
  'verified-user-asset',
  'legacy-template-placeholder',
  'v0-sample-placeholder',
  'documentation-baseline',
  'pending-owner-review',
  'approved-brand-asset',
])

const imageExtensions = new Set([
  '.avif',
  '.gif',
  '.ico',
  '.jpeg',
  '.jpg',
  '.png',
  '.svg',
  '.webp',
])

function fail(message) {
  throw new Error(message)
}

function assert(condition, message) {
  if (!condition) fail(message)
}

function toPosixPath(value) {
  return value.split(sep).join('/')
}

function sha256(buffer) {
  return createHash('sha256').update(buffer).digest('hex')
}

function readJpegSize(buffer) {
  let offset = 2

  while (offset + 9 < buffer.length) {
    if (buffer[offset] !== 0xff) {
      offset += 1
      continue
    }

    const marker = buffer[offset + 1]
    const segmentLength = buffer.readUInt16BE(offset + 2)
    const isStartOfFrame =
      (marker >= 0xc0 && marker <= 0xc3) ||
      (marker >= 0xc5 && marker <= 0xc7) ||
      (marker >= 0xc9 && marker <= 0xcb) ||
      (marker >= 0xcd && marker <= 0xcf)

    if (isStartOfFrame) {
      return {
        width: buffer.readUInt16BE(offset + 7),
        height: buffer.readUInt16BE(offset + 5),
      }
    }

    if (segmentLength < 2) break
    offset += 2 + segmentLength
  }

  fail('JPEG dimensions could not be read')
}

function readWebpSize(buffer) {
  const chunk = buffer.toString('ascii', 12, 16)

  if (chunk === 'VP8X') {
    return {
      width: 1 + buffer.readUIntLE(24, 3),
      height: 1 + buffer.readUIntLE(27, 3),
    }
  }

  if (chunk === 'VP8 ') {
    return {
      width: buffer.readUInt16LE(26) & 0x3fff,
      height: buffer.readUInt16LE(28) & 0x3fff,
    }
  }

  if (chunk === 'VP8L') {
    const bits = buffer.readUInt32LE(21)
    return {
      width: 1 + (bits & 0x3fff),
      height: 1 + ((bits >> 14) & 0x3fff),
    }
  }

  fail('WEBP dimensions could not be read')
}

function inspectImage(buffer, sourcePath) {
  if (
    buffer.length >= 24 &&
    buffer.subarray(0, 8).equals(Buffer.from('89504e470d0a1a0a', 'hex'))
  ) {
    return {
      mimeType: 'image/png',
      width: buffer.readUInt32BE(16),
      height: buffer.readUInt32BE(20),
    }
  }

  if (buffer.length >= 4 && buffer[0] === 0xff && buffer[1] === 0xd8) {
    return { mimeType: 'image/jpeg', ...readJpegSize(buffer) }
  }

  const signature = buffer.toString('ascii', 0, 6)
  if (signature === 'GIF87a' || signature === 'GIF89a') {
    return {
      mimeType: 'image/gif',
      width: buffer.readUInt16LE(6),
      height: buffer.readUInt16LE(8),
    }
  }

  if (
    buffer.length >= 30 &&
    buffer.toString('ascii', 0, 4) === 'RIFF' &&
    buffer.toString('ascii', 8, 12) === 'WEBP'
  ) {
    return { mimeType: 'image/webp', ...readWebpSize(buffer) }
  }

  if (
    buffer.length >= 8 &&
    buffer.readUInt16LE(0) === 0 &&
    buffer.readUInt16LE(2) === 1
  ) {
    const width = buffer[6] || 256
    const height = buffer[7] || 256
    return { mimeType: 'image/x-icon', width, height }
  }

  const textStart = buffer.toString('utf8', 0, Math.min(buffer.length, 512))
  if (/<svg[\s>]/i.test(textStart)) {
    return { mimeType: 'image/svg+xml', width: null, height: null }
  }

  if (
    buffer.length >= 12 &&
    buffer.toString('ascii', 4, 8) === 'ftyp' &&
    buffer.toString('ascii', 8, 12).includes('avif')
  ) {
    return { mimeType: 'image/avif', width: null, height: null }
  }

  fail(`Unsupported or invalid image format: ${sourcePath}`)
}

async function getMetadata(absolutePath, displayPath) {
  const buffer = await readFile(absolutePath)
  const image = inspectImage(buffer, displayPath)

  return {
    sha256: sha256(buffer),
    sizeBytes: buffer.byteLength,
    ...image,
  }
}

async function walkFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true })
  const files = []

  for (const entry of entries) {
    const absolutePath = resolve(directory, entry.name)
    if (entry.isDirectory()) files.push(...(await walkFiles(absolutePath)))
    if (entry.isFile()) files.push(absolutePath)
  }

  return files
}

async function isDirectory(directory) {
  try {
    return (await stat(directory)).isDirectory()
  } catch (error) {
    if (error?.code === 'ENOENT') return false
    throw error
  }
}

function compareMetadata(entry, metadata, label) {
  for (const key of ['sha256', 'sizeBytes', 'mimeType', 'width', 'height']) {
    assert(
      entry[key] === metadata[key],
      `${label}: ${key} mismatch (manifest=${entry[key]}, actual=${metadata[key]})`,
    )
  }
}

function validateRecordShape(entry, label) {
  for (const field of requiredFields) {
    assert(Object.hasOwn(entry, field), `${label}: missing field ${field}`)
  }

  assert(
    allowedStatuses.has(entry.sourceStatus),
    `${label}: invalid sourceStatus ${entry.sourceStatus}`,
  )
  assert(
    typeof entry.currentlyReferenced === 'boolean',
    `${label}: currentlyReferenced must be boolean`,
  )
  assert(
    typeof entry.safeToDisplay === 'boolean',
    `${label}: safeToDisplay must be boolean`,
  )
  assert(
    typeof entry.notes === 'string' && entry.notes.length > 0,
    `${label}: notes must be a non-empty string`,
  )

  if (
    entry.sourceStatus === 'legacy-template-placeholder' ||
    entry.sourceStatus === 'v0-sample-placeholder'
  ) {
    assert(
      entry.safeToDisplay === false,
      `${label}: placeholder assets must not be marked safeToDisplay`,
    )
  }
}

async function main() {
  const manifest = JSON.parse(await readFile(manifestPath, 'utf8'))
  const legacyAssets = manifest.legacyAssets ?? []
  const v0ReferenceAssets = manifest.v0ReferenceAssets ?? []

  assert(legacyAssets.length > 0, 'Manifest has no legacyAssets')
  assert(v0ReferenceAssets.length > 0, 'Manifest has no v0ReferenceAssets')

  const publicUrls = new Set()
  const publicPathsLowercase = new Set()
  const sourcePaths = new Set()

  for (const [index, entry] of legacyAssets.entries()) {
    const label = `legacyAssets[${index}] (${entry.sourcePath})`
    validateRecordShape(entry, label)

    assert(
      typeof entry.publicPath === 'string',
      `${label}: publicPath required`,
    )
    assert(typeof entry.publicUrl === 'string', `${label}: publicUrl required`)
    assert(
      entry.publicPath.startsWith('public/'),
      `${label}: publicPath must start with public/`,
    )
    assert(
      entry.publicUrl === `/${entry.publicPath.slice('public/'.length)}`,
      `${label}: publicUrl must match publicPath`,
    )
    assert(!publicUrls.has(entry.publicUrl), `${label}: duplicate publicUrl`)

    const lowerPath = entry.publicPath.toLowerCase()
    assert(
      !publicPathsLowercase.has(lowerPath),
      `${label}: case-insensitive publicPath collision`,
    )

    publicUrls.add(entry.publicUrl)
    publicPathsLowercase.add(lowerPath)
    sourcePaths.add(entry.sourcePath)

    const sourceAbsolute = resolve(repositoryRoot, entry.sourcePath)
    const publicAbsolute = resolve(repositoryRoot, entry.publicPath)
    const sourceMetadata = await getMetadata(sourceAbsolute, entry.sourcePath)
    const publicMetadata = await getMetadata(publicAbsolute, entry.publicPath)

    compareMetadata(entry, sourceMetadata, `${label} source`)
    compareMetadata(entry, publicMetadata, `${label} public copy`)
    assert(
      sourceMetadata.sha256 === publicMetadata.sha256,
      `${label}: source/public SHA-256 mismatch`,
    )
  }

  const legacyImageFiles = (await walkFiles(resolve(repositoryRoot, 'img')))
    .filter((file) => imageExtensions.has(extname(file).toLowerCase()))
    .map((file) => toPosixPath(relative(repositoryRoot, file)))
  const screenshotPath = resolve(repositoryRoot, 'screenshot.png')
  if ((await stat(screenshotPath)).isFile())
    legacyImageFiles.push('screenshot.png')

  assert(
    legacyImageFiles.length === sourcePaths.size &&
      legacyImageFiles.every((file) => sourcePaths.has(file)),
    'Manifest does not cover every legacy img file and screenshot.png',
  )

  const v0SourcePaths = new Set()
  const v0Hashes = new Set()
  const v0SourceAvailable = await isDirectory(v0PublicRoot)

  for (const [index, entry] of v0ReferenceAssets.entries()) {
    const label = `v0ReferenceAssets[${index}] (${entry.sourcePath})`
    validateRecordShape(entry, label)
    assert(entry.publicPath === null, `${label}: publicPath must be null`)
    assert(entry.publicUrl === null, `${label}: publicUrl must be null`)
    assert(
      entry.sourceStatus === 'v0-sample-placeholder',
      `${label}: sourceStatus must be v0-sample-placeholder`,
    )
    assert(
      entry.sourcePath.startsWith('../cheezcyj-blog-redesign/public/'),
      `${label}: sourcePath must reference the v0 public directory`,
    )
    assert(
      !v0SourcePaths.has(entry.sourcePath),
      `${label}: duplicate sourcePath`,
    )
    assert(!v0Hashes.has(entry.sha256), `${label}: duplicate SHA-256`)

    if (v0SourceAvailable) {
      const sourceAbsolute = resolve(repositoryRoot, entry.sourcePath)
      const metadata = await getMetadata(sourceAbsolute, entry.sourcePath)
      compareMetadata(entry, metadata, label)
    }
    v0SourcePaths.add(entry.sourcePath)
    v0Hashes.add(entry.sha256)
  }

  if (v0SourceAvailable) {
    const actualV0Files = (await walkFiles(v0PublicRoot))
      .filter((file) => imageExtensions.has(extname(file).toLowerCase()))
      .map((file) =>
        toPosixPath(
          `../cheezcyj-blog-redesign/public/${relative(v0PublicRoot, file)}`,
        ),
      )

    assert(
      actualV0Files.length === v0SourcePaths.size &&
        actualV0Files.every((file) => v0SourcePaths.has(file)),
      'v0ReferenceAssets does not cover every image in the v0 public directory',
    )
  }

  const publicFiles = await walkFiles(publicRoot)
  const publicFilesLowercase = new Map()

  for (const file of publicFiles) {
    const publicRelative = toPosixPath(relative(publicRoot, file))
    const lowerPath = publicRelative.toLowerCase()
    assert(
      !publicFilesLowercase.has(lowerPath),
      `Case-insensitive public file collision: ${publicRelative}`,
    )
    publicFilesLowercase.set(lowerPath, publicRelative)

    if (imageExtensions.has(extname(file).toLowerCase())) {
      const buffer = await readFile(file)
      assert(
        !v0Hashes.has(sha256(buffer)),
        `v0 sample asset was copied into Astro public: ${publicRelative}`,
      )
    }
  }

  console.log('Asset verification passed.')
  console.log(`- Legacy assets verified: ${legacyAssets.length}`)
  console.log(`- Source/public SHA-256 matches: ${legacyAssets.length}`)
  console.log(`- v0 reference assets excluded: ${v0ReferenceAssets.length}`)
  console.log(
    `- v0 source inventory: ${v0SourceAvailable ? 'verified' : 'manifest-only (source repository unavailable)'}`,
  )
  console.log('- Duplicate public URLs: 0')
  console.log('- Case-insensitive public path collisions: 0')
}

main().catch((error) => {
  console.error(`Asset verification failed: ${error.message}`)
  process.exitCode = 1
})
