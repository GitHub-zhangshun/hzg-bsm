const account = [
  {
    path: 'account/list',
    name: 'contract-account-list',
    component: () => import('@/views/contract/account/list'),
    meta: {
      title: '账户列表'
    }
  },
  {
    path: 'account/list/signature',
    name: 'contract-account-list-signature',
    hidden: true,
    component: () => import('@/views/contract/account/list-item-signature'),
    meta: {
      title: '签章管理'
    }
  }
]

export default account
