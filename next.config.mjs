import nextra from 'nextra'
import { remarkCodeHike, recmaCodeHike } from 'codehike/mdx'

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
    remarkPlugins: [[remarkCodeHike, chConfig]],
    recmaPlugins: [[recmaCodeHike, chConfig]],
  },
})

/** @type {import('next').NextConfig} */
const nextConfig = {}

export default withNextra(nextConfig)
