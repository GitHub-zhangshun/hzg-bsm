const manage = [
  {
    path: 'manage/kpi',
    name: 'statistics-manage-kpi',
    component: () => import('@/views/statistics/manage/kpi'),
    meta: {
      title: '平台经营KPI'
    }
  },
  {
    path: 'manage/order',
    name: 'statistics-manage-order',
    component: () => import('@/views/statistics/manage/order'),
    meta: {
      title: '出借订单记录'
    }
  }
]

export default manage
