const user = [
  {
    path: 'user/lender',
    name: 'statistics-user-lender',
    component: () => import('@/views/statistics/user/lender'),
    meta: {
      title: '出借人统计分析'
    }
  },
  {
    path: 'user/lender/info',
    name: 'statistics-user-lender-info',
    hidden: true,
    component: () => import('@/views/base/userInfo'),
    meta: {
      title: '出借人详情',
      parent: '/statistics/user/lender'
    }
  },
  {
    path: 'user/lender/invest',
    name: 'statistics-user-lender-invest',
    hidden: true,
    component: () => import('@/views/base/investList'),
    meta: {
      title: '投标记录',
      parent: '/statistics/user/lender'
    }
  },
  {
    path: 'user/lender/capital',
    name: 'statistics-user-lender-capital',
    hidden: true,
    component: () => import('@/views/base/capitalList'),
    meta: {
      title: '资金记录',
      type: 'investor',
      parent: '/statistics/user/lender'
    }
  },
  {
    path: 'user/capital',
    name: 'statistics-user-capital',
    component: () => import('@/views/statistics/user/capital'),
    meta: {
      title: '出借人资金分析'
    }
  },
  {
    path: 'user/paymentPlan',
    name: 'statistics-user-paymentPlan',
    component: () => import('@/views/statistics/user/paymentPlan'),
    meta: {
      title: '出借人回款计划'
    }
  },
  {
    path: 'user/borrower',
    name: 'statistics-user-borrower',
    component: () => import('@/views/statistics/user/borrower'),
    meta: {
      title: '借款人统计分析'
    }
  },
  {
    path: 'user/borrower/bid',
    name: 'statistics-user-borrower-bid',
    component: () => import('@/views/user/borrower/personal-item-bid'),
    meta: {
      title: '借款记录',
      parent: '/statistics/user/borrower'
    }
  }
]

export default user
