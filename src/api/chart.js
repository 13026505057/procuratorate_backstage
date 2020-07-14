import request from '@/utils/request'

const chart = {
  // 获取sysIframeGet
  sysIframeGet(data) {
    return request({ url: '/sysIframeGet', method: 'post', data })
  },
  // 获取getShouLiJieCun
  getShouLiJieCun(data) {
    return request({ url: '/chart/getShouLiJieCun2', method: 'post', data })
  },
}
export default chart