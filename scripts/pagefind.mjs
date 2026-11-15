// next build 후 Pagefind 검색 색인 생성.
// 빌드 환경(로컬 / Vercel)에 따라 미리 렌더링된 HTML 위치가 다를 수 있어,
// .next 안에서 HTML이 가장 많은 app 디렉터리를 찾아 색인한다.
// HTML을 하나도 찾지 못하면 검색만 비활성화되고 배포는 계속되도록 경고 후 종료한다.
import { execFileSync } from 'node:child_process'
import { existsSync, readdirSync, statSync } from 'node:fs'
import { join } from 'node:path'

const OUTPUT = 'public/_pagefind'
const CANDIDATES = ['.next/server/app', '.next/standalone/.next/server/app', '.vercel/output/static']

function countHtml(dir) {
  let n = 0
  for (const name of readdirSync(dir)) {
    const p = join(dir, name)
    const s = statSync(p)
    if (s.isDirectory()) n += countHtml(p)
    else if (name.endsWith('.html')) n++
  }
  return n
}

const found = CANDIDATES.filter(existsSync).map(dir => ({ dir, count: countHtml(dir) }))
for (const { dir, count } of found) console.log(`[pagefind] ${dir}: HTML ${count}개`)

const best = found.sort((a, b) => b.count - a.count)[0]
if (!best || best.count === 0) {
  if (existsSync('.next/server')) console.warn('[pagefind] .next/server:', readdirSync('.next/server').join(', '))
  console.warn('[pagefind] 색인할 HTML을 찾지 못했습니다. 검색 색인 없이 빌드를 계속합니다.')
  process.exit(0)
}

execFileSync('pagefind', ['--site', best.dir, '--output-path', OUTPUT], { stdio: 'inherit' })
