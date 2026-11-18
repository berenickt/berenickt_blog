'use client'

import { MoonStar, Sun } from 'lucide-react'
import { useTheme } from 'nextra-theme-docs'

// 헤더의 라이트/다크 모드 전환 버튼 (해·달 아이콘)
// 현재 모드의 아이콘을 보여주고, 누르면 반대 모드로 바꾼다.
// 어떤 아이콘을 보일지는 <html class="dark"> 를 기준으로 CSS 가 정하므로
// 첫 화면에서 아이콘이 잘못 보였다가 바뀌는 깜빡임이 없다. (globals.css 의 .theme-toggle)
export function ThemeToggle() {
  const { setTheme } = useTheme()

  const toggle = () => {
    const isDark = document.documentElement.classList.contains('dark')
    setTheme(isDark ? 'light' : 'dark')
  }

  return (
    <button type='button' className='theme-toggle' onClick={toggle} aria-label='라이트/다크 모드 전환' title='라이트/다크 모드 전환'>
      <Sun className='theme-toggle-light' aria-hidden='true' strokeWidth={2} />
      <MoonStar className='theme-toggle-dark' aria-hidden='true' strokeWidth={2} />
    </button>
  )
}
