import rss from '@astrojs/rss'
import type { APIRoute } from 'astro'
import { siteConfig } from '../config/site'
import { getPublishedEntries } from '../utils/content'
import { getProjectPath } from '../utils/projects'

export const GET: APIRoute = async (context) => {
  if (!context.site) {
    throw new Error('RSS generation requires astro.config.mjs site.')
  }

  const projects = await getPublishedEntries('projects')
  const items = projects.flatMap((entry) => {
    const pubDate =
      entry.data.completedAt ?? entry.data.startedAt ?? entry.data.updatedAt

    if (!(pubDate instanceof Date) || Number.isNaN(pubDate.getTime())) {
      console.warn(
        `[feed] Published project ${entry.id} has no valid publication date.`,
      )
      return []
    }

    return [
      {
        title: entry.data.title,
        description: entry.data.description,
        link: getProjectPath(entry.id),
        pubDate,
        categories: entry.data.tags,
      },
    ]
  })

  return rss({
    title: 'CHOE YOOJEONG — Portfolio Updates',
    description: siteConfig.description,
    site: context.site,
    items,
    customData: '<language>ko-KR</language>',
    trailingSlash: true,
  })
}
