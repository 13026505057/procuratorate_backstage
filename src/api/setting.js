import request from "@/utils/request"

const setting = {
    // 获取案件时间状态设置
    caseTimeStatus(data) {
        return request({ url: '/caseTimeStatusGet', method: 'post', data })
    },
    // 获取案件状态设置
    getStockStatus(data) {
        return request({ url: '/exhibitStockStatusGet', method: 'post', data })
    },
    // 获取案卷类型状态设置
    getExhibitType(data) {
        return request({ url: '/exhibitTypeGet', method: 'post', data })
    },
    // 获取储存案卷时间设置
    getExhibitTimeStatus(data) {
        return request({ url: '/exhibitBgqxGet', method: 'post', data })
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
    getDepartmentAllList(data) {
        return request({ url: '/dept/get', method: 'post', data })
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
    // 权限组
    getPermissionGroupList(data) {
        return request({ url: '/groupGetByPage', method: 'post', data })
    },
    getJurisdictionList(data) {
        return request({ url: '/permissionGetByPage', method: 'post', data })
    },
    addJurisdiction(data) {
        return request({ url: '/groupAdd', method: 'post', data })
    },
    updateJurisdiction(data) {
        return request({ url: '/groupUpdate', method: 'post', data })
    },
    deleteJurisdiction(data) {
        return request({ url: '/groupDel', method: 'post', data })
    },
    addRole(data) {
        return request({ url: '/roleAdd', method: 'post', data })
    },
    updateRole(data) {
        return request({ url: '/roleUpdate', method: 'post', data })
    },
    deleteRole(data) {
        return request({ url: '/roleDel', method: 'post', data })
    },
    // 人员
    getPersonnelList(data) {
        return request({ url: '/user/getByPage', method: 'post', data })
    },
    addPersonnel(data) {
        return request({ url: '/user/add', method: 'post', data })
    },
    updatePersonnel(data) {
        return request({ url: '/user/update', method: 'post', data })
    },
    deletePersonnel(data) {
        return request({ url: '/user/del', method: 'post', data })
    },
    // 存储位置
    getStorageList(data) {
        return request({ url: '/shale/shale/getByPage', method: 'post', data })
    },
    //获取打印机
    getPrintList(data){
        return request({ url: '/orgPrintGetByPage', method: 'post', data })
    },
    //添加打印机
    addPrint(data){
        return request({ url: '/orgPrintAdd', method: 'post', data })
    },
    //更新柜子存储位置
    updateOldCellToNewCell(data){
        return request({ url: '/stock/stock/updateOldCellToNewCell', method: 'post', data })
    },
    

}
export default setting
