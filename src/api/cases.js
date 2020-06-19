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
    // 未归档案件
    getDangAnWeiGui(data) {
        return request({ url: '/cases/cases/getDangAnWeiGui', method: 'post', data })
    },
    // 已入库案件
    getInByPage(data) {
        return request({ url: '/cases/cases/getInByPage', method: 'post', data })
    },
}
export default cases