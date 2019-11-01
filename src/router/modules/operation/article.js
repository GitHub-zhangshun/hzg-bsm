const article = [
  {
    path: 'article/add',
    name: 'operation-article-base-add',
    component: () => import('@/views/operation/article/base/add'),
    hidden: true,
    meta: {
      title: '文章新增'
    }
  },
  {
    path: 'article/edit',
    name: 'operation-article-base-edit',
    component: () => import('@/views/operation/article/base/edit'),
    hidden: true,
    meta: {
      title: '文章修改'
    }
  },
  {
    path: 'article/announcement',
    name: 'operation-article-announcement',
    component: () => import('@/views/operation/article/list'),
    meta: {
      title: '公告管理',
      simplify: 'platform_article_affiche',
      name: '公告类型'
    }
  },
  {
    path: 'article/protocol',
    name: 'operation-article-protocol',
    component: () => import('@/views/operation/article/list'),
    meta: {
      title: '协议管理',
      simplify: 'platform_article_agreement',
      name: '协议类型'
    }
  },
  {
    path: 'article/other',
    name: 'operation-article-other',
    component: () => import('@/views/operation/article/list'),
    meta: {
      title: '其他管理',
      simplify: 'platform_article_other',
      name: '其他类型'
    }
  }
]

export default article
