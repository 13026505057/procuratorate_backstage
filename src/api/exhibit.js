import request from '@/utils/request'
// 案卷操作
const exhibit = {
    // 补打条码
    printAgain(data) {
        return request({ url: '/exhibit/exhibit/printAgain', method: 'post', data })
    }, 
    // 打印
    printAcceptReturn(data) {
        return request({ url: '/exhibit/exhibit/printAcceptReturn', method: 'post', data })
    }, 
    // 修改案卷信息
    editCaseData(data) {
        return request({ url: '/exhibit/exhibit/update', method: 'post', data })
    }, 
    // 获取已入库案件信息
    editCaseData(data) {
        return request({ url: '/exhibit/exhibit/getInByPage', method: 'post', data })
    }, 
}
export default exhibit