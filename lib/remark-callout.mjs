// Obsidian 스타일 콜아웃을 HTML로 바꾸는 remark 플러그인.
//
//  > [!quote] 레오나르도 다빈치          <div class="callout callout-quote">
//  > **단순함이야말로 ...**        →      <div class="callout-title">레오나르도 다빈치</div>
//  > *Simplicity is ...*                  <div class="callout-content">...</div>
//                                        </div>
//
// - 첫 줄의 [!종류] 뒤에 오는 글이 제목이 된다. (중첩 콜아웃도 처리)
// - 제목 없는 GitHub 알림(> [!NOTE] 등)은 Nextra 기본 Callout이 처리하도록 그대로 둔다.
const CALLOUT_RE = /^\[!([\w-]+)\][+-]?[ \t]*/
const GITHUB_ALERTS = new Set(['note', 'tip', 'important', 'warning', 'caution'])

function toCallout(node) {
  const first = node.children[0]
  if (first?.type !== 'paragraph') return
  const head = first.children[0]
  if (head?.type !== 'text') return
  const match = head.value.match(CALLOUT_RE)
  if (!match) return

  const type = match[1].toLowerCase()
  head.value = head.value.slice(match[0].length)

  // 첫 줄바꿈 전까지가 제목, 나머지는 본문
  const title = []
  const rest = [...first.children]
  while (rest.length) {
    const child = rest.shift()
    if (child.type === 'text' && child.value.includes('\n')) {
      const i = child.value.indexOf('\n')
      const before = child.value.slice(0, i)
      const after = child.value.slice(i + 1)
      if (before) title.push({ ...child, value: before })
      if (after) rest.unshift({ ...child, value: after })
      break
    }
    if (child.type === 'break') break
    title.push(child)
  }

  if (!title.length && GITHUB_ALERTS.has(type) && !rest.length) {
    head.value = match[0] + head.value // 되돌리고 Nextra에 맡김
    return
  }

  const body = rest.length ? [{ ...first, children: rest }, ...node.children.slice(1)] : node.children.slice(1)
  const label = title.length ? title : [{ type: 'text', value: type[0].toUpperCase() + type.slice(1) }]

  node.data = { hName: 'div', hProperties: { className: ['callout', `callout-${type}`], dataCallout: type } }
  node.children = [
    { type: 'paragraph', data: { hName: 'div', hProperties: { className: ['callout-title'] } }, children: label },
    ...(body.length
      ? [{ type: 'blockquote', data: { hName: 'div', hProperties: { className: ['callout-content'] } }, children: body }]
      : []),
  ]
}

export function remarkCallout() {
  return tree => {
    const walk = node => {
      if (node.type === 'blockquote') toCallout(node)
      node.children?.forEach(walk)
    }
    walk(tree)
  }
}
