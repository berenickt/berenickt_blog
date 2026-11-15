# 베르닉트 개발 블로그

Next.js 16 (App Router) + Nextra 4 + React 19 + Tailwind CSS 4 + Code Hike

```bash
$ pnpm i
$ pnpm dev     # 개발 서버
$ pnpm build   # 프로덕션 빌드 + pagefind 검색 인덱스 생성
$ pnpm start
```

## 폴더 구조

```
app/
  layout.tsx              # 전역 레이아웃 (Navbar, Footer, Banner, 사이드바 설정)
  [[...mdxPath]]/page.tsx # content/ 의 MDX 를 렌더링하는 catch-all 라우트
  globals.css             # Tailwind + 블로그 커스텀 스타일
content/                  # 글(MDX)과 _meta.js (사이드바/네비게이션 구성)
components/               # Code Hike 코드블록 등 커스텀 컴포넌트
mdx-components.tsx        # MDX 컴포넌트 매핑 (Nextra 테마 + Code)
public/                   # 정적 파일 (favicon 등)
```

> 검색(pagefind)은 `pnpm build` 후 생성되므로, `pnpm dev` 에서 검색을 쓰려면 한 번 빌드해야 합니다.
