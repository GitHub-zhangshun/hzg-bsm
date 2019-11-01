const affiliation = [
  {
    path: 'affiliation/common',
    name: 'operation-affiliation-common',
    component: () => import('@/views/operation/affiliation/common'),
    meta: {
      title: '公共列表'
    }
  },
  {
    path: 'affiliation/mine',
    name: 'operation-affiliation-mine',
    component: () => import('@/views/operation/affiliation/mine'),
    meta: {
      title: '我的列表'
    }
  }
]

export default affiliation
