import { createHash } from 'node:crypto'
import { mkdir, readFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'
import {
  EXTERNAL_MEDIA_SOURCE_PREFIX,
  PROJECT_MEDIA_PROJECTS,
  PROJECT_MEDIA_WEBP_OPTIONS,
} from './project-media-config.mjs'

const projectRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '..',
)

function absolutePath(relativePath) {
  if (relativePath.startsWith(EXTERNAL_MEDIA_SOURCE_PREFIX)) {
    const externalSourceRoot = process.env.ROADSCANNER_MEDIA_SOURCE?.trim()
    if (!externalSourceRoot) {
      throw new Error(
        'RoadScanner 원본 변환에는 ROADSCANNER_MEDIA_SOURCE 환경 변수가 필요합니다.',
      )
    }
    return path.join(
      path.resolve(externalSourceRoot),
      ...relativePath.slice(EXTERNAL_MEDIA_SOURCE_PREFIX.length).split('/'),
    )
  }
  return path.join(projectRoot, ...relativePath.split('/'))
}

function sha256(buffer) {
  return createHash('sha256').update(buffer).digest('hex')
}

const requestedProjectId = process.argv[2] ?? 'cheezcyj-portfolio-redesign'
const selectedProjects = PROJECT_MEDIA_PROJECTS.filter(
  (project) => project.id === requestedProjectId,
)

if (selectedProjects.length === 0) {
  throw new Error(`Unknown project media id: ${requestedProjectId}`)
}

for (const item of selectedProjects.flatMap((project) => project.items)) {
  const inputPath = absolutePath(item.input)
  const outputPath = absolutePath(item.output)
  const inputMetadata = await sharp(inputPath).metadata()

  if (
    inputMetadata.format !== item.inputFormat ||
    inputMetadata.width !== item.inputWidth ||
    inputMetadata.height !== item.inputHeight
  ) {
    throw new Error(
      `${item.input}: expected ${item.inputFormat.toUpperCase()} ${item.inputWidth}x${item.inputHeight}, received ${inputMetadata.format ?? 'unknown'} ${inputMetadata.width ?? 0}x${inputMetadata.height ?? 0}`,
    )
  }

  await mkdir(path.dirname(outputPath), { recursive: true })

  let pipeline = sharp(inputPath)
  if (item.crop) pipeline = pipeline.extract(item.crop)

  await pipeline.webp(PROJECT_MEDIA_WEBP_OPTIONS).toFile(outputPath)

  const outputMetadata = await sharp(outputPath).metadata()
  const outputBuffer = await readFile(outputPath)

  if (
    outputMetadata.format !== 'webp' ||
    outputMetadata.width !== item.width ||
    outputMetadata.height !== item.height
  ) {
    throw new Error(
      `${item.output}: expected WebP ${item.width}x${item.height}, received ${outputMetadata.format ?? 'unknown'} ${outputMetadata.width ?? 0}x${outputMetadata.height ?? 0}`,
    )
  }

  console.log(
    JSON.stringify({
      input: item.input,
      output: item.output,
      width: outputMetadata.width,
      height: outputMetadata.height,
      sizeBytes: outputBuffer.length,
      mimeType: 'image/webp',
      sha256: sha256(outputBuffer),
    }),
  )
}
