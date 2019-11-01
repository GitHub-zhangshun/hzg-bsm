/**
 * 系统管理路由配置
 */
import Layout from '@/views/layout/Layout'

// 系统设置
import setting from './setting'
// 配置信息管理
import configuration from './configuration'
// 字典管理
import dictionary from './dictionary'
// 网关证书
import certificate from './certificate'

const systemRouter = [{
  path: '/sys',
  name: 'sys',
  component: Layout,
  redirect: '/sys/setting',
  alwaysShow: true, // will always show the root menu
  meta: {
    title: '系统管理',
    icon: 'star'
  },
  children: [
    ...certificate,
    ...setting,
    ...configuration,
    ...dictionary
  ]
}]

export default systemRouter
