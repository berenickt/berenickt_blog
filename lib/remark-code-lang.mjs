// Code Hike 가 모르는 코드블록 언어를 미리 정리하는 remark 플러그인.
// (그대로 두면 빌드할 때마다 "Code Hike warning: Unknown language" 경고가 뜬다)
//
//  ```.env            → dotenv 로 하이라이팅, 헤더에는 ".env" 표시
//  ```어쩌구.conf      → nginx
//  ```assembly / react → asm / jsx
//  ```pseudocode      → 일반 텍스트, 헤더에는 "pseudocode" 표시
//  ```(언어 없음)       → txt
import { LANG_NAMES } from '@code-hike/lighter'

const KNOWN = new Set(LANG_NAMES)
const ALIASES = { assembly: 'asm', react: 'jsx' }
const BY_EXTENSION = { env: 'dotenv', conf: 'nginx', txt: 'txt' }

function resolve(lang) {
  if (ALIASES[lang]) return { lang: ALIASES[lang] }
  // 파일명을 언어 자리에 적은 경우: 확장자로 언어를 고르고 파일명은 헤더 제목으로 쓴다.
  const ext = lang.includes('.') ? lang.split('.').pop().toLowerCase() : ''
  const byExt = BY_EXTENSION[ext] ?? (KNOWN.has(ext) ? ext : 'txt')
  return { lang: byExt, title: lang }
}

export function remarkCodeLang() {
  return tree => {
    const walk = node => {
      // 언어를 안 적은 코드블록: Code Hike 도 결국 txt 로 처리하므로 미리 지정 (경고만 없앰)
      if (node.type === 'code' && !node.lang) node.lang = 'txt'
      else if (node.type === 'code' && !KNOWN.has(node.lang)) {
        const { lang, title } = resolve(node.lang)
        if (title && !node.meta) node.meta = title
        node.lang = lang
      }
      node.children?.forEach(walk)
    }
    walk(tree)
  }
}
