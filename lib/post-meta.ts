import { readdirSync, readFileSync } from 'node:fs'
import { join, relative, sep } from 'node:path'
import { getLastUpdated } from './last-updated'

// content/ 의 MDX 파일에서 카드에 쓸 정보(대표 이미지, 날짜)를 뽑는다.
//   - 이미지 : frontmatter 의 image / thumbnail → 없으면 본문의 첫 이미지(코드 블록 안은 제외)
//   - 날짜   : frontmatter 의 작성일(date / created) → 없으면 수정일(.generated/last-updated.json)
//              (수정일은 일괄 커밋 때문에 같은 날짜인 글이 많아 카드에는 작성일이 더 유용하다)
export type PostMeta = { image?: string; date?: string }

const CONTENT_DIR = join(process.cwd(), 'content')
let cache: Map<string, PostMeta> | undefined

export function normalizeRoute(route: string) {
  let r = route
  try {
    r = decodeURIComponent(route)
  } catch {}
  return r.replace(/\/$/, '') || '/'
}

function walk(dir: string, out: string[] = []) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name)
    if (entry.isDirectory()) walk(full, out)
    else if (/\.mdx?$/.test(entry.name)) out.push(full)
  }
  return out
}

function toRoute(file: string) {
  const rel = relative(CONTENT_DIR, file).split(sep).join('/').replace(/\.mdx?$/, '')
  return normalizeRoute('/' + rel.replace(/(^|\/)index$/, ''))
}

function frontMatterValue(fm: string, keys: string[]) {
  for (const key of keys) {
    const m = fm.match(new RegExp(`^${key}:\\s*(.+)$`, 'm'))
    if (m) return m[1].trim().replace(/^['"]|['"]$/g, '')
  }
}

function firstImage(body: string) {
  // 코드 블록(``` / ~~~) 안의 이미지 문법은 무시한다.
  const text = body.replace(/^(```|~~~)[^\n]*\n[\s\S]*?^\1[ \t]*$/gm, '')
  const md = text.match(/!\[[^\]]*\]\(\s*<?([^)\s>]+)>?(?:\s+["'][^)]*["'])?\s*\)/)
  const html = text.match(/<img\b[^>]*\bsrc=["']([^"']+)["']/)
  const candidates = [md, html].filter((m): m is RegExpMatchArray => !!m).sort((a, b) => a.index! - b.index!)
  return candidates[0]?.[1]
}

// 'YYYY/MM/DD' · 'YYYY-MM-DD' → ISO (한국 시간 자정)
function toIsoDate(value?: string) {
  const m = value?.match(/^(\d{4})[-/.](\d{1,2})[-/.](\d{1,2})/)
  if (!m) return undefined
  return `${m[1]}-${m[2].padStart(2, '0')}-${m[3].padStart(2, '0')}T00:00:00+09:00`
}

function load() {
  const map = new Map<string, PostMeta>()
  for (const file of walk(CONTENT_DIR)) {
    const source = readFileSync(file, 'utf8')
    const fmMatch = source.match(/^---\r?\n([\s\S]*?)\r?\n---/)
    const fm = fmMatch?.[1] ?? ''
    const body = fmMatch ? source.slice(fmMatch[0].length) : source
    const image = frontMatterValue(fm, ['image', 'thumbnail', 'cover']) ?? firstImage(body)
    const filePath = relative(process.cwd(), file).split(sep).join('/')
    const date = toIsoDate(frontMatterValue(fm, ['date', 'created'])) ?? getLastUpdated(filePath)
    // 외부 URL 또는 public/ 기준 절대 경로만 카드 이미지로 쓴다. (상대 경로·JSX 표현식 제외)
    const usable = !!image && (/^(https?:)?\/\//.test(image) || image.startsWith('/'))
    map.set(toRoute(file), { image: usable ? image : undefined, date })
  }
  return map
}

export function getPostMeta(route: string): PostMeta {
  if (!cache) cache = load()
  return cache.get(normalizeRoute(route)) ?? {}
}
