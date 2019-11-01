const overview = [
  {
    path: 'overview/platformData',
    name: 'statistics-overview-platformData',
    component: () => import('@/views/statistics/overview/platformData'),
    meta: {
      title: '平台数据'
    }
  },
  {
    path: 'overview/bidData',
    name: 'statistics-overview-bidData',
    component: () => import('@/views/statistics/overview/bidData'),
    meta: {
      title: '标的数据'
    }
  },
  {
    path: 'overview/overdue',
    name: 'statistics-overview-overdue',
    component: () => import('@/views/statistics/overview/overdue'),
    meta: {
      title: '逾期统计'
    }
  },
  {
    path: 'overview/borrower',
    name: 'statistics-overview-borrower',
    component: () => import('@/views/statistics/overview/borrower'),
    meta: {
      title: '借款人统计'
    }
  },
  {
    path: 'overview/borrower/more',
    name: 'statistics-overview-borrower-more',
    component: () => import('@/views/statistics/overview/borrower-more'),
    meta: {
      title: '借款人统计-更多'
    }
  },
  {
    path: 'overview/lender',
    name: 'statistics-overview-lender',
    component: () => import('@/views/statistics/overview/lender'),
    meta: {
      title: '出借人统计'
    }
  },
  {
    path: 'overview/lender/more',
    name: 'statistics-overview-lender-more',
    component: () => import('@/views/statistics/overview/lender-more'),
    meta: {
      title: '出借人统计-更多'
    }
  },
  {
    path: 'overview/channel',
    name: 'statistics-overview-channel',
    component: () => import('@/views/statistics/overview/channel'),
    meta: {
      title: '出借人注册渠道统计'
    }
  }
]

export default overview
