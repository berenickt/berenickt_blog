export default {
  frontend: {
    title: 'Frontend',
    type: 'page',
  },
  backend: {
    title: 'Backend',
    type: 'page',
  },
  devops: {
    title: 'DevOps',
    type: 'page',
  },
  mobile: {
    title: 'Mobile',
    type: 'page',
  },
  cs: {
    title: 'CS',
    type: 'page',
  },
  languages: {
    title: 'Languages',
    type: 'page',
  },
  books: {
    title: 'Books',
    type: 'page',
  },
  memo: {
    title: 'Memo',
    type: 'page',
  },
  posts: {
    title: '전체 글',
    type: 'page',
    display: 'hidden', // 헤더 메뉴에서는 숨기고 사이드바 링크로 들어간다
    theme: {
      sidebar: false,
      toc: false,
      pagination: false,
    },
  },
  tags: {
    title: '태그',
    type: 'page',
    display: 'hidden', // 헤더 메뉴에서는 숨기고 사이드바 링크로 들어간다
    theme: {
      sidebar: false,
      toc: false,
      pagination: false,
    },
  },
  about: {
    title: '소개',
    type: 'page',
    display: 'hidden',
    theme: {
      typesetting: 'article',
    },
  },
  index: {
    title: 'Home',
    display: 'hidden',
    type: 'page',
    theme: {
      typesetting: 'article',
    },
  },
}
