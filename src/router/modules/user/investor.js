// 出借人管理
const investor = [
  {
    path: 'investor/group',
    name: 'user-investor-group',
    component: () => import('@/views/user/investor/group'),
    meta: {
      title: '分组管理'
    }
  },
  {
    path: 'investor/group/investor',
    name: 'user-investor-group-investor',
    component: () => import('@/views/user/investor/group-item-investor'),
    meta: {
      title: '分组-查看出借人',
      parent: '/user/investor/group'
    }
  },
  {
    path: 'investor/list',
    name: 'user-investor-list',
    component: () => import('@/views/user/investor/list'),
    meta: {
      title: '所有出借人'
    }
  },
  {
    path: 'investor/changeBank',
    name: 'user-investor-changeBank',
    component: () => import('@/views/user/investor/changeBank'),
    meta: {
      title: '换卡记录'
    }
  },
  {
    path: 'investor/list/invest',
    name: 'user-investor-list-item-invest',
    hidden: true,
    component: () => import('@/views/base/investList'),
    meta: {
      title: '投标记录',
      parent: '/user/investor/list'
    }
  },
  {
    path: 'investor/list/capital',
    name: 'user-investor-list-item-capital',
    hidden: true,
    component: () => import('@/views/base/capitalList'),
    meta: {
      title: '资金记录',
      type: 'investor'
      // parent: '/user/investor/list'
    }
  },
  {
    path: 'investor/list/info',
    name: 'user-investor-list-item-info',
    hidden: true,
    component: () => import('@/views/base/userInfo'),
    meta: {
      title: '出借人详情',
      parent: '/user/investor/list'
    }
  },
  {
    path: 'investor/list/riskInfo',
    name: 'user-investor-list-item-riskInfo',
    hidden: true,
    component: () => import('@/views/user/investor/riskInfo'),
    meta: {
      title: '出借人测评记录',
      parent: '/user/investor/list'
    }
  },
  {
    path: 'investor/list/smsLog',
    name: 'user-investor-list-item-smsLog',
    hidden: true,
    component: () => import('@/views/user/investor/smsLog'),
    meta: {
      title: '出借人短信记录',
      parent: '/user/investor/list'
    }
  },
  {
    path: 'investor/list/phoneChangeLog',
    name: 'user-investor-list-item-phoneChangeLog',
    hidden: true,
    component: () => import('@/views/user/investor/phoneChangeLog'),
    meta: {
      title: '出借人手机更换记录',
      parent: '/user/investor/list'
    }
  }
]

export default investor
