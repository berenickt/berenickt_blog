import nextra from 'nextra'
import { remarkCodeHike, recmaCodeHike } from 'codehike/mdx'
import { remarkCodeLang } from './lib/remark-code-lang.mjs'
import { remarkCallout } from './lib/remark-callout.mjs'

/** @type {import('codehike/mdx').CodeHikeConfig} */
const chConfig = {
  components: { code: 'Code' },
  syntaxHighlighting: {
    theme: 'dark-plus',
  },
}

const withNextra = nextra({
  // content/ 디렉터리의 MDX를 루트 경로(/)에 매핑
  contentDirBasePath: '/',
  // 코드 하이라이팅은 Code Hike가 담당
  codeHighlight: false,
  latex: true,
  search: { codeblocks: false },
  mdxOptions: {
    // remarkCodeLang 이 먼저 돌아 Code Hike 가 모르는 언어를 정리한다.
    remarkPlugins: [remarkCallout, remarkCodeLang, [remarkCodeHike, chConfig]],
    recmaPlugins: [[recmaCodeHike, chConfig]],
  },
})

/** @type {import('next').NextConfig} */
const nextConfig = {
  // content/ 폴더명 변경 전 URL → 새 URL (검색엔진·외부 링크 유지)
  async redirects() {
    return [
      ['/cs/backjoon', '/cs/baekjoon'],
      ['/cs/dataAlgo-js', '/cs/algorithm-js'],
      ['/cs/book-clean-code', '/cs/clean-code'],
      ['/mobile/reactNative', '/mobile/react-native'],
      ['/front/react-test-lib', '/frontend/react-testing-library'],
      ['/front/nextjs/11-API-Ref', '/frontend/nextjs/11-api-reference'],
      // AWS 서비스 명·종류, 클라우드 배포 전략, 프론트 단계별 AWS 배포 → 한 페이지로 통합
      ['/devops/aws-service-name', '/devops/aws-services-deploy'],
      ['/devops/aws-service-type', '/devops/aws-services-deploy'],
      ['/devops/distribute', '/devops/aws-services-deploy'],
      ['/devops/aws-front-distribute', '/devops/aws-services-deploy'],
      // 최상위 폴더명 변경 (구체적인 경로보다 뒤에 두어야 한 번에 이동)
      ['/front', '/frontend'],
      ['/back', '/backend'],
      ['/lang', '/languages'],
    ].flatMap(([from, to]) => [
      { source: from, destination: to, permanent: true },
      { source: `${from}/:path*`, destination: `${to}/:path*`, permanent: true },
    ])
  },
}

export default withNextra(nextConfig)
