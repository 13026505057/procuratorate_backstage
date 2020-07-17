import request from '@/utils/request'

const chart = {
  // 获取sysIframeGet
  sysIframeGet(data) {
    return request({ url: '/sysIframeGet', method: 'post', data })
  },
  // 获取getShouLiJieCun
  getShouLiJieCun(data) {
    return request({ url: '/chart/getShouLiJieCun4', method: 'post', data })
  },
  // 获取受理未归档案件列表
  getShouliWeiBanjie(data) {
    return request({ url: '/chart/getShouliWeiBanjie', method: 'post', data })
  },
  // 获取办结未归档案件列表
  getBanJieWeiGuiDang(data) {
    return request({ url: '/chart/getBanJieWeiGuiDang', method: 'post', data })
  },
}
export default chart