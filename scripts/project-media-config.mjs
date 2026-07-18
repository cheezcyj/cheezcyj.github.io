export const PROJECT_MEDIA_WEBP_OPTIONS = Object.freeze({
  quality: 90,
  effort: 6,
})

export const PROJECT_MEDIA_ITEMS = Object.freeze([
  Object.freeze({
    id: 'cover',
    input:
      'docs/media-review/cheezcyj-portfolio-redesign/revision-2/02-project-detail-desktop.png',
    output: 'public/images/projects/cheezcyj-portfolio-redesign/cover.webp',
    publicPath: '/images/projects/cheezcyj-portfolio-redesign/cover.webp',
    inputWidth: 1440,
    inputHeight: 900,
    width: 1280,
    height: 720,
    crop: Object.freeze({ left: 80, top: 90, width: 1280, height: 720 }),
  }),
  Object.freeze({
    id: 'project-rail-desktop',
    input:
      'docs/media-review/cheezcyj-portfolio-redesign/revision-2/01-project-rail-desktop.png',
    output:
      'public/images/projects/cheezcyj-portfolio-redesign/project-rail-desktop.webp',
    publicPath:
      '/images/projects/cheezcyj-portfolio-redesign/project-rail-desktop.webp',
    inputWidth: 1440,
    inputHeight: 900,
    width: 1440,
    height: 900,
  }),
  Object.freeze({
    id: 'mobile-navigation',
    input:
      'docs/media-review/cheezcyj-portfolio-redesign/revision-2/03-mobile-menu-open.png',
    output:
      'public/images/projects/cheezcyj-portfolio-redesign/mobile-navigation.webp',
    publicPath:
      '/images/projects/cheezcyj-portfolio-redesign/mobile-navigation.webp',
    inputWidth: 390,
    inputHeight: 844,
    width: 390,
    height: 844,
  }),
  Object.freeze({
    id: 'project-detail-mobile',
    input:
      'docs/media-review/cheezcyj-portfolio-redesign/revision-2/04-project-detail-mobile.png',
    output:
      'public/images/projects/cheezcyj-portfolio-redesign/project-detail-mobile.webp',
    publicPath:
      '/images/projects/cheezcyj-portfolio-redesign/project-detail-mobile.webp',
    inputWidth: 390,
    inputHeight: 844,
    width: 390,
    height: 844,
  }),
])
