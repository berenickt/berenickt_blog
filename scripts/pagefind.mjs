// next build 후 Pagefind 검색 색인 생성.
// 미리 렌더링된 HTML 위치·확장자가 빌드 환경마다 다르다.
//  - 로컬: .next/server/app/**/*.html
//  - Vercel(Next 16): .next/server/route-cache/** (확장자 다름)
// 그래서 .next/server 아래에서 내용이 HTML 문서인 파일을 모두 찾아
// 임시 폴더에 URL 경로대로 .html로 모은 뒤 그 폴더를 색인한다.
// 하나도 찾지 못하면 검색만 비활성화되고 배포는 계속되도록 경고 후 종료한다.
import { execFileSync } from 'node:child_process'
import { mkdirSync, openSync, readFileSync, readSync, closeSync, readdirSync, rmSync, statSync, existsSync, writeFileSync } from 'node:fs'
import { dirname, join, relative, sep } from 'node:path'

const SERVER = '.next/server'
const ROOTS = ['app', 'route-cache']
const STAGE = '.next/pagefind-site'
const OUTPUT = 'public/_pagefind'

function isHtml(file) {
  const fd = openSync(file, 'r')
  const buf = Buffer.alloc(64)
  readSync(fd, buf, 0, 64, 0)
  closeSync(fd)
  return /^\s*<!doctype html/i.test(buf.toString('utf8'))
}

function walk(dir, out = []) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name)
    const s = statSync(p)
    if (s.isDirectory()) walk(p, out)
    else if (s.size > 0 && s.size < 20 * 1024 * 1024) out.push(p)
  }
  return out
}

// 파일 경로 → URL 경로 (확장자·index 정리)
function toUrlPath(root, file) {
  let rel = relative(root, file).split(sep).join('/')
  rel = rel.replace(/(\.html|\.body|\.rsc|\.meta|\.json)+$/i, '')
  // Vercel route-cache: APP_PAGE/<해시>/$/frontend/react → frontend/react
  const marker = rel.lastIndexOf('/$')
  if (marker !== -1) rel = rel.slice(marker + 2).replace(/^\//, '')
  if (rel === 'index' || rel === '') return 'index.html'
  return `${rel}.html`
}

rmSync(STAGE, { recursive: true, force: true })
const seen = new Set()
for (const r of ROOTS) {
  const root = join(SERVER, r)
  if (!existsSync(root)) continue
  const files = walk(root)
  const htmls = files.filter(isHtml)
  console.log(`[pagefind] ${root}: 파일 ${files.length}개, HTML ${htmls.length}개`)
  if (htmls.length === 0 && files.length) console.log('[pagefind]  예시:', files.slice(0, 5).join(', '))
  for (const f of htmls) {
    const target = toUrlPath(root, f)
    if (seen.has(target)) continue
    seen.add(target)
    mkdirSync(dirname(join(STAGE, target)), { recursive: true })
    writeFileSync(join(STAGE, target), readFileSync(f))
  }
}

if (seen.size === 0) {
  console.warn('[pagefind] 색인할 HTML을 찾지 못했습니다. 검색 색인 없이 빌드를 계속합니다.')
  process.exit(0)
}

console.log(`[pagefind] HTML ${seen.size}개 색인`)
execFileSync('pagefind', ['--site', STAGE, '--output-path', OUTPUT], { stdio: 'inherit' })
