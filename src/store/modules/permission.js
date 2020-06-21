import { constantRoutes } from '@/router'
import api from '@/api'
// 暂存
import asyncDataRoutes from './routes'
// 页面声明
import Layout from '@/layout'
import routesNav from './routesNav'

export function filterAsyncRoutes(routes,status) {
  let res = []
  const res_arr = []
  routes.forEach(route => {
    const tmp = { ...route }
    let arrList = {...tmp}
    for(let key in arrList){
      ['create_time','create_user_id','is_del','vue_role_id','vue_route_id','vue_route_parent_id','vue_route_type'].map(item=>{
        if(key == item) delete tmp[item]
      })
    }
    if(status) tmp['component'] = Layout
      else tmp['component'] = routesNav[tmp['name']]
    if(tmp.children && tmp.children.length>0) tmp.children = filterAsyncRoutes(tmp.children,false)
      else delete tmp.children
    res_arr.push(tmp)
  })
  res = [...new Set([...res_arr])]
  return res
}
export function checkedNullInfo(arr){
  arr.map(itemParen=>{
    const tmp = { ...itemParen }
    let arrList = { ...tmp }
    Object.keys(arrList['meta']).map(keys=>{
      ['affix','create_time','create_user_id','is_del','roles','vueDefaultMetaRoleList','vue_meta_id','vue_role_id','vue_route_id'].map(item=>{
        if(keys == item) delete tmp['meta'][item]
      })
    })
    if(tmp.children && tmp.children.length>0) tmp.children = checkedNullInfo(tmp.children)
  })
  return arr
}

export function filterAsyncRoutes_respones(routes,status) {
  let res = []
  const res_arr = []
  routes.forEach(route => {
    const tmp = { ...route }
    let arrList = {...tmp}
    for(let key in arrList){
      ['create_time','create_user_id','is_del','vue_role_id','vue_route_id','vue_route_parent_id','vue_route_type'].map(item=>{
        if(key == item) delete tmp[item]
      })
    }
    if(status) tmp['component'] = ''
      else tmp['component'] = ''
    if(tmp.children && tmp.children.length>0) tmp.children = filterAsyncRoutes_respones(tmp.children,false)
      else delete tmp.children
    res_arr.push(tmp)
  })
  res = [...new Set([...res_arr])]
  return res
}
export function checkedNullInfo_respones(arr){
  arr.map(itemParen=>{
    const tmp = { ...itemParen }
    let arrList = { ...tmp }
    Object.keys(arrList['meta']).map(keys=>{
      ['affix','create_time','create_user_id','is_del','roles','vueDefaultMetaRoleList','vue_meta_id','vue_role_id','vue_route_id'].map(item=>{
        if(keys == item) delete tmp['meta'][item]
      })
    })
    if(tmp.children && tmp.children.length>0) tmp.children = checkedNullInfo_respones(tmp.children)
  })
  return arr
}

const state = {
  routes: [],
  addRoutes: []
}

const mutations = {
  SET_ROUTES: (state, routes) => {
    state.addRoutes = routes
    state.routes = constantRoutes.concat(routes)
  }
}

const actions = {
  generateRoutes({ commit }, roles) {
    return new Promise(resolve => {
      // api.getDefaultRoutes().then((result)=>{
      //   let accessedRoutes
      //   const accessedRoute = checkedNullInfo(result.data)
      //   accessedRoute.push({ path: '*', redirect: '/404', hidden: true })
      //   accessedRoutes = filterAsyncRoutes(accessedRoute,true)
      //   commit('SET_ROUTES', accessedRoutes)
      //   resolve(accessedRoutes)
      // })
      let accessedRoutes
      const accessedRoute = asyncDataRoutes
      accessedRoute.push({ path: '*', redirect: '/404', hidden: true })
      accessedRoutes = filterAsyncRoutes(accessedRoute,true)
      commit('SET_ROUTES', accessedRoutes)
      resolve(accessedRoutes)
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
