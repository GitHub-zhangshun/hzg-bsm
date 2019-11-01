
const getters = {
  sidebar: state => state.app.sidebar,
  language: state => state.app.language,
  device: state => state.app.device,
  visitedViews: state => state.tagsView.visitedViews,
  cachedViews: state => state.tagsView.cachedViews,
  permission_routers: state => state.permission.routers,
  addRouters: state => state.permission.addRouters,
  routers: state => state.permission.routers,
  errorLogs: state => state.errorLog.logs,
  menus: state => state.user.menus,
  avatar: state => state.user.avatar,
  currentMenuId: state => state.app.currentMenuId,
  currentMenuFuncList: state => state.app.currentMenuFuncList,
  menuRunFuncList: state => state.app.menuRunFuncList,
  baseRunFuncList: state => state.app.baseRunFuncList,
  currentMenuTopRunFuncList: state => state.app.currentMenuTopRunFuncList,
  currentMenuRightRunFuncList: state => state.app.currentMenuRightRunFuncList,
  currentMenuHiddenRunFuncList: state => state.app.currentMenuHiddenRunFuncList,
  downProgress: state => state.app.downProgress,
  disabledSearch: state => state.app.disabledSearch
}
export default getters
