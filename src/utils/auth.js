import Cookies from 'js-cookie'

const TokenKey = 'Admin-Token'
const UserInfoKey = 'Admin-UserInfo'
const FuncListKey = 'Admin-FuncList'
const DicListKey = 'Admin-DicList'

export default {
  getToken() {
    return Cookies.get(TokenKey)
  },
  setToken(token) {
    return Cookies.set(TokenKey, token)
  },
  getUserInfo() {
    const userInfoStr = window.localStorage.getItem(UserInfoKey)
    return userInfoStr && JSON.parse(userInfoStr) || null
  },
  getFuncList() {
    const funcStr = window.localStorage.getItem(FuncListKey)
    return funcStr && JSON.parse(funcStr) || null
  },
  getDicList() {
    const dicStr = window.localStorage.getItem(DicListKey)
    return dicStr && JSON.parse(dicStr) || null
  },
  logOut() {
    Cookies.remove(TokenKey)
    // 清空缓存信息
    window.localStorage.setItem(UserInfoKey, '')
    window.localStorage.setItem(DicListKey, '')
    window.localStorage.setItem(FuncListKey, '')
  },
  logIn({
    userInfo,
    dicList,
    funcList
  }) {
    // 保存是否首次登陆
    const perLoading = window.localStorage.getItem('pre-loading')
    if (perLoading === null) {
      window.localStorage.setItem('pre-loading', 'true')
    } else {
      window.localStorage.setItem('pre-loading', 'false')
    }
    // 设置用户信息
    window.localStorage.setItem(UserInfoKey, JSON.stringify(userInfo))
    // 设置字典信息
    window.localStorage.setItem(DicListKey, JSON.stringify(dicList))
    // 设置运行时功能
    window.localStorage.setItem(FuncListKey, JSON.stringify(funcList))
  }
}
