import request from "@/utils/request"

const setting = {
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
