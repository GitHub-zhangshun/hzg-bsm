const factoring = [
  {
    path: 'factoring/list',
    name: 'tripartite-factoring-list',
    component: () => import('@/views/tripartite/factoring/list'),
    meta: {
      title: '保理机构列表'
    }
  },
  {
    path: 'factoring/list/bid',
    name: 'tripartite-factoring-list-item-bid',
    hidden: true,
    component: () => import('@/views/tripartite/factoring/list-bid'),
    meta: {
      title: '标的列表',
      parent: '/tripartite/factoring/list'
    }
  }
]

export default factoring
