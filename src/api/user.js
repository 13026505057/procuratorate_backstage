import request from '@/utils/request'

const user = {
  // 登录
  login(data) {
    return request({ url: '/login', method: 'post', data })
  },
  // 获取用户信息
  getInfo(data){
    return request({ url: '/user/getInfo', method: 'post', data })
  },
  // 获取用户列表
  getByPage(data){
    return request({ url: '/user/getByPage', method: 'post', data })
  },
  getUserList(data){
    return request({ url: '/user/get', method: 'post', data })
  },
  // 异地登录
  commonIsLogin(data){
    return request({ url: '/commonIsLogin', method: 'post', data })
  },
  // 获取权限组列表
  getGroupList(data){
    return request({ url: '/group/get', method: 'post', data })
  },
}
export default user
