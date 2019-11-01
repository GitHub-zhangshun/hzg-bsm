const award = [
  {
    path: 'award/user',
    name: 'operation-award-user',
    component: () => import('@/views/operation/award/user'),
    meta: {
      title: '用户列表'
    }
  },
  {
    path: 'award/user/list',
    name: 'operation-award-user-item-list',
    hidden: true,
    component: () => import('@/views/operation/award/user-item-list'),
    meta: {
      title: '邀请明细'
    }
  },
  {
    path: 'award/user/awardInfo',
    name: 'operation-award-user-item-awardInfo',
    hidden: true,
    component: () => import('@/views/operation/award/user-item-awardInfo'),
    meta: {
      title: '奖励明细'
    }
  }
]

export default award
