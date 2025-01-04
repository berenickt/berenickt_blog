import { HighlightedCode, Pre } from 'codehike/code'
import { callout } from './annotations/callout'
import { lineNumbers } from './line-numbers'
import { CopyButton } from './button'

export function Code({ codeblock }: { codeblock: HighlightedCode }) {
  return (
    <div className='my-1'>
      {codeblock.meta && (
        <div className='bg-neutral-800 text-zinc-400 text-sm px-2 py-1 rounded-t-lg flex justify-between items-center'>
          <div className='text-'>{codeblock.meta}</div>
          <CopyButton text={codeblock.code} />
        </div>
      )}
      <Pre
        code={codeblock}
        handlers={[callout, lineNumbers]}
        className='border border-zinc-500/50 rounded-b-lg py-2 px-1 my-0 text-sm overflow-x-auto'
        style={codeblock.style}
      />
    </div>
  )
}
