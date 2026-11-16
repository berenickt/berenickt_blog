import { generateStaticParamsFor, importPage } from 'nextra/pages'
import { useMDXComponents as getMDXComponents } from '../../mdx-components'
import { getLastUpdated } from '../../lib/last-updated'

export const generateStaticParams = generateStaticParamsFor('mdxPath')

type PageProps = {
  params: Promise<{ mdxPath?: string[] }>
}

export async function generateMetadata(props: PageProps) {
  const params = await props.params
  const { metadata } = await importPage(params.mdxPath)
  return metadata
}

const Wrapper = getMDXComponents().wrapper

// 자체 히어로/제목이 있는 페이지는 제목·수정일 헤더를 붙이지 않는다.
const NO_HEADER = new Set(['content/index.mdx', 'content/about.mdx', 'content/posts.mdx'])

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'Asia/Seoul',
  })
}

export default async function Page(props: PageProps) {
  const params = await props.params
  const { default: MDXContent, toc, metadata, sourceCode } = await importPage(params.mdxPath)
  // Git 마지막 커밋 대신, 일괄 수정 커밋을 제외한 실제 수정일 (scripts/last-updated.mjs)
  const updated = getLastUpdated(metadata.filePath)
  const showHeader = !NO_HEADER.has(metadata.filePath)

  return (
    // 하단 기본 "Last updated" 표시는 끄고(timestamp 제거) 제목 옆에 직접 표시
    <Wrapper toc={toc} metadata={{ ...metadata, timestamp: undefined }} sourceCode={sourceCode}>
      {showHeader && (
        <header className='page-header'>
          <h1 className='page-title'>{metadata.title}</h1>
          {updated && (
            <time className='page-updated' dateTime={updated}>
              {formatDate(updated)} 수정
            </time>
          )}
        </header>
      )}
      <MDXContent {...props} params={params} />
    </Wrapper>
  )
}
