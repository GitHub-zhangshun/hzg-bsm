import {
  asyncRouterMap,
  constantRouterMap
} from '@/router'

/**
 * 递归过滤异步路由表，返回符合用户角色权限的路由表
 * @param asyncRouterMap 异步路由表
 * @param menus 用户已拥有的菜单
 */
function filterAsyncRouter(asyncRouterMap, menus) {
  // filter 过滤器返回一个新的数组
  const accessedRouters = asyncRouterMap.filter(route => {
    // debugger
    let menu = {}
    // 通过name匹配 返回菜单信息
    hasPermission(menus, route.name, e => {
      menu = e
    })
    if (menu.Id) {
      // 匹配成功 附加菜单ID到本地路由表
      route.meta.Id = menu.Id
      // 菜单的title
      route.meta.title = menu.title
      // 菜单的icon
      route.meta.icon = menu.ico
      // 是否隐藏
      route.hidden = !menu.isShow
      // 继续匹配子级菜单
      if (route.children && route.children.length > 0) {
        /** 注意 一定要将route重新赋值 */
        // 重新赋值children 再次递归
        route.children = filterAsyncRouter(route.children, menus)
      }
      return true
    }
    return false
  })
  return accessedRouters
}

/**
 * 匹配数据库分配的菜单 利用回调函数返回菜单信息
 * @param {*} menus
 * @param {*} name 本地路由表的name字段
 * @param {*} callback 回调函数
 */
function hasPermission(menus, name, callback) {
  for (var i in menus) {
    if (menus[i].url === name) {
      callback(menus[i])
      break
    } else if (menus[i].url === 'dashboard') {
      // 给首页添加ID
      constantRouterMap.map(item => {
        if (item.children && item.children[0].name === 'dashboard') {
          item.children[0].meta.Id = menus[i].Id
        }
      })
    } else {
      hasPermission(menus[i].children, name, callback)
    }
  }
}

const permission = {
  state: {
    routers: constantRouterMap,
    addRouters: []
  },
  mutations: {
    SET_ROUTERS: (state, routers) => {
      state.addRouters = routers
      state.routers = constantRouterMap.concat(routers)
    }
  },
  actions: {
    // 根据菜单列表生成可访问的路由表
    GenerateRoutes({
      commit,
      rootState
    }, data) {
      return new Promise(resolve => {
        const accessedRouters = filterAsyncRouter(asyncRouterMap, data)
        commit('SET_ROUTERS', accessedRouters)
        resolve()
      })
    }
  }
}

export default permission
