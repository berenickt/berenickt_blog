import { getPageMap } from 'nextra/page-map'
import { normalizePages } from 'nextra/normalize-pages'
import { AllPostsList, type PostNode } from './all-posts-list'

// 사이드바와 같은 데이터(_meta.js 순서·제목·구분선, 숨김 제외)로 전체 글 트리를 만든다.
type Item = {
  name: string
  route?: string
  title?: unknown
  type?: string
  display?: string
  children?: Item[]
}

export function toNodes(items: Item[]): PostNode[] {
  return items
    .filter(item => item.display !== 'hidden' && item.name !== 'posts' && item.name !== 'about' && item.name !== 'all-posts-link' && item.name !== 'tags-link' && item.name !== 'tags')
    .map(item => {
      const title = typeof item.title === 'string' ? item.title : item.name
      if (item.type === 'separator') return { kind: 'separator', title }
      const children = item.children ? toNodes(item.children) : []
      return children.length
        ? { kind: 'folder', title, route: item.route, children }
        : { kind: 'page', title, route: item.route ?? '/' }
    })
}

export async function getSections() {
  const { directories } = normalizePages({ list: await getPageMap(), route: '/posts' })
  return toNodes(directories as Item[]).filter(n => n.kind === 'folder')
}

export async function AllPosts() {
  const sections = await getSections()
  return <AllPostsList sections={sections} />
}
