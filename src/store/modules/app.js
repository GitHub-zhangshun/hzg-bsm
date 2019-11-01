import Cookies from 'js-cookie'

const app = {
  state: {
    sidebar: {
      opened: !+Cookies.get('sidebarStatus'),
      withoutAnimation: false
    },
    device: 'desktop',
    language: Cookies.get('language') || 'zh',
    currentMenuId: '',
    currentMenuFuncList: [],
    menuRunFuncList: [],
    baseRunFuncList: [], // 基础公共权限
    currentMenuTopRunFuncList: [], // 顶部按钮
    currentMenuRightRunFuncList: [], // 右侧按钮
    currentMenuHiddenRunFuncList: [], // 隐藏按钮
    downProgress: 0, // 下载进度条
    disabledSearch: true
  },
  mutations: {
    TOGGLE_SIDEBAR: state => {
      if (state.sidebar.opened) {
        Cookies.set('sidebarStatus', 1)
      } else {
        Cookies.set('sidebarStatus', 0)
      }
      state.sidebar.opened = !state.sidebar.opened
      state.sidebar.withoutAnimation = false
    },
    CLOSE_SIDEBAR: (state, withoutAnimation) => {
      Cookies.set('sidebarStatus', 1)
      state.sidebar.opened = false
      state.sidebar.withoutAnimation = withoutAnimation
    },
    TOGGLE_DEVICE: (state, device) => {
      state.device = device
    },
    SET_LANGUAGE: (state, language) => {
      state.language = language
      Cookies.set('language', language)
    },
    SET_CURRENT_MENU_ID: (state, currentMenuId) => {
      state.currentMenuId = currentMenuId
    },
    SET_CURRENT_MENU_FUNC: (state, currentMenuFuncList) => {
      state.currentMenuFuncList = currentMenuFuncList
    },
    SET_MENU_RUN_FUNC: (state, menuRunFuncList) => {
      state.menuRunFuncList = menuRunFuncList
    },
    SET_BASE_RUN_FUNC: (state, baseRunFuncList) => {
      state.baseRunFuncList = baseRunFuncList
    },
    SET_CURRENT_MENU_TOP_RUN_FUNC: (state, currentMenuTopRunFuncList) => {
      state.currentMenuTopRunFuncList = currentMenuTopRunFuncList
    },
    SET_CURRENT_MENU_RIGHT_RUN_FUNC: (state, currentMenuRightRunFuncList) => {
      state.currentMenuRightRunFuncList = currentMenuRightRunFuncList
    },
    SET_CURRENT_MENU_HIDDEN_RUN_FUNC: (state, currentMenuHiddenFuncList) => {
      state.currentMenuHiddenRunFuncList = currentMenuHiddenFuncList
    },
    SET_DOWN_PROGRESS: (state, downProgress) => {
      state.downProgress = downProgress
    },
    SET_DISABLED_SEARCH: (state, disabledSearch) => {
      state.disabledSearch = disabledSearch
    }
  },
  actions: {
    toggleSideBar({ commit }) {
      commit('TOGGLE_SIDEBAR')
    },
    closeSideBar({ commit }, { withoutAnimation }) {
      commit('CLOSE_SIDEBAR', withoutAnimation)
    },
    toggleDevice({ commit }, device) {
      commit('TOGGLE_DEVICE', device)
    },
    setLanguage({ commit }, language) {
      commit('SET_LANGUAGE', language)
    },
    // 设置当前菜单ID
    setCurrentMenuId({ commit }, currentMenuId) {
      commit('SET_CURRENT_MENU_ID', currentMenuId)
    },
    // 设置当前菜单运行时功能
    setCurrentMenuFuncList({ commit }, currentMenuFuncList) {
      commit('SET_CURRENT_MENU_FUNC', currentMenuFuncList)
    },
    // 设置所有的菜单运行时功能
    setMenuRunFuncList({ commit }, menuRunFuncList) {
      commit('SET_MENU_RUN_FUNC', menuRunFuncList)
    },
    // 设置公共基础运行时功能
    setBaseRunFuncList({ commit }, baseRunFuncList) {
      commit('SET_BASE_RUN_FUNC', baseRunFuncList)
    },
    // 设置当前菜单顶部运行时功能
    setCurrentMenuTopFuncList({ commit }, currentMenuTopRunFuncList) {
      commit('SET_CURRENT_MENU_TOP_RUN_FUNC', currentMenuTopRunFuncList)
    },
    // 设置当前菜单右侧运行时功能
    setCurrentMenuRightFuncList({ commit }, currentMenuRightRunFuncList) {
      commit('SET_CURRENT_MENU_RIGHT_RUN_FUNC', currentMenuRightRunFuncList)
    },
    // 设置当前菜单隐藏运行时功能
    setCurrentMenuHiddenFuncList({ commit }, currentMenuHiddenFuncList) {
      commit('SET_CURRENT_MENU_HIDDEN_RUN_FUNC', currentMenuHiddenFuncList)
    },
    // 设置下载进度条
    setDownProgress({ commit }, downProgress) {
      commit('SET_DOWN_PROGRESS', downProgress)
    },
    setDisabledSearch({ commit }, disabledSearch) {
      commit('SET_DISABLED_SEARCH', disabledSearch)
    }
  }
}

export default app
