/** 业务基础页面路由 */
const base = [
  {
    path: 'base/info',
    name: 'bus-base-info',
    hidden: true,
    component: () => import('@/views/business/base/info'),
    meta: {
      title: '标的详情'
    }
  },
  {
    path: 'base/log',
    name: 'bus-base-log',
    hidden: true,
    component: () => import('@/views/business/base/log'),
    meta: {
      title: '操作记录'
    }
  },
  {
    path: 'base/repaymentPlan',
    name: 'bus-base-repaymentPlan',
    hidden: true,
    component: () => import('@/views/business/base/repaymentPlan'),
    meta: {
      title: '还款计划'
    }
  },
  {
    path: 'base/bidInvestLog',
    name: 'bus-base-bidInvestLog',
    hidden: true,
    component: () => import('@/views/business/base/bidInvestLog'),
    meta: {
      title: '标的投标记录'
    }
  }
]

export default base
