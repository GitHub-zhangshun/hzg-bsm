const template = [
  {
    path: 'template/list',
    name: 'contract-template-list',
    component: () => import('@/views/contract/template/list'),
    meta: {
      title: '模板列表'
    }
  },
  {
    path: 'template/list/user',
    name: 'contract-template-list-item-user',
    hidden: true,
    component: () => import('@/views/contract/template/list-item-user'),
    meta: {
      title: '签署人管理',
      parent: '/contract/template/list'
    }
  },
  {
    path: 'template/list/key',
    name: 'contract-template-list-item-key',
    hidden: true,
    component: () => import('@/views/contract/template/list-item-key'),
    meta: {
      title: 'KEY管理',
      parent: '/contract/template/list'
    }
  }
]

export default template
