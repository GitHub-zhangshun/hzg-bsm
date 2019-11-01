/** 业务初审路由 */
const release = [
  {
    path: 'release/wait',
    name: 'bus-release-wait',
    component: () => import('@/views/business/release/wait'),
    meta: {
      title: '待发布列表'
    }
  },
  {
    path: 'release/timing',
    name: 'bus-release-timing',
    component: () => import('@/views/business/release/timing'),
    meta: {
      title: '定时发布列表'
    }
  }
]

export default release
