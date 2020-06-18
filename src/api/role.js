import request from '@/utils/request'

const roles = {
  // 获取配置路由信息
  getRoutes(data) {
    return request({ url: '/vueDefaultRouteGet', method: 'post', data })
  },
  // 添加配置路由信息
  addRoutes(data){
    return request({ url: '/vueDefaultRouteAdd', method: 'post', data })
  }
}
export default roles