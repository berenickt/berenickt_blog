'use client'

import { LibraryBig, Tags } from 'lucide-react'
import NextLink from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'

// 데스크톱 좌측 사이드바 맨 위 한 줄: [전체 글] [태그] ······ [사이드바 접기]
// Nextra 가 만드는 사이드바 접기 버튼 줄(.nextra-sidebar-footer, CSS 로 맨 위로 올림)에
// 아이콘 링크를 portal 로 끼워 넣는다. 사이드바 목록의 원래 '전체 글'·'태그' 항목은
// globals.css 에서 데스크톱 사이드바에서만 숨긴다. (모바일 메뉴에는 그대로 보임)
const LINKS = [
  { href: '/posts', label: '전체 글', Icon: LibraryBig },
  { href: '/tags', label: '태그', Icon: Tags },
]

const FOOTER = 'aside.nextra-sidebar .nextra-sidebar-footer'

export function SidebarQuickLinks() {
  const pathname = usePathname()
  const [target, setTarget] = useState<Element | null>(null)

  useEffect(() => {
    // 사이드바가 없는 페이지도 있고, 페이지 이동 시 다시 그려질 수 있어서 계속 지켜본다.
    const sync = () => {
      const el = document.querySelector(FOOTER)
      setTarget(prev => (prev === el ? prev : el))
    }
    sync()
    const observer = new MutationObserver(sync)
    observer.observe(document.body, { childList: true, subtree: true })
    return () => observer.disconnect()
  }, [])

  if (!target) return null

  return createPortal(
    <div className='sidebar-quick-links'>
      {LINKS.map(({ href, label, Icon }) => {
        const active = pathname === href || pathname.startsWith(`${href}/`)
        return (
          <NextLink
            key={href}
            href={href}
            className='sidebar-icon-button'
            aria-label={label}
            title={label}
            aria-current={active ? 'page' : undefined}
          >
            <Icon aria-hidden='true' strokeWidth={1.9} />
          </NextLink>
        )
      })}
    </div>,
    target,
  )
}
