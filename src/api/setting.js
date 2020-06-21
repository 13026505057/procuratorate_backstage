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
    deleteUnit(data) {
        return request({ url: '/orgDel', method: 'post', data })
    },
    // 部门
    getDepartmentList(data) {
        return request({ url: '/dept/getByPage', method: 'post', data })
    },
    addDepartment(data) {
        return request({ url: '/dept/add', method: 'post', data })
    },
    updateDepartment(data) {
        return request({ url: '/dept/update', method: 'post', data })
    },
    deleteDepartment(data) {
        return request({ url: '/dept/del', method: 'post', data })
    },
    // 职位
    getPositionList(data) {
        return request({ url: '/position/getByPage', method: 'post', data })
    },
    addPosition(data) {
        return request({ url: '/position/add', method: 'post', data })
    },
    updatePosition(data) {
        return request({ url: '/position/update', method: 'post', data })
    },
    deletePosition(data) {
        return request({ url: '/position/del', method: 'post', data })
    },

}
export default setting
