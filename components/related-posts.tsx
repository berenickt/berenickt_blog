import Link from 'next/link'
import { getSections } from './all-posts'
import type { PostNode } from './all-posts-list'
import { getPostMeta, normalizeRoute as norm } from '../lib/post-meta'

// 글 하단: 이전/다음 링크 대신, 같은 분류(사이드바 폴더)의 다른 글을 카드 그리드로 보여준다.
type FolderNode = Extract<PostNode, { kind: 'folder' }>
type Card = { title: string; route: string; group?: string }

const MAX_CARDS = 8 // 4열 × 2줄
const MIN_SIBLINGS = 3 // 같은 폴더의 글이 이보다 적으면 한 단계 위 폴더까지 넓힌다.

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'Asia/Seoul',
  })
}

// 현재 글(또는 폴더 페이지)을 담고 있는 폴더들을 바깥 → 안쪽 순서로 찾는다.
function findAncestors(nodes: PostNode[], route: string, path: FolderNode[] = []): FolderNode[] | null {
  for (const n of nodes) {
    if (n.kind === 'page' && norm(n.route) === route) return path
    if (n.kind === 'folder') {
      if (n.route && norm(n.route) === route) return path
      const found = findAncestors(n.children, route, [...path, n])
      if (found) return found
    }
  }
  return null
}

// 폴더 안의 글을 사이드바 순서대로 펼친다. 라벨은 가장 가까운 구분선 또는 하위 폴더 이름.
function flatten(nodes: PostNode[], group?: string, out: Card[] = []): Card[] {
  let current = group
  for (const n of nodes) {
    if (n.kind === 'separator') current = n.title.replace(/^\(\d+\)\s*/, '')
    else if (n.kind === 'page') out.push({ title: n.title, route: n.route, group: current })
    else flatten(n.children, n.title, out)
  }
  return out
}

export async function RelatedPosts({ route }: { route: string }) {
  const current = norm(route)
  const ancestors = findAncestors(await getSections(), current)
  if (!ancestors?.length) return null

  // 가장 가까운 폴더부터 시작해, 글이 너무 적으면 바깥 폴더로 넓힌다.
  let folder = ancestors[ancestors.length - 1]
  let cards = flatten(folder.children)
  for (let i = ancestors.length - 2; i >= 0 && cards.length - 1 < MIN_SIBLINGS; i--) {
    folder = ancestors[i]
    cards = flatten(folder.children)
  }

  // 현재 글 바로 다음 글부터 보여주고, 끝에 닿으면 처음으로 돌아간다. (중복 경로 제거)
  const seen = new Set<string>()
  const unique = cards.filter(c => !seen.has(norm(c.route)) && seen.add(norm(c.route)))
  const index = unique.findIndex(c => norm(c.route) === current)
  const ordered = index === -1 ? unique : [...unique.slice(index + 1), ...unique.slice(0, index)]
  const items = ordered.filter(c => norm(c.route) !== current).slice(0, MAX_CARDS)
  if (!items.length) return null

  return (
    <nav className='related-posts' aria-label='같은 분류의 다른 글'>
      <h2 className='related-posts-title'>
        {folder.route ? <Link href={folder.route}>{folder.title}</Link> : folder.title}
        <span>의 다른 글</span>
      </h2>
      <div className='related-posts-grid'>
        {items.map(item => {
          const { image, date } = getPostMeta(item.route)
          return (
            <Link key={item.route} href={item.route} className='related-card'>
              <div className='related-card-thumb'>
                {image ? (
                  // 외부 이미지 호스트가 다양해서 next/image 대신 일반 img 를 쓴다.
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={image} alt='' loading='lazy' decoding='async' referrerPolicy='no-referrer' />
                ) : (
                  // 이미지가 없는 글: 빈 이미지 자리
                  <svg className='related-card-placeholder' viewBox='0 0 24 24' aria-hidden='true'>
                    <rect x='3' y='4' width='18' height='16' rx='2' />
                    <circle cx='8.5' cy='9.5' r='1.5' />
                    <path d='m21 16-5-5-9 9' />
                  </svg>
                )}
              </div>
              <div className='related-card-body'>
                {item.group && <span className='related-card-group'>{item.group}</span>}
                <strong>{item.title}</strong>
                {date && (
                  <time className='related-card-date' dateTime={date}>
                    {formatDate(date)}
                  </time>
                )}
              </div>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
