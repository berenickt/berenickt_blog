'use client'

import { useEffect } from 'react'

// 아래로 스크롤하면 헤더를 숨기고, 위로 스크롤하면 다시 보여준다.
// <html> 에 'header-hidden' 클래스만 붙였다 뗐다 하고, 실제 숨김은 globals.css 에서 처리한다.
const HIDDEN = 'header-hidden'
const TOP_ZONE = 64 // 이 높이 안(페이지 맨 위 근처)에서는 항상 보이게
const THRESHOLD = 6 // 이만큼 이상 움직였을 때만 방향을 판단 (미세한 떨림 무시)
const MENU_OPEN = 'x:max-md:overflow-hidden' // Nextra 모바일 메뉴가 열리면 <html> 에 붙는 클래스

export function AutoHideHeader() {
  useEffect(() => {
    const root = document.documentElement
    let lastY = window.scrollY
    let ticking = false

    const update = () => {
      ticking = false
      const y = window.scrollY
      const delta = y - lastY

      if (y < TOP_ZONE || root.classList.contains(MENU_OPEN)) {
        root.classList.remove(HIDDEN)
      } else if (Math.abs(delta) >= THRESHOLD) {
        root.classList.toggle(HIDDEN, delta > 0)
      } else {
        return // 방향 판단 보류: 기준점(lastY)을 유지
      }
      lastY = y
    }

    const onScroll = () => {
      if (!ticking) {
        ticking = true
        requestAnimationFrame(update)
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      root.classList.remove(HIDDEN)
    }
  }, [])

  return null
}
