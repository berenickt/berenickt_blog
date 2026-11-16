import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import { JetBrains_Mono } from 'next/font/google'
import { Footer, Layout, Navbar } from 'nextra-theme-docs'
import { Head, Search } from 'nextra/components'
import { getPageMap } from 'nextra/page-map'
import 'pretendard/dist/web/variable/pretendardvariable-dynamic-subset.css'
import 'nextra-theme-docs/style.css'
import './globals.css'

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

const navbar = <Navbar logo={logo} projectLink='https://github.com/berenickt' />

const footer = (
  <Footer>
    <div className='flex w-full flex-col items-center gap-1 text-sm sm:flex-row sm:justify-between'>
      <span>Berenickt Dev Blog © 2022 ~ {new Date().getFullYear()}</span>
      <a
        href='https://github.com/berenickt'
        target='_blank'
        rel='noreferrer'
        className='hover:text-[var(--x-color-primary-600)]'
      >
        GitHub ↗
      </a>
    </div>
  </Footer>
)

export default async function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang='ko' dir='ltr' suppressHydrationWarning className={jetbrainsMono.variable}>
      <Head
        // 브랜드 컬러: 인디고/바이올렛 계열
        color={{
          hue: { light: 250, dark: 252 },
          saturation: { light: 75, dark: 85 },
          lightness: { light: 52, dark: 70 },
        }}
      />
      <body>
        <Layout
          navbar={navbar}
          footer={footer}
          pageMap={await getPageMap()}
          search={<Search placeholder='검색어를 입력해주세요.' />}
          navigation={{ prev: true, next: true }}
          sidebar={{ defaultMenuCollapseLevel: 1, toggleButton: true }}
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
