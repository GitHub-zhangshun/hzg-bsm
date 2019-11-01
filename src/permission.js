import router from './router'
import store from './store'
import {
  Message
} from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import auth from '@/utils/auth' // getToken from cookie
NProgress.configure({
  showSpinner: false
}) // NProgress Configuration
import {
  request,
  clearRequest,
  axios
} from '@/utils/request'

// 白名单
const whiteList = ['/login']

/**
 * 匹配数据库分配的菜单 利用回调函数返回菜单信息
 * @param {*} routers
 * @param {*} name 本地路由表的name字段
 * @param {*} callback 回调函数
 */
function hasPermission(routers, name, callback) {
  for (var i in routers) {
    if (routers[i].name === name) {
      callback(true)
      break
    } else {
      hasPermission(routers[i].children, name, callback)
    }
  }
}

router.beforeEach(async(to, from, next) => {
  const CancelToken = axios.CancelToken
  clearRequest.source.cancel && clearRequest.source.cancel()
  clearRequest.source = CancelToken.source()
  NProgress.start() // 顶部进度条开始
  // 判断是否有toke
  if (auth.getToken()) {
    // 获取菜单运行时功能
    // debugger
    let isHome = false
    if (to.name === 'dashboard') {
      isHome = true
    }
    // 获取当前页面的运行时功能
    await getFunc(to.meta.Id, isHome)
    // token 存在不允许重定向到login
    if (to.path === '/login') {
      next({
        path: '/'
      })
    } else {
      // 访问其他页面 判断是否拉取拥有的菜单
      if (store.getters.menus.length === 0) {
        // 如果没有拉取菜单 则拉取所拥有的菜单列表
        store.dispatch('GetUserMenus').then(data => {
          // 根据已有的菜单列表生成可访问的路由表
          store.dispatch('GenerateRoutes', data).then(() => {
            // 动态添加可访问路由表
            router.addRoutes(store.getters.addRouters)
            // hack方法 确保addRoutes已完成 ,set the replace: true so the navigation will not leave a history record
            next({
              ...to,
              replace: true,
              path: '/', // 刷新回到首页(获取基础权限) 防止数据获取出错
              query: {}
            })
            // // 2秒后回到刷新前的页面
            // setTimeout(() => {
            //   next({
            //     path: to.fullPath
            //   })
            // }, 2000)
          }).catch((err) => {
            auth.logOut()
            Message.error(err || '权限获取失败,请刷新页面或者重新登录')
            next({
              path: '/'
            })
          })
        }).catch(() => {
          auth.logOut()
          next({
            path: '/'
          })
        })
      } else {
        let isPermission = false
        // 判断权限
        hasPermission(store.getters.routers, to.name, bo => {
          isPermission = bo
        })
        if (isPermission) {
          next()
        } else {
          next({
            path: '/401'
          })
        }
      }
    }
  } else {
    /* has no token*/
    if (whiteList.indexOf(to.path) !== -1) { // 在免登录白名单，直接进入
      next()
    } else {
      next('/login') // 否则全部重定向到登录页
    }
  }
})

router.afterEach((to) => {
  NProgress.done() // finish progress bar
})

// 获取当前页面的运行时功能
async function getFunc(menuId, isHome) {
  if (menuId) {
    // 清除权限功能
    store.dispatch('setCurrentMenuTopFuncList', {}) // 设置顶部按钮
    store.dispatch('setCurrentMenuRightFuncList', {}) // 设置右侧按钮
    store.dispatch('setCurrentMenuHiddenFuncList', {}) // 设置隐藏按钮
    // 存入当前的菜单ID
    store.dispatch('setCurrentMenuId', menuId)
    // 先从vuex中查询
    const menuRunFuncList = store.getters.menuRunFuncList || [] // 所有的菜单运行时功能
    const currentMenuFuncList = menuRunFuncList.find(item => item.menuId === menuId) // 当前的菜单运行时功能
    // 如果vuex中没有菜单当前的运行时功能 再请求接口
    if (!currentMenuFuncList) {
      // 获取当前菜单的运行时功能
      await request({
        url: '/v1/sys/set/menuFuncList',
        data: menuId
      }).then(data => {
        // 存入当前的菜单运行时功能
        store.dispatch('setCurrentMenuFuncList', data.result)

        // 查看所有菜单运行时功能 如果没有存入则存入vuex 菜单ID作为索引
        const v_menuFuncList = {
          menuId,
          list: data.result
        }
        if (!menuRunFuncList.includes(v_menuFuncList)) {
          menuRunFuncList.push(v_menuFuncList)
          store.dispatch('setMenuRunFuncList', menuRunFuncList)
        }

        // 构造顶部功能跟右侧功能 去除隐藏功能按钮&查询按钮
        const topFuncList = data.result.filter(item => !item.isRight && item.isShow)
        const rightFuncList = data.result.filter(item => item.isRight && item.isShow)
        const hiddenFuncList = {}
        data.result.filter(item => !item.isShow).forEach(item => {
          hiddenFuncList[item.keyName] = item.apiUrl
        })

        // 如果为首页 存入基础权限 && 存入模式切换权限
        if (isHome) {
          // 如果存在模式切换权限 存入base
          data.result.forEach(i => {
            hiddenFuncList['O_MODEL_CHANGE'] = i.apiUrl === 'mode_change'
          })
          store.dispatch('setBaseRunFuncList', hiddenFuncList)
        }
        // 设置顶部按钮
        store.dispatch('setCurrentMenuTopFuncList', topFuncList)
        // 设置右侧按钮
        store.dispatch('setCurrentMenuRightFuncList', rightFuncList)
        // 设置隐藏按钮 对象模式 keyName => apiUrl
        store.dispatch('setCurrentMenuHiddenFuncList', hiddenFuncList)
      })
    } else {
      // 当前存在 更新vuex中当前菜单的运行时功能 防止BUG
      store.dispatch('setCurrentMenuFuncList', currentMenuFuncList.list)
      // 构造顶部功能跟右侧功能 去除隐藏功能按钮&查询按钮
      const topFuncList = currentMenuFuncList.list.filter(item => !item.isRight && item.isShow)
      const rightFuncList = currentMenuFuncList.list.filter(item => item.isRight && item.isShow)
      const hiddenFuncList = {}
      currentMenuFuncList.list.filter(item => !item.isShow).forEach(item => {
        hiddenFuncList[item.keyName] = item.apiUrl
      })
      // 如果为首页 存入基础权限
      if (isHome) {
        // 如果存在模式切换权限 存入base
        currentMenuFuncList.list.forEach(i => {
          hiddenFuncList['O_MODEL_CHANGE'] = i.apiUrl === 'mode_change'
        })
        store.dispatch('setBaseRunFuncList', hiddenFuncList)
      }
      // 设置顶部按钮
      store.dispatch('setCurrentMenuTopFuncList', topFuncList)
      // 设置右侧按钮
      store.dispatch('setCurrentMenuRightFuncList', rightFuncList)
      // 设置隐藏按钮
      store.dispatch('setCurrentMenuHiddenFuncList', hiddenFuncList)
    }
  }
}
