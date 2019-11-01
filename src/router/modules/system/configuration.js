const configuration = [
  {
    path: 'configuration/info',
    name: 'sys-configuration-info',
    component: () => import('@/views/system/configuration/info'),
    meta: {
      title: '配置信息管理'
    }
  },
  {
    path: 'configuration/type',
    name: 'sys-configuration-type',
    component: () => import('@/views/system/configuration/type'),
    meta: {
      title: '配置类型管理'
    }
  },
  {
    path: 'configuration/type/key',
    name: 'sys-configuration-type-key',
    component: () => import('@/views/system/configuration/typeItem'),
    meta: {
      title: '分配KEY',
      parent: '/sys/configuration/type'
    }
  },
  {
    path: 'configuration/setTimeOut',
    name: 'sys-configuration-setTimeOut',
    component: () => import('@/views/system/configuration/setTimeOut'),
    meta: {
      title: '定时任务管理'
    }
  }
]

export default configuration
