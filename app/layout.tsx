import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import { JetBrains_Mono } from 'next/font/google'
import { Layout, Navbar } from 'nextra-theme-docs'
import { Head, Search } from 'nextra/components'
import { getPageMap } from 'nextra/page-map'
import 'pretendard/dist/web/variable/pretendardvariable-dynamic-subset.css'
import 'nextra-theme-docs/style.css'
import './globals.css'
import { AutoHideHeader } from '../components/auto-hide-header'
import { ThemeToggle } from '../components/theme-toggle'
import { SidebarQuickLinks } from '../components/sidebar-quick-links'
import { SiteFooter } from '../components/site-footer'

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains-mono',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'berenickt.log',
    template: '%s – berenickt.log',
  },
  description: '베르닉트 개발 블로그',
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon.png', type: 'image/png' },
    ],
  },
}

const logo = (
  <span className='text-lg font-extrabold tracking-tight'>
    berenickt<span className='text-[var(--x-color-primary-600)]'>.log</span>
  </span>
)

const navbar = (
  <Navbar logo={logo} projectLink='https://github.com/berenickt'>
    <ThemeToggle />
  </Navbar>
)

const footer = <SiteFooter />

export default async function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang='ko' dir='ltr' suppressHydrationWarning className={jetbrainsMono.variable}>
      <Head
        // 브랜드 컬러: Claude 오렌지(클레이, #d97757) 계열
        color={{
          hue: { light: 15, dark: 18 },
          saturation: { light: 63, dark: 72 },
          lightness: { light: 52, dark: 66 },
        }}
        // 라이트 모드 배경: Claude 아이보리 (다크 모드는 기본값 유지)
        backgroundColor={{ light: '#faf9f5', dark: 'rgb(17,17,17)' }}
      />
      <body>
        <AutoHideHeader />
        <SidebarQuickLinks />
        <Layout
          navbar={navbar}
          footer={footer}
          pageMap={await getPageMap()}
          search={<Search placeholder='검색어를 입력해주세요.' />}
          // 이전/다음 글 링크 대신 글 하단에 같은 분류의 글 그리드를 보여준다 (components/related-posts.tsx)
          navigation={false}
          sidebar={{ defaultMenuCollapseLevel: 1, toggleButton: true }}
          // 테마 전환은 헤더의 ThemeToggle 이 담당 (사이드바 하단 기본 선택기 숨김)
          darkMode={false}
          toc={{ backToTop: '맨 위로', title: '목차' }}
          editLink={null}
          feedback={{ content: null }}
          copyPageButton={false}
        >
          {children}
        </Layout>
      </body>
    </html>
  )
}
