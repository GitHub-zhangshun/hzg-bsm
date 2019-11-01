// 账户注销管理
const logoff = [
  {
    path: 'logoff/accountApplyList',
    name: 'user-logoff-accountApplyList',
    component: () => import('@/views/user/logoff/accountApplyList'),
    meta: {
      title: '账号申请注销列表'
    }
  },
  {
    path: 'logoff/accountLogoffList',
    name: 'user-logoff-accountLogoffList',
    component: () => import('@/views/user/logoff/accountLogoffList'),
    meta: {
      title: '账号已注销列表'
    }
  }
]

export default logoff
