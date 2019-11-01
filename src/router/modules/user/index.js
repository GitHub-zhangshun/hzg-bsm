/**
 * 用户管理路由配置
 */
import Layout from '@/views/layout/Layout'

// 借款人管理
import borrower from './borrower'
// 出借人管理
import investor from './investor'
// 账户注销管理
import logoff from './logoff'

const systemRouter = [{
  path: '/user',
  name: 'user',
  component: Layout,
  redirect: '/user/borrower',
  alwaysShow: true, // will always show the root menu
  meta: {
    title: '用户管理',
    icon: 'people'
  },
  children: [
    ...investor,
    ...borrower,
    ...logoff
  ]
}]

export default systemRouter
