export const siteConfig = {
  title: 'CHOE YOOJEONG',
  alternateName: 'CHEEZCYJ',
  url: 'https://cheezcyj.github.io',
  email: 'cheezmicro@gmail.com',
  github: 'https://github.com/cheezcyj',
  description:
    '웹디자인, 웹퍼블리싱, 프론트엔드 프로젝트와 배운 내용을 기록하는 개인 포트폴리오 아카이브.',
  roles: ['Web Designer', 'Web Publisher', 'Frontend Engineer'],
} as const

export const navigation = [
  { label: 'Design', href: '/design/' },
  { label: 'Projects', href: '/projects/' },
  { label: 'Study', href: '/study/' },
  { label: 'Posts', href: '/posts/' },
  { label: 'About', href: '/about/' },
  { label: 'GitHub', href: siteConfig.github, external: true },
] as const
