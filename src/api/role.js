import request from '@/utils/request'

const roles = {
  // 获取默认配置路由信息
  getDefaultRoutes(data) {
    return request({ url: '/vueDefaultRouteGet', method: 'post', data })
  },
  // 获取权限组列表
  getRoutesGroup(data){
    return request({ url: '/group/get', method: 'post', data })
  },
  // 获取权限组信息
  getRoutesData(data){
    return request({ url: '/vueRoleGet', method: 'post', data })
  },
  // 移除权限组信息
  delRoutesData(data){
    return request({ url: '/vueRoleDel', method: 'post', data })
  },
  // 修改权限组信息
  editRoutesData(data){
    return request({ url: '/vueRoleUpdate', method: 'post', data })
  },
  // 机构信息
  orgTreeGet(data){
    return request({ url: '/orgTreeGet', method: 'post', data })
  },
}
export default roles