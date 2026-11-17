import { Suspense } from 'react'
import { getPageMap } from 'nextra/page-map'
import { TagsList, type TaggedPost } from './tags-list'

// 글의 frontmatter 에 적은 tags 로 태그 목록을 만든다.
//   ---
//   title: 'React Hooks'
//   tags: [React, Hooks]      ← 배열, 또는 'React, Hooks' 처럼 쉼표 구분 문자열
//   ---
type PageMapItem = {
  name?: string
  route?: string
  title?: unknown
  frontMatter?: { title?: unknown; tags?: unknown }
  children?: PageMapItem[]
}

export function normalizeTags(tags: unknown): string[] {
  const list = Array.isArray(tags) ? tags : typeof tags === 'string' ? tags.split(',') : []
  return [...new Set(list.map(t => String(t).trim()).filter(Boolean))]
}

const SECTION_TITLES: Record<string, string> = {
  frontend: 'Frontend',
  backend: 'Backend',
  devops: 'DevOps',
  mobile: 'Mobile',
  cs: 'CS',
  languages: 'Languages',
  memo: 'Memo',
}

function collect(items: PageMapItem[], out: TaggedPost[] = []) {
  for (const item of items) {
    if (item.children) collect(item.children, out)
    const tags = normalizeTags(item.frontMatter?.tags)
    if (!item.route || !tags.length) continue
    const fm = item.frontMatter!
    const title =
      typeof fm.title === 'string' ? fm.title : typeof item.title === 'string' ? item.title : item.name!
    const section = SECTION_TITLES[item.route.split('/')[1]] ?? ''
    out.push({ route: item.route, title, section, tags })
  }
  return out
}

export async function Tags() {
  const posts = collect((await getPageMap()) as PageMapItem[])
  return (
    // 선택한 태그를 ?tag= 쿼리로 읽기 때문에 Suspense 가 필요하다.
    <Suspense>
      <TagsList posts={posts} />
    </Suspense>
  )
}
