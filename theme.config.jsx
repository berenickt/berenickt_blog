import { Code } from './components/code'

const logo = (
  <>
    <link rel='icon' href='./public/favicon.png' type='image/png' />
    <span style={{ marginLeft: '.4em', fontWeight: 900, fontSize: 20 }}>berenickt.log</span>
  </>
)

/***
 * @see https://nextra.site/docs/docs-theme/theme-configuration
 */
/** @type {import('nextra-theme-docs').DocsThemeConfig } */
const config = {
  logo,
  project: {
    link: 'https://github.com/berenickt',
  },
  // **** Code block theme
  components: { Code },
  banner: {
    key: 'berenickt-release',
    content: '🎉 berenickt 블로그에 온 걸 환영합니다. 🎉',
  },
  navigation: {
    prev: true,
    next: true,
  },
  // **** sidebar hidden toggle
  sidebar: {
    titleComponent({ title, type }) {
      if (type === 'separator') {
        return <span className='cursor-default'>{title}</span>
      }
      return <>{title}</>
    },
    defaultMenuCollapseLevel: 1,
    toggleButton: true,
  },
  search: {
    placeholder: '검색어를 입력해주세요.',
  },
  footer: {
    content: `Berenickt Dev Blog © 2022 ~ ${new Date().getFullYear()}`,
  },
}

export default config
