import request from '@/utils/request'

const chart = {
  // 获取sysIframeGet
  sysIframeGet(data) {
    return request({ url: '/sysIframeGet', method: 'post', data })
  },
}
export default chart