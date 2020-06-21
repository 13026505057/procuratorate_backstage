import variables from '@/styles/element-variables.scss'
import defaultSettings from '@/settings'
import api from '@/api'

const { showSettings, tagsView, fixedHeader, sidebarLogo } = defaultSettings

const state = {
  theme: variables.theme,
  showSettings: showSettings,
  tagsView: tagsView,
  fixedHeader: fixedHeader,
  sidebarLogo: sidebarLogo,

  caseTimeStatus: []
}

const mutations = {
  CHANGE_SETTING: (state, { key, value }) => {
    if (state.hasOwnProperty(key)) {
      state[key] = value
    }
  },
  SET_Time_Status(state,caseTimeStatus){
    state.caseTimeStatus = caseTimeStatus
  },
}

const actions = {
  changeSetting({ commit }, data) {
    commit('CHANGE_SETTING', data)
  },
  caseTimeStatusGet({ commit }){
    return new Promise((resolve, reject) => {
      api.caseTimeStatus().then(response => {
        const { data } = response

        commit('SET_Time_Status', data)
        resolve(data)
      }).catch(error => reject(error) )
    })
  },
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

