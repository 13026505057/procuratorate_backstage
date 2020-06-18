import request from '@/utils/request'

const roles = {
  getRoutes(data) {
    return request({ url: '/vueRoleGet', method: 'post', data })
  }
}
export default roles