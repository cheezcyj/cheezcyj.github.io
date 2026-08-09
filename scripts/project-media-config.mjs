export const PROJECT_MEDIA_WEBP_OPTIONS = Object.freeze({
  quality: 90,
  effort: 6,
})

export const EXTERNAL_MEDIA_SOURCE_PREFIX =
  '<external-media-source>/roadscanner/'

function defineProject(project) {
  return Object.freeze({
    ...project,
    ownerReview: Object.freeze({
      ...project.ownerReview,
      markers: Object.freeze(project.ownerReview.markers),
    }),
    items: Object.freeze(project.items.map((item) => Object.freeze(item))),
  })
}

export const PROJECT_MEDIA_PROJECTS = Object.freeze([
  defineProject({
    id: 'cheezcyj-portfolio-redesign',
    productionDirectory: 'public/images/projects/cheezcyj-portfolio-redesign',
    content: 'src/content/projects/cheezcyj-portfolio-redesign.md',
    ownerReview: {
      path: 'docs/project-media-review.md',
      markers: ['Revision 2', 'Draft Preview', '미노출'],
    },
    items: [
      {
        id: 'cover',
        input:
          'docs/media-review/cheezcyj-portfolio-redesign/revision-2/02-project-detail-desktop.png',
        inputFormat: 'png',
        output: 'public/images/projects/cheezcyj-portfolio-redesign/cover.webp',
        publicPath: '/images/projects/cheezcyj-portfolio-redesign/cover.webp',
        inputWidth: 1440,
        inputHeight: 900,
        width: 1280,
        height: 720,
        crop: Object.freeze({
          left: 80,
          top: 90,
          width: 1280,
          height: 720,
        }),
      },
      {
        id: 'project-rail-desktop',
        input:
          'docs/media-review/cheezcyj-portfolio-redesign/revision-2/01-project-rail-desktop.png',
        inputFormat: 'png',
        output:
          'public/images/projects/cheezcyj-portfolio-redesign/project-rail-desktop.webp',
        publicPath:
          '/images/projects/cheezcyj-portfolio-redesign/project-rail-desktop.webp',
        inputWidth: 1440,
        inputHeight: 900,
        width: 1440,
        height: 900,
      },
      {
        id: 'mobile-navigation',
        input:
          'docs/media-review/cheezcyj-portfolio-redesign/revision-2/03-mobile-menu-open.png',
        inputFormat: 'png',
        output:
          'public/images/projects/cheezcyj-portfolio-redesign/mobile-navigation.webp',
        publicPath:
          '/images/projects/cheezcyj-portfolio-redesign/mobile-navigation.webp',
        inputWidth: 390,
        inputHeight: 844,
        width: 390,
        height: 844,
      },
      {
        id: 'project-detail-mobile',
        input:
          'docs/media-review/cheezcyj-portfolio-redesign/revision-2/04-project-detail-mobile.png',
        inputFormat: 'png',
        output:
          'public/images/projects/cheezcyj-portfolio-redesign/project-detail-mobile.webp',
        publicPath:
          '/images/projects/cheezcyj-portfolio-redesign/project-detail-mobile.webp',
        inputWidth: 390,
        inputHeight: 844,
        width: 390,
        height: 844,
      },
    ],
  }),
  defineProject({
    id: 'roadscanner',
    sourcesLocalOnly: true,
    productionDirectory: 'public/images/projects/roadscanner',
    content: 'src/content/projects/roadscanner.md',
    ownerReview: {
      path: 'docs/roadscanner-current-state-report.md',
      markers: [
        'RoadScanner 최신 상태 반영',
        '`f03d58f8f98b24bfb654d86777c1746792ef5bcb`',
        'Owner 승인',
      ],
    },
    items: [
      {
        id: 'cover',
        input:
          '<external-media-source>/roadscanner/docs/demo/landing-overview.gif',
        inputFormat: 'gif',
        output: 'public/images/projects/roadscanner/cover.webp',
        publicPath: '/images/projects/roadscanner/cover.webp',
        inputWidth: 1264,
        inputHeight: 800,
        width: 1264,
        height: 711,
        crop: Object.freeze({
          left: 0,
          top: 0,
          width: 1264,
          height: 711,
        }),
        sha256:
          '2e9d77d5770062d376313f456979bcf503e1e0a31a190f5ba4b3650a2e14db62',
      },
      {
        id: 'upload-entry',
        input:
          '<external-media-source>/roadscanner/docs/demo/image-analysis-flow.gif',
        inputFormat: 'gif',
        output: 'public/images/projects/roadscanner/upload-entry.webp',
        publicPath: '/images/projects/roadscanner/upload-entry.webp',
        inputWidth: 1264,
        inputHeight: 800,
        width: 1264,
        height: 711,
        crop: Object.freeze({
          left: 0,
          top: 0,
          width: 1264,
          height: 711,
        }),
        sha256:
          'ee27b8661bc461663e8f856b4ce1033b86598a4e8d68e5b91b8b1c7f976054db',
      },
      {
        id: 'private-inquiry',
        input:
          '<external-media-source>/roadscanner/docs/demo/private-inquiry-list.gif',
        inputFormat: 'gif',
        output: 'public/images/projects/roadscanner/private-inquiry.webp',
        publicPath: '/images/projects/roadscanner/private-inquiry.webp',
        inputWidth: 1264,
        inputHeight: 800,
        width: 1264,
        height: 711,
        crop: Object.freeze({
          left: 0,
          top: 0,
          width: 1264,
          height: 711,
        }),
        sha256:
          'ddba94f2cad95201d6b4d50afd2f3d77b4b4099c37113eeac639ee47a886d097',
      },
      {
        id: 'qna-list',
        input:
          '<external-media-source>/roadscanner/docs/demo/qna-post-crud.gif',
        inputFormat: 'gif',
        output: 'public/images/projects/roadscanner/qna-list.webp',
        publicPath: '/images/projects/roadscanner/qna-list.webp',
        inputWidth: 1264,
        inputHeight: 800,
        width: 1264,
        height: 711,
        crop: Object.freeze({
          left: 0,
          top: 0,
          width: 1264,
          height: 711,
        }),
        sha256:
          'd9a3b2201445634af8e958ac4b18597738cbab3e9575802e6c1a452a3ba594a0',
      },
      {
        id: 'feedback-statistics',
        input:
          '<external-media-source>/roadscanner/docs/demo/admin-analysis-statistics.gif',
        inputFormat: 'gif',
        output: 'public/images/projects/roadscanner/feedback-statistics.webp',
        publicPath: '/images/projects/roadscanner/feedback-statistics.webp',
        inputWidth: 1264,
        inputHeight: 800,
        width: 1264,
        height: 711,
        crop: Object.freeze({
          left: 0,
          top: 0,
          width: 1264,
          height: 711,
        }),
        sha256:
          '75db307a204e587b94bcd25b060d7c9fdeb8b7999f2419f1ce323db7ae22c960',
      },
    ],
  }),
])

export const PROJECT_MEDIA_ITEMS = Object.freeze(
  PROJECT_MEDIA_PROJECTS.flatMap((project) =>
    project.items.map((item) =>
      Object.freeze({ ...item, projectId: project.id }),
    ),
  ),
)
