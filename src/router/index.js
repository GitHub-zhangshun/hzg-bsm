import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/views/layout/Layout'
export const constantRouterMap = [
  { path: '/login', name: 'login', component: () => import('@/views/login/index'), hidden: true },
  { path: '/404', name: '404', component: () => import('@/views/errorPage/404'), hidden: true },
  { path: '/401', name: '401', component: () => import('@/views/errorPage/401'), hidden: true },
  { path: '/302', name: '302', component: () => import('@/views/errorPage/302'), hidden: true },
  {
    path: '',
    component: Layout,
    redirect: 'dashboard',
    children: [{
      path: 'dashboard',
      component: () => import('@/views/dashboard/index'),
      name: 'dashboard',
      meta: { title: 'dashboard', icon: 'dashboard', noCache: true }
    }]
  }
]

export default new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})
// 系统管理
import system from './modules/system'
// 业务管理
import business from './modules/business'
// 用户管理
import user from './modules/user'
// 运营管理
import operation from './modules/operation'
// 三方机构管理
import tripartite from './modules/tripartite'
// 电子合同管理
import contract from './modules/contract'
// 数据统计管理
import statistics from './modules/statistics'
// 其他管理
import other from './modules/other'

export const asyncRouterMap = [
  ...system,
  ...user,
  ...business,
  ...operation,
  ...tripartite,
  ...contract,
  ...statistics,
  ...other,
  { path: '*', redirect: '/404', hidden: true, meta: { title: '404' }}
]
