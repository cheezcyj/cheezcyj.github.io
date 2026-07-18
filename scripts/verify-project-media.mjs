import { createHash } from 'node:crypto'
import { readdir, readFile, stat } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'
import { parse } from 'yaml'
import {
  PROJECT_MEDIA_ITEMS,
  PROJECT_MEDIA_PROJECTS,
  PROJECT_MEDIA_WEBP_OPTIONS,
} from './project-media-config.mjs'

const projectRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '..',
)

function absolutePath(relativePath) {
  return path.join(projectRoot, ...relativePath.split('/'))
}

function sha256(buffer) {
  return createHash('sha256').update(buffer).digest('hex')
}

function parseFrontmatter(source) {
  const frontmatter = source.match(/^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/)
  if (!frontmatter) throw new Error('Project content is missing frontmatter.')
  return parse(frontmatter[1])
}

function isWebp(buffer) {
  return (
    buffer.length >= 12 &&
    buffer.subarray(0, 4).toString('ascii') === 'RIFF' &&
    buffer.subarray(8, 12).toString('ascii') === 'WEBP'
  )
}

const errors = []
const hashes = new Map()
let localSourceMappingsSkipped = 0

for (const project of PROJECT_MEDIA_PROJECTS) {
  const expectedFileNames = new Set(
    project.items.map((item) => path.basename(item.output)),
  )

  try {
    const actualFileNames = new Set(
      await readdir(absolutePath(project.productionDirectory)),
    )

    for (const fileName of expectedFileNames) {
      if (!actualFileNames.has(fileName)) {
        errors.push(`${project.id}: missing file: ${fileName}`)
      }
    }
    for (const fileName of actualFileNames) {
      if (!expectedFileNames.has(fileName)) {
        errors.push(
          `${project.id}: unapproved file in production media directory: ${fileName}`,
        )
      }
    }
  } catch (error) {
    errors.push(error instanceof Error ? error.message : String(error))
  }

  try {
    const content = parseFrontmatter(
      await readFile(absolutePath(project.content), 'utf8'),
    )
    const contentMedia = [content.cover, ...(content.gallery ?? [])].filter(
      Boolean,
    )
    const contentBySource = new Map(
      contentMedia
        .filter((item) => item && typeof item.src === 'string')
        .map((item) => [item.src, item]),
    )

    if (contentMedia.length !== project.items.length) {
      errors.push(
        `${project.id}: frontmatter media count mismatch: expected ${project.items.length}, received ${contentMedia.length}`,
      )
    }

    for (const item of project.items) {
      const inputPath = absolutePath(item.input)
      const outputPath = absolutePath(item.output)

      try {
        const outputStat = await stat(outputPath)
        if (outputStat.size <= 0) errors.push(`${item.output}: zero-byte file`)

        const outputBuffer = await readFile(outputPath)
        if (!isWebp(outputBuffer)) {
          errors.push(`${item.output}: invalid WebP MIME`)
        }

        const metadata = await sharp(outputBuffer).metadata()
        if (metadata.format !== 'webp') {
          errors.push(`${item.output}: sharp format is not webp`)
        }
        if (metadata.width !== item.width || metadata.height !== item.height) {
          errors.push(
            `${item.output}: expected ${item.width}x${item.height}, received ${metadata.width ?? 0}x${metadata.height ?? 0}`,
          )
        }

        const hash = sha256(outputBuffer)
        if (item.sha256 && item.sha256 !== hash) {
          errors.push(`${item.output}: approved SHA-256 mismatch`)
        }

        let sourceAvailable = true
        try {
          await stat(inputPath)
        } catch (error) {
          if (
            project.sourcesLocalOnly &&
            error instanceof Error &&
            'code' in error &&
            error.code === 'ENOENT'
          ) {
            sourceAvailable = false
            localSourceMappingsSkipped += 1
          } else {
            throw error
          }
        }

        if (sourceAvailable) {
          let expectedPipeline = sharp(inputPath)
          if (item.crop) expectedPipeline = expectedPipeline.extract(item.crop)
          const expectedBuffer = await expectedPipeline
            .webp(PROJECT_MEDIA_WEBP_OPTIONS)
            .toBuffer()
          if (sha256(expectedBuffer) !== hash) {
            errors.push(
              `${item.output}: output does not match approved source mapping`,
            )
          }
        }

        if (hashes.has(hash)) {
          errors.push(`${item.output}: duplicate hash with ${hashes.get(hash)}`)
        }
        hashes.set(hash, item.output)

        const frontmatterImage = contentBySource.get(item.publicPath)
        if (!frontmatterImage) {
          errors.push(`${item.publicPath}: missing from project frontmatter`)
        } else {
          if (
            frontmatterImage.width !== item.width ||
            frontmatterImage.height !== item.height
          ) {
            errors.push(
              `${item.publicPath}: frontmatter dimensions do not match`,
            )
          }
          if (
            typeof frontmatterImage.alt !== 'string' ||
            frontmatterImage.alt.trim().length === 0
          ) {
            errors.push(`${item.publicPath}: empty frontmatter alt`)
          }
        }
      } catch (error) {
        errors.push(error instanceof Error ? error.message : String(error))
      }
    }

    const ownerReview = await readFile(
      absolutePath(project.ownerReview.path),
      'utf8',
    )
    const missingMarkers = project.ownerReview.markers.filter(
      (marker) => !ownerReview.includes(marker),
    )
    if (missingMarkers.length > 0) {
      errors.push(
        `${project.id}: Owner review is missing markers: ${missingMarkers.join(', ')}`,
      )
    }
  } catch (error) {
    errors.push(error instanceof Error ? error.message : String(error))
  }
}

if (errors.length > 0) {
  console.error('Project media verification failed:')
  for (const error of errors) console.error(`- ${error}`)
  process.exitCode = 1
} else {
  console.log('Project media verification passed.')
  console.log(`- Approved projects: ${PROJECT_MEDIA_PROJECTS.length}`)
  console.log(`- Approved WebP files: ${PROJECT_MEDIA_ITEMS.length}`)
  console.log('- Missing files: 0')
  console.log('- Invalid MIME types: 0')
  console.log('- Dimension mismatches: 0')
  console.log('- Duplicate hashes: 0')
  console.log(`- Local source mappings skipped: ${localSourceMappingsSkipped}`)
  console.log('- Frontmatter media mismatches: 0')
  console.log('- Unapproved sample files: 0')
}
