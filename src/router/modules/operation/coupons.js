const coupons = [
  {
    path: 'coupons/dic',
    name: 'operation-coupons-dic',
    component: () => import('@/views/operation/coupons/dic'),
    meta: {
      title: '基础券信息'
    }
  },
  {
    path: 'coupons/grant',
    name: 'operation-coupons-grant',
    component: () => import('@/views/operation/coupons/grant'),
    meta: {
      title: '发放列表'
    }
  },
  {
    path: 'coupons/grant/give',
    name: 'operation-coupons-grant-give',
    hidden: true,
    component: () => import('@/views/operation/coupons/grant-give'),
    meta: {
      title: '优惠券发放',
      parent: '/operation/coupons/grant'
    }
  }
]

export default coupons
