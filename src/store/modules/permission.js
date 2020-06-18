import { asyncRoutes, constantRoutes } from '@/router'
import api from '@/api'
import Layout from '@/layout'
import Page404 from '@/views/error-page/404'
import AddPermission from '@/views/permission/add'
import RolePermission from '@/views/permission/role'

window.pageList = {
  Page404: Page404,
  AddPermission: AddPermission, 
  RolePermission: RolePermission
}

export function filterAsyncRoutes(routes,status) {
  let res = []
  const res_arr = []
  routes.forEach(route => {
    const tmp = { ...route }
    let arrList = {...tmp}
    for(let key in arrList){
      ['create_time','create_user_id','is_del','vue_role_id','vue_route_id','vue_route_parent_id'].map(item=>{
        if(key == item) delete tmp[item]
      })
    }
    if(status) tmp['component'] = Layout
      else tmp['component'] = window.pageList[tmp['name']]
    if(tmp.children && tmp.children.length>0) tmp.children = filterAsyncRoutes(tmp.children,false)
      else delete tmp.children
    res_arr.push(tmp)
  })
  res = [...new Set([...res_arr])]
  return res
}

const state = {
  routes: [],
  addRoutes: []
}

const mutations = {
  SET_ROUTES: (state, routes) => {
    state.addRoutes = routes
    // state.routes = routes
    state.routes = constantRoutes.concat(routes)
  }
}

const actions = {
  generateRoutes({ commit }, roles) {
    return new Promise(resolve => {
      // api.getRoutes({key:roles[0]}).then((result)=>{
      // api.getRoutes({name:'111'}).then((result)=>{
      //   let accessedRoutes
      //   // accessedRoutes = filterAsyncRoutes(result.data[0].routes)
      //   accessedRoutes = [{
      //     children: [
      //       {path: "role", "component": "layout/Layout", name: "RolePermission", meta:{ title:'Role Permission',path: "role",name: "RolePermission" }}
      //     ],
      //     component: "layout/Layout",
      //     meta: {title: "Permission", icon: "lock"},
      //     name: "Permission",
      //     path: "/permission",
      //     redirect: "/permission/page",
      //   }]
      //   commit('SET_ROUTES', accessedRoutes)
      //   console.log(accessedRoutes)
      //   console.log(result.data[0].routes)
      //   console.log(asyncRoutes)
      //   resolve(accessedRoutes)
      // })
      let accessedRoutes
      if (roles.includes('admin')) accessedRoutes = asyncRoutes || []
        else {
          const accessedRoute = [{
            component: 'layout/Layout',
            meta: {title: "Permission", icon: "lock"},
            name: "Permission",
            path: "/permission",
            redirect: "/permission/role",
            children: [
              {path: "add", component: 'views/permission/add', name: "AddPermission", meta:{ title:'Add page' }},
              {path: "role", component: 'views/permission/role', name: "RolePermission", meta:{ title:'Role Permission' }},
            ],
          },{ path: '*', redirect: '/404', hidden: true }]
          accessedRoutes = filterAsyncRoutes(accessedRoute,true)
          // console.log(accessedRoutes)
        }
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
