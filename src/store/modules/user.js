import api from '@/api'
import { getToken, setToken, removeToken } from '@/utils/auth'
import router, { resetRouter } from '@/router'

const getDefaultState = () => {
  return {
    token: getToken(),
    org_name: '',
    user_true_name: '',
    roles: [],
  }
}
const state = getDefaultState()

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_ORG_NAME: (state, org_name) => {
    state.org_name = org_name
  },
  SET_USER_NAME: (state, user_true_name) => {
    state.user_true_name = user_true_name
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles
  }
}

const actions = {
  // setTokenData
  setTokenData({commit},token){
    commit('SET_TOKEN',token)
    setToken(token)
  },
  SET_ROLES({commit},roles){
    commit('SET_ROLES', roles)
  },
  // get user info
  getInfo({ commit }) {
    return new Promise((resolve, reject) => {
      api.getInfo().then(response => {
        console.log(response)
        const { data } = response

        if (!data) {
          reject('Verification failed, please Login again.')
        }

        const { org_name, user_true_name } = data[0]
        const roles = new Array(data[0].username)
        // roles must be a non-empty array
        if (!roles || roles.length <= 0) {
          reject('getInfo: roles must be a non-null array!')
        }

        commit('SET_ROLES', roles)
        commit('SET_ORG_NAME', org_name)
        commit('SET_USER_NAME', user_true_name)
        resolve(roles)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user logout
  logout({commit}) {
    removeToken() // must remove  token  first
    resetRouter()
    commit('RESET_STATE')
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      commit('SET_TOKEN', '')
      commit('SET_ROLES', [])
      removeToken()
      resolve()
    })
  },

  // dynamically modify permissions
  changeRoles({ commit, dispatch }, role) {
    return new Promise(async resolve => {
      const token = role + '-token'

      commit('SET_TOKEN', token)
      setToken(token)

      const { roles } = await dispatch('getInfo')

      resetRouter()

      // generate accessible routes map based on roles
      const accessRoutes = await dispatch('permission/generateRoutes', roles, { root: true })

      // dynamically add accessible routes
      router.addRoutes(accessRoutes)

      // reset visited views and cached views
      dispatch('tagsView/delAllViews', null, { root: true })

      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
