const activity = [
  {
    path: 'activity/list',
    name: 'operation-activity-list',
    component: () => import('@/views/operation/activity/list'),
    meta: {
      title: '活动列表'
    }
  },
  {
    path: 'activity/list-prize',
    name: 'operation-activity-list-prize',
    component: () => import('@/views/operation/activity/list-prize'),
    meta: {
      title: '奖品列表',
      parent: '/operation/activity/list'
    }
  },
  {
    path: 'activity/list-prize-coupon',
    name: 'operation-activity-list-prize-coupon',
    component: () => import('@/views/operation/activity/list-prize-coupon'),
    meta: {
      title: '优惠券列表',
      parent: '/operation/activity/list'
    }
  },
  {
    path: 'activity/prizeDic',
    name: 'operation-activity-prizeDic',
    component: () => import('@/views/operation/activity/prizeDic'),
    meta: {
      title: '奖品字典'
    }
  },
  {
    path: 'activity/exhibitors',
    name: 'operation-activity-exhibitors',
    component: () => import('@/views/operation/activity/exhibitors'),
    meta: {
      title: '中奖记录'
    }
  }
]

export default activity
