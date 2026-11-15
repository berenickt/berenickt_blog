'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'

export type PostNode =
  | { kind: 'separator'; title: string }
  | { kind: 'page'; title: string; route: string }
  | { kind: 'folder'; title: string; route?: string; children: PostNode[] }

function countPages(nodes: PostNode[]): number {
  return nodes.reduce(
    (sum, n) => sum + (n.kind === 'page' ? 1 : n.kind === 'folder' ? countPages(n.children) : 0),
    0,
  )
}

// 검색어와 일치하는 글(또는 폴더명이 일치하면 그 폴더 전체)만 남긴다.
function filterNodes(nodes: PostNode[], q: string): PostNode[] {
  if (!q) return nodes
  const out: PostNode[] = []
  for (const n of nodes) {
    if (n.kind === 'separator') continue
    const hit = n.title.toLowerCase().includes(q)
    if (n.kind === 'page') {
      if (hit) out.push(n)
    } else if (hit) {
      out.push(n)
    } else {
      const children = filterNodes(n.children, q)
      if (children.length) out.push({ ...n, children })
    }
  }
  return out
}

// 폴더는 기본으로 접혀 있고, 검색 중일 때만 결과가 보이도록 펼친다.
function Tree({ nodes, expanded }: { nodes: PostNode[]; expanded: boolean }) {
  return (
    <ul className='all-posts-tree'>
      {nodes.map((n, i) => {
        if (n.kind === 'separator') {
          return (
            <li key={i} className='all-posts-separator'>
              {n.title}
            </li>
          )
        }
        if (n.kind === 'page') {
          return (
            <li key={n.route}>
              <Link href={n.route}>{n.title}</Link>
            </li>
          )
        }
        return (
          <li key={n.route ?? i}>
            <details open={expanded}>
              <summary>
                {n.title} <span className='all-posts-count'>{countPages(n.children)}</span>
              </summary>
              <Tree nodes={n.children} expanded={expanded} />
            </details>
          </li>
        )
      })}
    </ul>
  )
}

export function AllPostsList({ sections }: { sections: PostNode[] }) {
  const [query, setQuery] = useState('')
  const q = query.trim().toLowerCase()
  const filtered = useMemo(() => filterNodes(sections, q), [sections, q])
  const total = countPages(sections)

  return (
    <div className='all-posts'>
      <div className='all-posts-toolbar'>
        <input
          type='search'
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder={`제목으로 찾기 (전체 ${total}개)`}
          aria-label='글 제목으로 찾기'
        />
      </div>

      {filtered.length === 0 && <p className='all-posts-empty'>일치하는 글이 없습니다.</p>}

      {filtered.map(section =>
        section.kind === 'folder' ? (
          <section key={section.route ?? section.title} className='all-posts-section'>
            <h2>
              {section.route ? <Link href={section.route}>{section.title}</Link> : section.title}
              <span className='all-posts-count'>{countPages(section.children)}</span>
            </h2>
            <Tree nodes={section.children} expanded={!!q} />
          </section>
        ) : null,
      )}
    </div>
  )
}
