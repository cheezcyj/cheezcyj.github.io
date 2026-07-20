import type { CollectionEntry } from 'astro:content'

export type ProjectEntry = CollectionEntry<'projects'>
export type ProjectStatus = ProjectEntry['data']['status']

const projectStatusLabels: Record<ProjectStatus, string> = {
  planned: '예정',
  'in-progress': '진행 중',
  completed: '완료',
  archived: '보관됨',
}

const projectMonthFormatter = new Intl.DateTimeFormat('ko-KR', {
  year: 'numeric',
  month: 'long',
  timeZone: 'UTC',
})

export function getProjectStatusLabel(status: ProjectStatus): string {
  return projectStatusLabels[status]
}

export function formatProjectMonth(date: Date): string {
  return projectMonthFormatter.format(date)
}

export function getProjectPeriod(entry: ProjectEntry): string | undefined {
  const { startedAt, completedAt, status } = entry.data

  if (!startedAt) return undefined

  const start = formatProjectMonth(startedAt)
  if (completedAt) return `${start} – ${formatProjectMonth(completedAt)}`
  if (status === 'in-progress') return `${start} – 진행 중`

  return start
}

export function getProjectPath(id: string): string {
  const encodedId = id
    .split('/')
    .map((segment) => encodeURIComponent(segment))
    .join('/')

  return `/projects/${encodedId}/`
}
