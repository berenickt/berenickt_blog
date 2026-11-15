import Link from 'next/link'
import { getSections } from './all-posts'
import type { PostNode } from './all-posts-list'

// 홈 화면: 분야별로 주제(폴더)·글을 카드 그리드로 보여준다.
type Card = { title: string; href: string; count: number; group?: string }

function firstRoute(nodes: PostNode[]): string | undefined {
  for (const n of nodes) {
    if (n.kind === 'page') return n.route
    if (n.kind === 'folder') {
      const r = firstRoute(n.children)
      if (r) return r
    }
  }
}

function countPages(nodes: PostNode[]): number {
  return nodes.reduce(
    (sum, n) => sum + (n.kind === 'page' ? 1 : n.kind === 'folder' ? countPages(n.children) : 0),
    0,
  )
}

function toCards(nodes: PostNode[]): Card[] {
  const cards: Card[] = []
  let group: string | undefined
  for (const n of nodes) {
    if (n.kind === 'separator') {
      group = n.title.replace(/^\(\d+\)\s*/, '')
    } else if (n.kind === 'page') {
      cards.push({ title: n.title, href: n.route, count: 1, group })
    } else {
      const href = firstRoute(n.children)
      if (href) cards.push({ title: n.title, href, count: countPages(n.children), group })
    }
  }
  return cards
}

export async function HomeGrid() {
  const sections = await getSections()
  return (
    <div className='home-grid-wrap'>
      {sections.map(section =>
        section.kind === 'folder' ? (
          <section key={section.title} className='home-section'>
            <h2>
              {section.route ? <Link href={section.route}>{section.title}</Link> : section.title}
              <span className='all-posts-count'>{countPages(section.children)}</span>
            </h2>
            <div className='home-grid'>
              {toCards(section.children).map(card => (
                <Link key={card.href + card.title} href={card.href} className='home-card'>
                  {card.group && <span className='home-card-group'>{card.group}</span>}
                  <strong>{card.title}</strong>
                  <span className='home-card-count'>{card.count === 1 ? '글 1개' : `글 ${card.count}개`}</span>
                </Link>
              ))}
            </div>
          </section>
        ) : null,
      )}
    </div>
  )
}
