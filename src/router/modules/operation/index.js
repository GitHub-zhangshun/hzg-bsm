/**
 * 运营管理路由配置
 */
import Layout from '@/views/layout/Layout'

// 银行信息管理
import bank from './bank'
// banner管理
import banner from './banner'
// 文章管理
import article from './article'
// 运营归属
import affiliation from './affiliation'
// 短信
import sms from './sms'
// 邀请奖励相关
import award from './award'
// 活动管理
import activity from './activity'
// 优惠券管理
import coupons from './coupons'

const operationRouter = [{
  path: '/operation',
  name: 'operation',
  component: Layout,
  redirect: '/operation/banner',
  alwaysShow: true, // will always show the root menu
  meta: {
    title: '运营管理',
    icon: 'international'
  },
  children: [
    ...banner,
    ...article,
    ...bank,
    ...affiliation,
    ...sms,
    ...award,
    ...activity,
    ...coupons
  ]
}]

export default operationRouter
