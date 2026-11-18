import { LibraryBig, Tags, UserRound } from 'lucide-react'
import NextLink from 'next/link'
import { Footer } from 'nextra-theme-docs'

// 사이트 하단 푸터: [로고 + 소개 문구] [바로가기 링크] / [저작권 · 사용 기술]
// 스타일은 globals.css 의 .site-footer
const LINKS = [
  { href: '/about', label: '소개', Icon: UserRound },
  { href: '/posts', label: '전체 글', Icon: LibraryBig },
  { href: '/tags', label: '태그', Icon: Tags },
]

// lucide 1.x 에는 브랜드 아이콘이 없어서 GitHub 마크만 직접 그린다.
function GitHubMark() {
  return (
    <svg viewBox='0 0 24 24' fill='currentColor' aria-hidden='true'>
      <path d='M12 .5a11.5 11.5 0 0 0-3.64 22.41c.58.1.79-.25.79-.56v-2c-3.2.7-3.88-1.36-3.88-1.36-.52-1.33-1.28-1.69-1.28-1.69-1.05-.71.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.29 1.19-3.1-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.17 1.18a11 11 0 0 1 5.77 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.84 1.19 3.1 0 4.42-2.69 5.39-5.26 5.68.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.56A11.5 11.5 0 0 0 12 .5Z' />
    </svg>
  )
}

export function SiteFooter() {
  const year = new Date().getFullYear()

  return (
    <Footer className='site-footer'>
      <div className='site-footer-inner'>
        <div className='site-footer-top'>
          <div className='site-footer-brand'>
            <NextLink href='/' className='site-footer-logo'>
              berenickt<span>.log</span>
            </NextLink>
            <p>공부하며 정리한 개발 지식과, 개발하면서 겪은 문제와 생각을 기록합니다.</p>
          </div>

          <nav className='site-footer-links' aria-label='바로가기'>
            {LINKS.map(({ href, label, Icon }) => (
              <NextLink key={href} href={href}>
                <Icon aria-hidden='true' strokeWidth={1.9} />
                {label}
              </NextLink>
            ))}
            <a href='https://github.com/berenickt' target='_blank' rel='noreferrer'>
              <GitHubMark />
              GitHub
            </a>
          </nav>
        </div>

        <div className='site-footer-bottom'>
          <span>© 2022–{year} Berenickt. All rights reserved.</span>
          <span>
            Built with{' '}
            <a href='https://nextra.site' target='_blank' rel='noreferrer'>
              Nextra
            </a>{' '}
            &amp;{' '}
            <a href='https://nextjs.org' target='_blank' rel='noreferrer'>
              Next.js
            </a>
          </span>
        </div>
      </div>
    </Footer>
  )
}
