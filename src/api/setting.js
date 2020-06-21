import request from "@/utils/request"

const setting = {
    // 获取案件时间状态设置
    caseTimeStatus(data) {
        return request({ url: '/caseTimeStatusGet', method: 'post', data })
    },
    // 单位设置
    getUnitList(data) {
        return request({ url: '/orgGetByPage', method: 'post', data })
    },
    // 新增单位
    addUnit(data) {
        return request({ url: '/orgAdd', method: 'post', data })
    },
    // 修改单位
    updateUnit(data) {
        return request({ url: '/orgUpdate', method: 'post', data })
    },
}
export default setting
