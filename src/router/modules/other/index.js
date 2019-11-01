/**
 * 其他关联路由配置
 */
import Layout from '@/views/layout/Layout'

// 异常管理
import exception from './exception'
// 订单管理
import order from './order'
// 存管支付
import fuiou from './fuiou'

const otherRouter = [{
  path: '/other',
  name: 'other',
  component: Layout,
  alwaysShow: true, // will always show the root menu
  meta: {
    title: '其他管理',
    icon: 'international'
  },
  children: [
    ...exception,
    ...order,
    ...fuiou
  ]
}]

export default otherRouter
