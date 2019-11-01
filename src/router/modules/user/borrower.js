// 借款人管理
const borrower = [
  {
    path: 'borrower/personal',
    name: 'user-borrower-personal',
    component: () => import('@/views/user/borrower/personal'),
    meta: {
      title: '个人'
    }
  },
  {
    path: 'borrower/personal/capital',
    name: 'user-borrower-personal-capital',
    hidden: true,
    component: () => import('@/views/base/capitalList'),
    meta: {
      title: '资金记录',
      type: 'borrower'
    }
  },
  {
    path: 'borrower/personal/openAccount',
    name: 'user-borrower-personal-openAccount',
    component: () => import('@/views/user/borrower/openAccount'),
    meta: {
      title: '个人批量开户',
      type: 'personal',
      parent: '/user/borrower/personal'
    }
  },
  {
    path: 'borrower/personal/bid',
    name: 'user-borrower-personal-item-bid',
    component: () => import('@/views/user/borrower/personal-item-bid'),
    meta: {
      title: '个人标的信息',
      parent: '/user/borrower/personal'
    }
  },
  {
    path: 'borrower/enterprise',
    name: 'user-borrower-enterprise',
    component: () => import('@/views/user/borrower/enterprise'),
    meta: {
      title: '企业'
    }
  },
  {
    path: 'borrower/enterprise/openAccount',
    name: 'user-borrower-enterprise-openAccount',
    component: () => import('@/views/user/borrower/openAccount'),
    meta: {
      title: '企业批量开户',
      type: 'enterprise',
      parent: '/user/borrower/enterprise'
    }
  },
  {
    path: 'borrower/enterprise/bid',
    name: 'user-borrower-enterprise-item-bid',
    component: () => import('@/views/user/borrower/personal-item-bid'),
    meta: {
      title: '企业标的信息',
      parent: '/user/borrower/enterprise'
    }
  },
  {
    path: 'borrower/enterprise/capital',
    name: 'user-borrower-enterprise-capital',
    hidden: true,
    component: () => import('@/views/base/capitalList'),
    meta: {
      title: '资金记录',
      type: 'borrower'
    }
  }
]

export default borrower
