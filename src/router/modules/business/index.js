/**
 * 业务管理路由配置
 */
import Layout from '@/views/layout/Layout'

// 基础页面
import base from './base'
// 配套管理
import relate from './relate'
// 业务申请
import apply from './apply'
// 业务审核
import audit from './audit'
// 业务发布
import release from './release'
// 其他列表
import other from './other'

const systemRouter = [{
  path: '/bus',
  name: 'bus',
  component: Layout,
  redirect: '/bus/apply',
  alwaysShow: true, // will always show the root menu
  meta: {
    title: '业务管理',
    icon: 'nested'
  },
  children: [
    ...base,
    ...relate,
    ...apply,
    ...audit,
    ...release,
    ...other
  ]
}]

export default systemRouter
