import request from '@/utils/request'

const chart = {
  // 获取入库案件(部门)
  getInCaseCountByDept(data) {
    return request({ url: '/chart/getInCaseCountByDept', method: 'post', data })
  },
  // 获取出库案件(部门)
  getOutCaseCountByDept(data) {
    return request({ url: '/chart/getOutCaseCountByDept', method: 'post', data })
  },
  // 获取入库案件(时间)
  getInCaseCountByMonth(data) {
    return request({ url: '/chart/getInCaseCountByMonth', method: 'post', data })
  },
  // 获取出库案件(时间)
  getOutCaseCountByMonth(data) {
    return request({ url: '/chart/getOutCaseCountByMonth', method: 'post', data })
  },
}
export default chart