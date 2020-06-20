import request from "@/utils/request"

const setting = {
    // 未归档案件
    getUnitList(data) {
        return request({ url: '/orgGetByPage', method: 'post', data })
    },
}
export default setting
