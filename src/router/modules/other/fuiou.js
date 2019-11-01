const fuiou = [
  {
    path: 'fuiou/capital',
    name: 'other-fuiou-capital',
    component: () => import('@/views/other/fuiou/capital'),
    meta: {
      title: '资金记录'
    }
  },
  {
    path: 'fuiou/transfer',
    name: 'other-fuiou-transfer',
    component: () => import('@/views/other/fuiou/transfer'),
    meta: {
      title: '划拨记录'
    }
  }
]

export default fuiou
