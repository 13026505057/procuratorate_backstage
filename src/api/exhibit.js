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
    //获取待出库案卷列表
    getExhibitOut(data){
        return request({ url: '/user/approve/getWaitOutByPage', method: 'post', data })
    },
    //卷宗出库
    exhibitOut(data){
        return request({ url: '/user/approve/out', method: 'post', data })
    },
    // 获取待归还列表 
    getBorrowList(data){
        return request({ url: '/borrowLog/getOutByPage', method: 'post', data }) 
    },
    //卷宗入库
    exhibitIn(data){
        return request({ url: '/stock/stock/in', method: 'post', data })
    },
    // 未绑历史案卷
    historyExhibitList(data) {
        return request({ url: '/exhibit/exhibit/getOldByPage', method: 'post', data })
    },
    // 新增案卷信息
    addOldExhibit(data) {
        return request({ url: '/exhibit/exhibit/addOldExhibit', method: 'post', data })
    },
    // 匹配案卷历史信息
    getExhibitLogsByPage(data) {
        return request({ url: '/exhibit/exhibit/getExhibitLogsByPage', method: 'post', data })
    },
    // 案卷匹配信息
    getExhibitLikeCases(data) {
        return request({ url: '/exhibit/exhibit/getExhibitLikeCases', method: 'post', data })
    },
    // 案卷绑定案件信息
    attachExhibitToCase(data) {
        return request({ url: '/exhibit/exhibit/attachExhibitToCase', method: 'post', data })
    },
    //查询存储设备信息
    getStock(data){
        return request({ url: '/shale/shale/getByPage', method: 'post', data })
    },
    //打印存储设备码
    printCode(data){
        return request({ url: '/shale/shale/printShaleCode', method: 'post', data })
    },
    //新增存储设备
    addStock(data){
        return request({ url: '/shale/shale/add', method: 'post', data })
    },
    //换取卷宗id
    getIds(data){
        return request({ url: '/stock/stock/getScanCode', method: 'post', data })
    },
}
export default exhibit