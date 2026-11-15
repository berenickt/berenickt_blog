import type { MDXComponents } from 'nextra/mdx-components'
import { useMDXComponents as getThemeComponents } from 'nextra-theme-docs'
import { Code } from './components/code'

const themeComponents = getThemeComponents()

export function useMDXComponents(components?: MDXComponents) {
  return {
    ...themeComponents,
    // Code Hike가 코드블록을 <Code /> 로 변환
    Code,
    ...components,
  }
}
