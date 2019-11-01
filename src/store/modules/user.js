import {
  request
} from '@/utils/request'

const user = {
  state: {
    avatar: '',
    menus: []
  },

  mutations: {
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar || 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif'
    },
    SET_MENUS: (state, menus) => {
      state.menus = menus
    }
  },

  actions: {
    // 获取用户菜单信息
    GetUserMenus({
      commit
    }) {
      return new Promise((resolve, reject) => {
        request({
          url: '/v1/sys/set/menuList'
        }).then(data => {
          // 设置拥有的菜单
          commit('SET_MENUS', data.result)
          resolve(data.result)
        }).catch(err => {
          reject(err)
        })
      })
    }
  }
}

export default user
