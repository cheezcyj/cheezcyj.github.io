import { defineCollection } from 'astro:content'
import { glob } from 'astro/loaders'
import { z } from 'astro/zod'

const sourceStatus = z.enum([
  'verified',
  'legacy-placeholder',
  'inventory-only',
])

const nonEmptyString = z.string().trim().min(1)

const cover = z.object({
  src: z.string().trim().regex(/^\/.+/),
  alt: nonEmptyString,
  width: z.number().int().positive().optional(),
  height: z.number().int().positive().optional(),
})

const common = {
  title: nonEmptyString,
  description: nonEmptyString,
  draft: z.boolean().default(false),
  featured: z.boolean().default(false),
  order: z.number().int().nonnegative().optional(),
  tags: z.array(nonEmptyString).default([]),
  cover: cover.optional(),
  legacyUrls: z.array(nonEmptyString).default([]),
  sourceStatus: sourceStatus.default('verified'),
  updatedAt: z.coerce.date().optional(),
}

type PublicationCandidate = {
  title: string
  description: string
  draft: boolean
  sourceStatus: z.infer<typeof sourceStatus>
  cover?: z.infer<typeof cover>
  gallery?: z.infer<typeof cover>[]
  externalUrl?: string
  repositoryUrl?: string
  demoUrl?: string
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

function validatePublicationCandidate(
  data: PublicationCandidate,
  context: z.RefinementCtx,
  options: {
    eligible?: boolean
    linkFields?: Array<'externalUrl' | 'repositoryUrl' | 'demoUrl'>
  } = {},
): void {
  const { eligible = true, linkFields = [] } = options

  if (data.sourceStatus !== 'verified') return

  for (const [index, image] of [
    data.cover,
    ...(data.gallery ?? []),
  ].entries()) {
    if (!image) continue
    if (
      legacyPlaceholderAssets.has(image.src.toLowerCase()) ||
      v0SampleAssetPattern.test(image.src)
    ) {
      context.addIssue({
        code: 'custom',
        path: index === 0 ? ['cover', 'src'] : ['gallery', index - 1, 'src'],
        message:
          'Verified entries cannot use legacy template or v0 sample assets.',
      })
    }
  }

  if (!eligible || data.draft) return

  if (
    placeholderTextPattern.test(`${data.title} ${data.description}`) ||
    /^project\s*\d+$/i.test(data.title)
  ) {
    context.addIssue({
      code: 'custom',
      path: ['title'],
      message:
        'Verified public entries cannot contain template placeholder text.',
    })
  }

  for (const field of linkFields) {
    const value = data[field]
    if (value && isPlaceholderLink(value)) {
      context.addIssue({
        code: 'custom',
        path: [field],
        message: 'Verified public entries cannot use placeholder links.',
      })
    }
  }
}

const designSchema = z
  .object({
    ...common,
    year: z.number().int().min(2000).max(2100),
    disciplines: z.array(nonEmptyString).min(1),
    roles: z.array(nonEmptyString).default([]),
    tools: z.array(nonEmptyString).default([]),
    client: nonEmptyString.optional(),
    externalUrl: z.url().optional(),
    aspect: z.enum(['portrait', 'landscape', 'square']).default('landscape'),
    gallery: z.array(cover).default([]),
  })
  .superRefine((data, context) =>
    validatePublicationCandidate(data, context, {
      linkFields: ['externalUrl'],
    }),
  )

const projectSchema = z
  .object({
    ...common,
    status: z.enum(['planned', 'in-progress', 'completed', 'archived']),
    startedAt: z.coerce.date().optional(),
    completedAt: z.coerce.date().optional(),
    stack: z.array(nonEmptyString).min(1),
    roles: z.array(nonEmptyString).default([]),
    repositoryUrl: z.url().optional(),
    demoUrl: z.url().optional(),
    highlights: z.array(nonEmptyString).default([]),
  })
  .superRefine((data, context) =>
    validatePublicationCandidate(data, context, {
      linkFields: ['repositoryUrl', 'demoUrl'],
    }),
  )

const studySchema = z
  .object({
    ...common,
    learnedAt: z.coerce.date().optional(),
    program: nonEmptyString,
    track: nonEmptyString.optional(),
    phase: nonEmptyString.optional(),
    week: nonEmptyString.optional(),
    module: nonEmptyString.optional(),
    sequence: z.number().int().nonnegative(),
    contentStatus: z.enum(['inventory-only', 'draft', 'complete']),
    source: z
      .object({
        file: nonEmptyString,
        modalId: z.number().int().positive().optional(),
        originalLabel: nonEmptyString.optional(),
      })
      .optional(),
  })
  .superRefine((data, context) =>
    validatePublicationCandidate(data, context, {
      eligible: data.contentStatus === 'complete',
    }),
  )

const postSchema = z
  .object({
    ...common,
    publishedAt: z.coerce.date(),
    category: nonEmptyString.optional(),
    authors: z.array(nonEmptyString).default(['cheezcyj']),
  })
  .superRefine((data, context) => validatePublicationCandidate(data, context))

const design = defineCollection({
  loader: glob({
    base: './src/content/design',
    pattern: '**/*.{md,mdx}',
  }),
  schema: designSchema,
})

const projects = defineCollection({
  loader: glob({
    base: './src/content/projects',
    pattern: '**/*.{md,mdx}',
  }),
  schema: projectSchema,
})

const study = defineCollection({
  loader: glob({
    base: './src/content/study',
    pattern: '**/*.{md,mdx}',
  }),
  schema: studySchema,
})

const posts = defineCollection({
  loader: glob({
    base: './src/content/posts',
    pattern: '**/*.{md,mdx}',
  }),
  schema: postSchema,
})

export const collections = { design, projects, study, posts }
