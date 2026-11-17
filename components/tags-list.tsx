'use client'

import Link from 'next/link'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useMemo } from 'react'

export type TaggedPost = { route: string; title: string; section: string; tags: string[] }

export function TagsList({ posts }: { posts: TaggedPost[] }) {
  const selected = useSearchParams().get('tag')
  const router = useRouter()
  const pathname = usePathname()

  // 태그별 글 수 (많은 순 → 이름순)
  const tags = useMemo(() => {
    const count = new Map<string, number>()
    for (const p of posts) for (const t of p.tags) count.set(t, (count.get(t) ?? 0) + 1)
    return [...count].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0], 'ko'))
  }, [posts])

  // 태그를 고르기 전에는 글 목록을 보여주지 않는다.
  const shown = useMemo(
    () =>
      selected
        ? posts.filter(p => p.tags.includes(selected)).sort((a, b) => a.title.localeCompare(b.title, 'ko'))
        : [],
    [posts, selected],
  )

  const select = (tag: string | null) =>
    router.replace(tag ? `${pathname}?tag=${encodeURIComponent(tag)}` : pathname, { scroll: false })

  if (!tags.length) {
    return (
      <p className='all-posts-empty'>
        아직 태그가 달린 글이 없습니다. 글 frontmatter 에 <code>tags: [React, Hooks]</code> 처럼 추가해 보세요.
      </p>
    )
  }

  return (
    <div className='tags-page'>
      <div className='tag-cloud' role='list'>
        {tags.map(([tag, n]) => (
          <button
            key={tag}
            type='button'
            className='tag-chip'
            aria-pressed={selected === tag}
            onClick={() => select(selected === tag ? null : tag)}
          >
            #{tag} <span className='all-posts-count'>{n}</span>
          </button>
        ))}
      </div>

      {selected && (
        <>
          <h2 className='tags-heading'>
            #{selected}
            <span className='all-posts-count'>{shown.length}</span>
          </h2>

          {shown.length === 0 ? (
            <p className='all-posts-empty'>이 태그가 달린 글이 없습니다.</p>
          ) : (
            <ul className='tags-posts'>
              {shown.map(p => (
                <li key={p.route}>
                  <Link href={p.route} className='tags-post-title'>
                    {p.title}
                  </Link>
                  {p.section && <span className='tags-post-section'>{p.section}</span>}
                  <span className='tags-post-tags'>
                    {p.tags.map(t => (
                      <button key={t} type='button' className='tag-mini' onClick={() => select(t)}>
                        #{t}
                      </button>
                    ))}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </div>
  )
}
