export const aboutContent = {
  description:
    '2D/3D 디자인, 웹퍼블리싱과 풀스택 개발을 연결하며 배움과 경험을 기록하는 최유정의 소개 페이지입니다.',
  headline: '디자인의 감각과 코드의 논리를 연결합니다.',
  introduction:
    '디자이너이자 풀스택 개발자 최유정입니다. 2D/3D 디자인, 웹퍼블리싱, 풀스택 개발 프로젝트와 배움의 기록을 정리합니다.',
  detail:
    '정보 구조와 시각 기준을 세우는 일부터 반응형 화면과 실제 기능을 구현하는 일까지, 하나의 경험이 완성되는 과정을 함께 다룹니다. 결과만 보여 주기보다 선택의 이유와 개선 과정을 기록하며 더 나은 다음 작업으로 연결합니다.',
  previewSkills: [
    '2D/3D Design',
    'Web Publishing',
    'Fullstack Development',
    'Accessibility',
  ],
  disciplines: [
    {
      number: '01',
      title: '2D/3D Design',
      label: 'Visual Structure',
      description:
        '온·오프라인 매체의 목적과 정보 우선순위를 정리하고, 일관된 시각 언어로 화면과 그래픽을 구성합니다.',
    },
    {
      number: '02',
      title: 'Web Publishing',
      label: 'Accessible Interface',
      description:
        '시맨틱 HTML과 반응형 CSS를 바탕으로 디자인을 안정적인 화면으로 옮기고, 키보드 접근성과 모션 환경까지 확인합니다.',
    },
    {
      number: '03',
      title: 'Fullstack Engineering',
      label: 'Working Product',
      description:
        '프론트엔드와 서버·데이터 흐름을 함께 살피며 웹 기능을 구현합니다. 팀 프로젝트에서는 머신러닝·딥러닝 기능 개발과 웹 연동에도 참여했습니다.',
    },
  ],
  experiences: [
    {
      eyebrow: 'Team Project · 2023',
      title: 'RoadScanner',
      description:
        '8인 팀에서 메인 기능과 머신러닝·딥러닝 개발에 참여하고, Q&A 게시판과 JSP UI, 기능 통합을 담당했습니다.',
      href: '/projects/roadscanner/',
      linkLabel: '프로젝트 자세히 보기',
    },
  ],
  capabilityGroups: [
    {
      title: 'Design',
      items: [
        '2D/3D Design',
        'UI Design',
        'Design Tokens',
        'Information Architecture',
      ],
    },
    {
      title: 'Publishing',
      items: ['Semantic HTML', 'CSS', 'Responsive Web', 'Accessibility'],
    },
    {
      title: 'Development',
      items: [
        'JavaScript',
        'TypeScript',
        'Astro',
        'Tailwind CSS',
        'Java',
        'Spring MVC',
        'JSP',
        'MyBatis',
      ],
    },
    {
      title: 'Data & Delivery',
      items: [
        'Oracle Database',
        'AWS S3',
        'Git',
        'GitHub Actions',
        'GitHub Pages',
        'Content Collections',
      ],
    },
  ],
  principles: [
    {
      number: '01',
      title: '구조부터 설계합니다.',
      description:
        '화면을 만들기 전에 정보의 관계와 사용 흐름, 공개 기준을 먼저 정리합니다.',
    },
    {
      number: '02',
      title: '실사용 조건을 확인합니다.',
      description:
        '다양한 화면 크기와 키보드 접근, 모션 설정을 구현 단계부터 함께 검증합니다.',
    },
    {
      number: '03',
      title: '과정을 다음 자산으로 남깁니다.',
      description:
        '기술 선택과 수정 이유, 배운 내용을 기록해 다음 프로젝트의 판단 기준으로 연결합니다.',
    },
  ],
} as const
