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
}
export default user
