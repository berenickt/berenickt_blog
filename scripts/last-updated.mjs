// 각 글(content/**/*.mdx)의 "마지막 수정일"을 Git 기록에서 계산해 JSON으로 저장한다.
// (predev / prebuild 에서 실행, 결과는 app/[[...mdxPath]]/page.tsx 에서 사용)
//
// Nextra 기본 기능은 파일의 마지막 커밋 날짜를 그대로 쓰는데,
// 마이그레이션·폴더명 정리처럼 거의 모든 글을 건드린 일괄 커밋 때문에
// 모든 글이 같은 날짜로 표시된다. 그래서 IGNORED_COMMITS 는 건너뛰고,
// 이름 변경(rename)을 따라가며 실제로 내용을 수정한 커밋 날짜를 찾는다.
//
// 앞으로 내용과 무관한 일괄 수정 커밋은 커밋 메시지 제목에 [no-date] 를 넣거나
// 여기에 해시를 추가하면 된다.
import { execFileSync } from 'node:child_process'
import { mkdirSync, readdirSync, statSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'

const IGNORED_COMMITS = [
  '63c699f', // UPGRADE: Next 16, React 19, Nextra 4, Tailwind 4 (pages → content 이동)
  'c3b12f6', // UPDATE: 블로그 디자인 개선 및 memo 정리
  'fea91bb', // UPDATE: 홈 그리드·전체 글 페이지, 폴더명 정리, 헤더 개선
]
const IGNORE_MARK = '[no-date]'
const CONTENT = 'content'
const OUTPUT = '.generated/last-updated.json'

const git = (...args) =>
  execFileSync('git', args, { encoding: 'utf8', maxBuffer: 256 * 1024 * 1024 })

function listMdx(dir, out = []) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name)
    if (statSync(p).isDirectory()) listMdx(p, out)
    else if (/\.mdx?$/.test(name)) out.push(p.split('\\').join('/'))
  }
  return out
}

function compute() {
  const files = listMdx(CONTENT)
  const result = {}

  try {
    if (git('rev-parse', '--is-shallow-repository').trim() === 'true') {
      try {
        git('fetch', '--unshallow', '--quiet')
      } catch {
        console.warn('[last-updated] 얕은 clone이라 전체 기록을 가져오지 못했습니다. 날짜가 부정확할 수 있습니다.')
        console.warn('[last-updated] Vercel이라면 환경 변수 VERCEL_DEEP_CLONE=true 를 설정하세요.')
      }
    }

    const ignored = IGNORED_COMMITS.map((h) => git('rev-parse', h).trim())
    const isIgnored = (hash, subject) => ignored.includes(hash) || subject.includes(IGNORE_MARK)

    // 최신 → 과거 순으로 훑으며 이름 변경을 거꾸로 추적한다.
    const log = git(
      '-c', 'diff.renameLimit=100000',
      'log', '-M', '--name-status', '--format=@@%H %cI %s', '--', CONTENT, 'pages',
    )
    const tracking = new Map(files.map((f) => [f, f])) // 과거 시점의 경로 → 현재 파일
    const fallback = {} // 무시된 커밋밖에 없을 때 쓸 날짜 (파일을 처음 만든 날)

    let hash = ''
    let date = ''
    let subject = ''
    for (const line of log.split('\n')) {
      if (line.startsWith('@@')) {
        ;[hash, date, ...subject] = line.slice(2).split(' ')
        subject = subject.join(' ')
        continue
      }
      if (!line.trim()) continue
      const [status, a, b] = line.split('\t')
      const path = status.startsWith('R') || status.startsWith('C') ? b : a
      const file = tracking.get(path)
      if (!file) continue

      if (isIgnored(hash, subject)) fallback[file] = date // 가장 오래된(=처음 만든) 날짜가 남는다
      else result[file] ??= date

      if (status.startsWith('R')) {
        tracking.delete(path)
        tracking.set(a, file)
      } else if (status === 'A') {
        tracking.delete(path)
      }
    }
    for (const f of files) result[f] ??= fallback[f]

    // 아직 커밋하지 않은(새로 만들었거나 수정 중인) 글은 파일 수정 시각을 쓴다.
    const dirty = git('status', '--porcelain', '--untracked-files=all', '--', CONTENT)
      .split('\n')
      .filter(Boolean)
      .map((l) => l.slice(3).replace(/^.* -> /, '').replace(/^"|"$/g, ''))
    for (const f of dirty) {
      if (files.includes(f)) result[f] = statSync(f).mtime.toISOString()
    }
  } catch (error) {
    console.warn(`[last-updated] Git 기록을 읽지 못해 날짜를 생략합니다: ${error.message}`)
  }

  return result
}

const result = compute()
mkdirSync(dirname(OUTPUT), { recursive: true })
writeFileSync(OUTPUT, JSON.stringify(result, null, 2))
console.log(`[last-updated] ${Object.keys(result).length}개 글의 수정일을 계산했습니다.`)
