/**
 * 电子合同管理路由配置
 */
import Layout from '@/views/layout/Layout'

// 合同模板页面
import template from './template'
// 合同账户管理
import account from './account'
// 签署列表
import sign from './sign'

const systemRouter = [{
  path: '/contract',
  name: 'contract',
  component: Layout,
  redirect: '/contract/template',
  alwaysShow: true, // will always show the root menu
  meta: {
    title: '电子合同管理',
    icon: 'clipboard'
  },
  children: [
    ...template,
    ...account,
    ...sign
  ]
}]

export default systemRouter
