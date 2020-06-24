import request from '@/utils/request'
// 案件操作
const cases = {
    // 案件大类
    getCaseType(data) {
        return request({ url: '/cases/case-type/caseTypeOneGet', method: 'post', data })
    },
    // 获取对应角标信息
    getCornerMarkType(data) {
        return request({ url: '/cases/cases/getCountForType', method: 'post', data })
    },
    getProgressCase(data) {
        return request({ url: '/cases/cases/getCaseJinDuByPage', method: 'post', data })
    },
    getAwaitEvaluation (data) {
        return request({ url: '/cases/cases/getNotConfirmByPage', method: 'post', data })
    },
    // 未归档案件
    getDangAnWeiGui(data) {
        return request({ url: '/cases/cases/getDangAnWeiGui', method: 'post', data })
    },
    // 已入库案件
    getInByPage(data) {
        return request({ url: '/cases/cases/getInByPage', method: 'post', data })
    }, 
    // 符合归档条件案件
    getConfirmedByPage(data) {
        return request({ url: '/cases/cases/getConfirmedByPage', method: 'post', data })
    },
    // 档案待审查的案件
    getDangAnNotConfirmByPage(data) {
        return request({ url: '/cases/cases/getDangAnNotConfirmByPage', method: 'post', data })
    },
    // 档案通过审查案件
    getDangAnConfirmByPage(data) {
        return request({ url: '/cases/cases/getDangAnConfirmByPage', method: 'post', data })
    },
    // 未归档案件
    getUndocumented(data) {
        return request({ url: '/cases/cases/getConfirmedNoneByPage', method: 'post', data })
    },

    // 档案管理
    // 档案未通过审查案件
    caseRefuseHistoryGetByPage(data) {
        return request({ url: '/caseRefuseHistoryGetByPage', method: 'post', data })
    },
    // 档案通过审查操作
    confirmNone(data) {
        return request({ url: '/cases/cases/confirmNone', method: 'post', data })
    },
    // 档案未通过审查案件
    refuseConfirmNone(data) {
        return request({ url: '/cases/cases/refuseConfirmNone', method: 'post', data })
    },

    // 分析评估
    // 各业务类型符合归档条件
    getConfirmedNotInByPage(data) {
        return request({ url: '/cases/cases/getConfirmedNotInByPage', method: 'post', data })
    },
    // 个人相关
    // 等待质量评查
    getGeRenNotConfirmByPage(data) {
        return request({ url: '/cases/cases/getGeRenNotConfirmByPage', method: 'post', data })
    },
    //  未归档案件
    getBiGuiByPage(data) {
        return request({ url: '/cases/cases/getBiGuiByPage', method: 'post', data })
    },
    //  应归档案件
    getAllByPage(data) {
        return request({ url: '/cases/cases/getAllByPage', method: 'post', data })
    },
    //档案利用
    //查询卷宗类型 如：诉讼 文书 技术
    getExhibitType(){
        return request({ url: '/exhibitTypeGet', method: 'post' })
    },
    //  未绑案件查询
    getCasesByPage(data) {
        return request({ url: '/cases/cases/getCasesByPage', method: 'post', data })
    },
    //  模糊查询符合条件的案件
    getLikeCases(data) {
        return request({ url: '/cases/cases/getLikeCases', method: 'post', data })
    },
    //  个人整改的案件
    caseRefuseHistoryGetByPage(data) {
        return request({ url: '/caseRefuseHistoryGetByPage', method: 'post', data })
    },
    //档案绩效评价
    //地市查询归档率
    caseJauge(data){
        return request({ url: '/chart/area/getStockCountByArea', method: 'post', data })
    },
    caseJaugeAll(data){
        return request({ url: '/chart/city/getStockPersentByCity', method: 'post', data })
    },
    // 案件预入库
    yrExhibitGetByPage(data){
        return request({ url: '/yrExhibitGetByPage', method: 'post', data })
    },
    // 案件预新增案件入库
    yrExhibitAdd(data){
        return request({ url: '/yrExhibitAdd', method: 'post', data })
    },
    //档案绩效评价
    //基层院查询归档率
    // caseJauge(data){
    //     return request({ url: '/chart/area/getStockCountByArea', method: 'post', data })
    // }
}
export default cases