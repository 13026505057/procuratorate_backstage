import request from '@/utils/request'

const caseManagement = {
    // 案件大类
    getCaseType(data) {
        return request({ url: '/cases/case-type/caseTypeOneGet', method: 'post', data })
    },
    getCornerMarkType(data) {
        return request({ url: '/cases/cases/getCountForType', method: 'post', data })
    },
    getProgressCase(data) {
        return request({ url: '/cases/cases/getCaseJinDuByPage', method: 'post', data })
    },
    getAwaitEvaluation (data) {
        return request({ url: '/cases/cases/getNotConfirmByPage', method: 'post', data })
    },
    
}
export default caseManagement