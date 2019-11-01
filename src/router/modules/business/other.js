/** 业务其他列表路由 */
const other = [
  {
    path: 'other/all',
    name: 'bus-other-all',
    component: () => import('@/views/business/other/all'),
    meta: {
      title: '所有标的列表'
    }
  },
  {
    path: 'other/all/editDisclosure',
    name: 'bus-other-all-editDisclosure',
    component: () => import('@/views/business/other/all-editDisclosure'),
    meta: {
      title: '修改披露信息'
    }
  },
  {
    path: 'other/raise',
    name: 'bus-other-raise',
    component: () => import('@/views/business/other/raise'),
    meta: {
      title: '募集中列表'
    }
  },
  {
    path: 'other/loanBid',
    name: 'bus-other-loanBid',
    component: () => import('@/views/business/other/loanBid'),
    meta: {
      title: '还款中标的列表'
    }
  },
  {
    path: 'other/repaymentFull',
    name: 'bus-other-repaymentFull',
    component: () => import('@/views/business/other/repaymentFull'),
    meta: {
      title: '已还款列表'
    }
  },
  {
    path: 'other/repaymentPlan',
    name: 'bus-other-repaymentPlan',
    component: () => import('@/views/business/other/repaymentPlan'),
    meta: {
      title: '还款计划列表'
    }
  },
  {
    path: 'other/repaymentPlan/paymentPlan',
    name: 'bus-other-repaymentPlan-item-paymentPlan',
    component: () => import('@/views/business/other/repaymentPlan-item-paymentPlan'),
    meta: {
      title: '回款计划列表'
    }
  },
  {
    path: 'other/prepayment',
    name: 'bus-other-prepayment',
    component: () => import('@/views/business/other/prepayment'),
    meta: {
      title: '设置提前还款'
    }
  },
  {
    path: 'other/permission',
    name: 'bus-other-permission',
    component: () => import('@/views/business/other/permission'),
    meta: {
      title: '标的出借人权限'
    }
  },
  {
    path: 'other/permission/setting',
    name: 'bus-other-permission-setting',
    component: () => import('@/views/business/other/permission-item-setting'),
    meta: {
      title: '设置出借人权限',
      parent: '/bus/other/permission'
    }
  },
  {
    path: 'other/failure',
    name: 'bus-other-failure',
    component: () => import('@/views/business/other/failure'),
    meta: {
      title: '已流标列表'
    }
  },
  {
    path: 'other/discard',
    name: 'bus-other-discard',
    component: () => import('@/views/business/other/discard'),
    meta: {
      title: '已废弃列表'
    }
  }
]

export default other
