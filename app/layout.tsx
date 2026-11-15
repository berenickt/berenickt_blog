import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import { Footer, Layout, Navbar } from 'nextra-theme-docs'
import { Banner, Head, Search } from 'nextra/components'
import { getPageMap } from 'nextra/page-map'
import 'nextra-theme-docs/style.css'
import './globals.css'

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

const banner = (
  <Banner storageKey='berenickt-release'>🎉 berenickt 블로그에 온 걸 환영합니다. 🎉</Banner>
)

const navbar = (
  <Navbar
    logo={<span style={{ marginLeft: '.4em', fontWeight: 900, fontSize: 20 }}>berenickt.log</span>}
    projectLink='https://github.com/berenickt'
  />
)

const footer = <Footer>Berenickt Dev Blog © 2022 ~ {new Date().getFullYear()}</Footer>

export default async function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang='ko' dir='ltr' suppressHydrationWarning>
      <Head />
      <body>
        <Layout
          banner={banner}
          navbar={navbar}
          footer={footer}
          pageMap={await getPageMap()}
          search={<Search placeholder='검색어를 입력해주세요.' />}
          navigation={{ prev: true, next: true }}
          sidebar={{ defaultMenuCollapseLevel: 1, toggleButton: true }}
          editLink={null}
          feedback={{ content: null }}
        >
          {children}
        </Layout>
      </body>
    </html>
  )
}
