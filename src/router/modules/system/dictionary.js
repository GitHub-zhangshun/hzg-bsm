const dictionary = [
  {
    path: 'dictionary/type',
    name: 'sys-dictionary-type',
    component: () => import('@/views/system/dictionary/type'),
    meta: {
      title: '类型管理'
    }
  },
  {
    path: 'dictionary/type/subset',
    name: 'sys-dictionary-type-subset',
    hidden: true,
    component: () => import('@/views/system/dictionary/typeItem'),
    meta: {
      title: '类型子集',
      parent: '/sys/dictionary/type'
    }
  },
  {
    path: 'dictionary/status',
    name: 'sys-dictionary-status',
    component: () => import('@/views/system/dictionary/status'),
    meta: {
      title: '状态管理'
    }
  },
  {
    path: 'dictionary/status/subset',
    name: 'sys-dictionary-status-subset',
    hidden: true,
    component: () => import('@/views/system/dictionary/statusItem'),
    meta: {
      title: '状态子集',
      parent: '/sys/dictionary/status'
    }
  }
]

export default dictionary
