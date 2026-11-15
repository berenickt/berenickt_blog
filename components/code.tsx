import { HighlightedCode, Pre } from 'codehike/code'
import { callout } from './annotations/callout'
import { lineNumbers } from './line-numbers'
import { CopyButton } from './button'

export function Code({ codeblock }: { codeblock: HighlightedCode }) {
  // meta(파일명 등)가 없으면 언어 이름을 헤더에 표시
  const title = codeblock.meta || codeblock.lang

  return (
    <div className='my-4 overflow-hidden rounded-xl border border-zinc-700/60 bg-[#1e1e1e] shadow-lg shadow-black/10'>
      <div className='flex items-center justify-between border-b border-zinc-700/60 bg-[#252526] px-3 py-1.5 text-xs text-zinc-400'>
        <div className='flex items-center gap-2'>
          <span className='flex gap-1.5' aria-hidden>
            <span className='size-2.5 rounded-full bg-[#ff5f57]/80' />
            <span className='size-2.5 rounded-full bg-[#febc2e]/80' />
            <span className='size-2.5 rounded-full bg-[#28c840]/80' />
          </span>
          {title && <span className='ml-1 font-mono'>{title}</span>}
        </div>
        <CopyButton text={codeblock.code} />
      </div>
      <Pre
        code={codeblock}
        handlers={[callout, lineNumbers]}
        className='m-0 overflow-x-auto px-2 py-3 text-[13px] leading-relaxed'
        style={{ ...codeblock.style, background: 'transparent' }}
      />
    </div>
  )
}
