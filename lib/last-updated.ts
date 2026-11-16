import { readFileSync } from 'node:fs'
import { join } from 'node:path'

// scripts/last-updated.mjs 가 만든 { 'content/…/글.mdx': ISO 날짜 } 맵
let cache: Record<string, string> | undefined

export function getLastUpdated(filePath?: string): string | undefined {
  if (!filePath) return undefined
  if (!cache) {
    try {
      cache = JSON.parse(readFileSync(join(process.cwd(), '.generated/last-updated.json'), 'utf8'))
    } catch {
      cache = {}
    }
  }
  return cache![filePath]
}
