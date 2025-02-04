import nextra from 'nextra'
import { remarkCodeHike, recmaCodeHike } from 'codehike/mdx'

/** @type {import('codehike/mdx').CodeHikeConfig} */
const chConfig = {
  components: { code: 'Code' },
  syntaxHighlighting: {
    theme: 'dark-plus',
  },
}

const mdxOptions = {
  remarkPlugins: [[remarkCodeHike, chConfig]],
  recmaPlugins: [[recmaCodeHike, chConfig]],
  // jsx: true,
}

const withNextra = nextra({
  theme: 'nextra-theme-docs',
  themeConfig: './theme.config.jsx',
  codeHighlight: false,
  mdxOptions,
  latex: true,
})

export default withNextra()
