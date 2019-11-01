/**
 * 三方机构路由配置
 */
import Layout from '@/views/layout/Layout'

// 助贷机构管理
import provider from './provider'
// 保理机构管理
import factoring from './factoring'

const tripartiteRouter = [{
  path: '/tripartite',
  name: 'tripartite',
  component: Layout,
  redirect: '/tripartite/provider',
  alwaysShow: true, // will always show the root menu
  meta: {
    title: '三方机构管理',
    icon: 'peoples'
  },
  children: [
    ...provider,
    ...factoring
  ]
}]

export default tripartiteRouter
