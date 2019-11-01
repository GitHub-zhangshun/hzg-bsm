const sms = [
  {
    path: 'sms/template',
    name: 'operation-sms-template',
    component: () => import('@/views/operation/sms/template'),
    meta: {
      title: '短信模板'
    }
  },
  {
    path: 'sms/log',
    name: 'operation-sms-log',
    component: () => import('@/views/operation/sms/log'),
    meta: {
      title: '发送记录'
    }
  },
  {
    path: 'sms/black',
    name: 'operation-sms-black',
    component: () => import('@/views/operation/sms/black'),
    meta: {
      title: '黑名单'
    }
  },
  {
    path: 'sms/write',
    name: 'operation-sms-write',
    component: () => import('@/views/operation/sms/write'),
    meta: {
      title: '白名单'
    }
  },
  {
    path: 'sms/grey',
    name: 'operation-sms-grey',
    component: () => import('@/views/operation/sms/grey'),
    meta: {
      title: '灰名单'
    }
  },
  {
    path: 'sms/shield',
    name: 'operation-sms-shield',
    component: () => import('@/views/operation/sms/shield'),
    meta: {
      title: '临时屏蔽'
    }
  }
]

export default sms
