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
    // 档案通过审查案件
    getDangAnConfirmByPage(data) {
        return request({ url: '/cases/cases/getDangAnConfirmByPage', method: 'post', data })
    },
}
export default cases