export const siteConfig = {
  title: 'CHOE YOOJEONG',
  alternateName: 'CHEEZCYJ',
  url: 'https://cheezcyj.github.io',
  email: 'cheezmicro@gmail.com',
  github: 'https://github.com/cheezcyj',
  description:
    '온/오프라인 디자인, 웹퍼블리싱, 개발 프로젝트와 배운 내용을 기록하는 개인 포트폴리오 아카이브 블로그.',
  roles: ['2D/3D Designer', 'Web Publisher', 'Fullstack Engineer'],
} as const

export const navigation = [
  { label: 'Design', href: '/design/' },
  { label: 'Projects', href: '/projects/' },
  { label: 'Study', href: '/study/' },
  { label: 'Posts', href: '/posts/' },
  { label: 'About', href: '/about/' },
] as const
