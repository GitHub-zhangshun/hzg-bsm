const setting = [
  {
    path: 'setting/organization',
    name: 'sys-setting-organization',
    component: () => import('@/views/system/setting/organization'),
    meta: {
      title: '组织机构管理'
    }
  },
  {
    path: 'setting/organization/job',
    name: 'sys-setting-organization-job',
    component: () => import('@/views/system/setting/organizationJobItem'),
    meta: {
      title: '分配岗位',
      parent: '/sys/setting/organization'
    }
  },
  {
    path: 'setting/organization/job/role',
    name: 'sys-setting-organization-job-role',
    component: () => import('@/views/system/setting/organizationJobRoleItem'),
    meta: {
      title: '分配岗位角色',
      parent: '/sys/setting/organization/job'
    }
  },
  {
    path: 'setting/role',
    name: 'sys-setting-role',
    component: () => import('@/views/system/setting/role'),
    meta: {
      title: '角色管理'
    }
  },
  {
    path: 'setting/role/permission',
    name: 'sys-setting-role-permission',
    component: () => import('@/views/system/setting/roleItem'),
    meta: {
      title: '分配权限',
      parent: '/sys/setting/role'
    }
  },
  {
    path: 'setting/action',
    name: 'sys-setting-action',
    component: () => import('@/views/system/setting/action'),
    meta: {
      title: '功能管理'
    }
  },
  {
    path: 'setting/menu',
    name: 'sys-setting-menu',
    component: () => import('@/views/system/setting/menu'),
    meta: {
      title: '菜单管理'
    }
  },
  {
    path: 'setting/user',
    name: 'sys-setting-user',
    component: () => import('@/views/system/setting/user'),
    meta: {
      title: '用户管理'
    }
  },
  {
    path: 'setting/user/job',
    name: 'sys-setting-user-job',
    component: () => import('@/views/system/setting/userItem'),
    meta: {
      title: '分配岗位',
      parent: '/sys/setting/user'
    }
  }
]
export default setting
