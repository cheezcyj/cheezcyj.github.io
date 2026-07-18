export const PROJECT_MEDIA_WEBP_OPTIONS = Object.freeze({
  quality: 90,
  effort: 6,
})

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
      path: 'docs/roadscanner-media-production-report.md',
      markers: ['Phase 4C-4', '승인된 최종 이미지', '`draft: true`'],
    },
    items: [
      {
        id: 'cover',
        input:
          '../roadscanner-media-source/videos/263704183-d9e78da4-732d-4f06-8a29-d00c654763cd.gif',
        inputFormat: 'gif',
        output: 'public/images/projects/roadscanner/cover.webp',
        publicPath: '/images/projects/roadscanner/cover.webp',
        inputWidth: 800,
        inputHeight: 407,
        width: 800,
        height: 407,
        sha256:
          'b20d701f546a3541ed4269e41103a1ccb0042cca227bacc9757e677176e0cf46',
      },
      {
        id: 'feedback-statistics',
        input:
          'docs/media-review/roadscanner/revision-2/redacted-previews/videocapture-20231108-170610-redacted-review.jpg',
        inputFormat: 'jpeg',
        output: 'public/images/projects/roadscanner/feedback-statistics.webp',
        publicPath: '/images/projects/roadscanner/feedback-statistics.webp',
        inputWidth: 1920,
        inputHeight: 964,
        width: 1920,
        height: 964,
        sha256:
          'dfb9309f1416d9b803f4bfaa3ebc6bf8e617d09e984c5981a5be132a77de59a2',
      },
      {
        id: 'qna-list',
        input:
          'docs/media-review/roadscanner/revision-2/redacted-previews/videocapture-20231108-170658-redacted-review.jpg',
        inputFormat: 'jpeg',
        output: 'public/images/projects/roadscanner/qna-list.webp',
        publicPath: '/images/projects/roadscanner/qna-list.webp',
        inputWidth: 1920,
        inputHeight: 964,
        width: 1920,
        height: 964,
        sha256:
          'e59fbbe09b00e8fadbc02bb4075139d420a9038a80cfbc95ab906a8577a9e6c9',
      },
      {
        id: 'upload-entry',
        input:
          'docs/media-review/roadscanner/revision-2/redacted-previews/videocapture-20231108-170206-redacted-review.jpg',
        inputFormat: 'jpeg',
        output: 'public/images/projects/roadscanner/upload-entry.webp',
        publicPath: '/images/projects/roadscanner/upload-entry.webp',
        inputWidth: 1920,
        inputHeight: 964,
        width: 1920,
        height: 964,
        sha256:
          '4ad0e17cf93f63f21c205ae5ec9cb21a09b3f855fa4c93a9d70e3bac3b7c9882',
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
