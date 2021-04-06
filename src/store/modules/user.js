import api from '@/api'
import { getToken, setToken, removeToken } from '@/utils/auth'
import router, { resetRouter } from '@/router'

const getDefaultState = () => {
  return {
    token: getToken(),
    org_name: '',
    org_id: '',
    username: '',
    user_id: '',
    dept_id:'',
    org_list: [],
    user_true_name: '',
    roles: [],
    address_id: {},
    depList: []
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
  SET_ORG_ID: (state, org_id) => {
    state.org_id = org_id
  },
  SET_USER_NAME_HEAD: (state, username) => {
    state.username = username
  },
  SET_ORG_LIST: (state, org_list) => {
    state.org_list = org_list
  },
  SET_USER_NAME: (state, user_true_name) => {
    state.user_true_name = user_true_name
  },
  SET_USER_ID: (state, user_id) => {
    state.user_id = user_id
  },
  SET_DEPT_ID: (state, dept_id) => {
    state.dept_id = dept_id
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles
  },
  SET_ORG_ADDRESS_ID: (state, address_id) => {
    state.address_id = address_id
  },
  SET_DEP_LIST: (state, depList) => {
    state.depList = depList
  },
}
// 递归获取机构列表
const filtersOrgData = (list,resData,byself) =>{
  if(Array.isArray(list) && list.length>0){
    list.forEach((v,i)=>{
      resData[i]={}; 
      resData[i].value=v['org_id'];
      resData[i].label=v['org_name'];
      resData[i].level=v['org_level'];
      resData[i].province_id=v['province_id'];
      resData[i].city_id=v['city_id'];
      resData[i].area_id=v['area_id'];
      var arr=[];
      resData[i].children=arr;
      filtersOrgData(v.orgs,arr);
      if(!v.orgs) delete resData[i].children
    });
  }
  return resData
}

const actions = {
  // setTokenData
  setTokenData({commit},token){
    commit('SET_TOKEN',token)
    // console.log(token)
    setToken(token)
  },
  SET_ROLES({commit},roles){
    commit('SET_ROLES', roles)
  },
  // get user info
  getInfo({ commit,dispatch }) {
    return new Promise((resolve, reject) => {
      api.getInfo().then(response => {
        const { data } = response

        if (!data) {
          reject('Verification failed, please Login again.')
        }
        // console.log('用户信息')
        // console.log(data[0])
        const { user_id, org_name, user_true_name, org_id, province_id, city_id, area_id, userVueRoleList, username,dept_id,nation_id } = data[0]
        // const roles = new Array(data[0].username)
        const roles = {
          group_name: userVueRoleList.length>0?[userVueRoleList[0].group_name]:['defalut'],
          username: username
        }
        // roles must be a non-empty array
        if (!roles || roles.length <= 0) {
          reject('getInfo: roles must be a non-null array!')
        }

        commit('SET_ROLES', roles.group_name)
        commit('SET_ORG_NAME', org_name)
        commit('SET_USER_NAME', user_true_name)
        commit('SET_USER_ID', user_id)
        commit('SET_DEPT_ID', dept_id)
        commit('SET_ORG_ID', org_id)
        commit('SET_USER_NAME_HEAD', username)
        commit('SET_ORG_ADDRESS_ID', { province_id, city_id, area_id,nation_id })

        dispatch('getDeptList',org_id)
        resolve(roles)
      }).catch(error => {
        reject(error)
      })
    })
  },
  getOrgTreeList({commit}){
    return new Promise((resolve, reject) =>{
      api.orgTreeGet().then(resultData=>{
        let data = filtersOrgData(resultData.data,[])
        
        commit('SET_ORG_LIST', data)
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },
  getDeptList({commit},org_id){
    return new Promise((resolve, reject) =>{
      api.getDepartmentAllList({org_id}).then(resultData=>{
        let data = []
        resultData.data.map(item=>{
          data.push({ value: item.dept_id, label: item.dept_name })
        })
        commit('SET_DEP_LIST', data)
        resolve(data)
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
