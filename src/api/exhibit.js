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
    // 添加案卷信息
    addExhibitData(data) {
        return request({ url: '/exhibit/exhibit/add', method: 'post', data })
    },
}
export default exhibit