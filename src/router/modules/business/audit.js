/** 业务审核 */
const audit = [
  {
    path: 'audit/wait/edit',
    name: 'bus-audit-wait-edit',
    hidden: true,
    component: () => import('@/views/business/base/edit'),
    meta: {
      title: '重新编辑',
      parent: '/bus/audit/wait'
    }
  },
  {
    path: 'audit/wait',
    name: 'bus-audit-wait',
    component: () => import('@/views/business/audit/wait'),
    meta: {
      title: '待提交初审列表'
    }
  },
  {
    path: 'audit/first',
    name: 'bus-audit-first',
    component: () => import('@/views/business/audit/first'),
    meta: {
      title: '初审列表'
    }
  },
  {
    path: 'audit/recheck',
    name: 'bus-audit-recheck',
    component: () => import('@/views/business/audit/recheck'),
    meta: {
      title: '复审列表'
    }
  },
  {
    path: 'audit/financial',
    name: 'bus-audit-financial',
    component: () => import('@/views/business/audit/financial'),
    meta: {
      title: '财务审核'
    }
  }
]

export default audit
