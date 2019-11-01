const provider = [
  {
    path: 'provider/bidStatistics',
    name: 'statistics-provider-bidStatistics',
    component: () => import('@/views/statistics/provider/bidStatistics'),
    meta: {
      title: '发标统计'
    }
  },
  {
    path: 'provider/bidStatistics/cash',
    name: 'statistics-provider-bidStatistics-cash',
    component: () => import('@/views/statistics/provider/bidStatistics-cash'),
    meta: {
      title: '兑付明细'
    }
  },
  {
    path: 'provider/bidStatistics/bid',
    name: 'statistics-provider-bidStatistics-bid',
    component: () => import('@/views/statistics/provider/bidStatistics-bid'),
    meta: {
      title: '发标明细'
    }
  },
  {
    path: 'provider/rechargeStatistics',
    name: 'statistics-provider-rechargeStatistics',
    component: () => import('@/views/statistics/provider/rechargeStatistics'),
    meta: {
      title: '充值统计'
    }
  }
]

export default provider
