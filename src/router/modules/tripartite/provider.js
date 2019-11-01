const provider = [
  {
    path: 'provider/list',
    name: 'tripartite-provider-list',
    component: () => import('@/views/tripartite/provider/list'),
    meta: {
      title: '助贷机构列表'
    }
  },
  {
    path: 'provider/list/bid',
    name: 'tripartite-provider-list-item-bid',
    hidden: true,
    component: () => import('@/views/tripartite/provider/list-bid'),
    meta: {
      title: '标的列表',
      parent: '/tripartite/provider/list'
    }
  },
  {
    path: 'provider/list/capital',
    name: 'tripartite-provider-list-item-capital',
    hidden: true,
    component: () => import('@/views/base/capitalList'),
    meta: {
      title: '资金记录',
      parent: '/tripartite/provider/list',
      type: 'borrower'
    }
  }
]

export default provider
