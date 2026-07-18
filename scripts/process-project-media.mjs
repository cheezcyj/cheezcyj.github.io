import { createHash } from 'node:crypto'
import { mkdir, readFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'
import {
  PROJECT_MEDIA_ITEMS,
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

for (const item of PROJECT_MEDIA_ITEMS) {
  const inputPath = absolutePath(item.input)
  const outputPath = absolutePath(item.output)
  const inputMetadata = await sharp(inputPath).metadata()

  if (
    inputMetadata.format !== 'png' ||
    inputMetadata.width !== item.inputWidth ||
    inputMetadata.height !== item.inputHeight
  ) {
    throw new Error(
      `${item.input}: expected PNG ${item.inputWidth}x${item.inputHeight}, received ${inputMetadata.format ?? 'unknown'} ${inputMetadata.width ?? 0}x${inputMetadata.height ?? 0}`,
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
