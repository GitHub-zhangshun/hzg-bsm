const certificate = [
  {
    path: 'certificate/list',
    name: 'sys-certificate-list',
    component: () => import('@/views/system/certificate/list'),
    meta: {
      title: '证书管理'
    }
  },
  {
    path: 'certificate/client',
    name: 'sys-certificate-client',
    component: () => import('@/views/system/certificate/client'),
    meta: {
      title: '客户端管理'
    }
  },
  {
    path: 'certificate/client/version',
    name: 'sys-certificate-client-item-version',
    component: () => import('@/views/system/certificate/client-item-version'),
    meta: {
      title: '客户端版本管理',
      parent: '/sys/certificate/client'
    }
  }
]

export default certificate
