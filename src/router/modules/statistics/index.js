/**
 * 数据统计路由配置
 */
import Layout from '@/views/layout/Layout'

// 数据总览
import overview from './overview'
// 平台经营
import manage from './manage'
// 用户分析
import user from './user'
// 待收债权分布
import creditor from './creditor'
// 助贷机构相关
import provider from './provider'

const statistics = [{
  path: '/statistics',
  name: 'statistics',
  component: Layout,
  redirect: '/statistics/overview',
  alwaysShow: true, // will always show the root menu
  meta: {
    title: '数据统计',
    icon: 'chart'
  },
  children: [
    ...overview,
    ...manage,
    ...user,
    ...creditor,
    ...provider
  ]
}]

export default statistics
