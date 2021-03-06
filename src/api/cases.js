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
    // 新增案件
    addCaseItemData(data) {
        return request({ url: '/cases/cases/add', method: 'post', data })
    },
    // 新增案件修改
    updateCaseItemData(data) {
        return request({ url: '/cases/cases/update', method: 'post', data })
    },
    // 新增案件删除
    delCaseItemData(data) {
        return request({ url: '/cases/cases/del', method: 'post', data })
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
    // 档案通过审查操作
    confirmNone(data) {
        return request({ url: '/cases/cases/confirmNone', method: 'post', data })
    },
    // 档案未通过审查操作
    refuseConfirmNone(data) {
        return request({ url: '/cases/cases/refuseConfirmNone', method: 'post', data })
    },
    // 档案未通过审查案件
    getRefuseCase(data) {
        return request({ url: '/cases/cases/getDangAnRefuseCases', method: 'post', data })
    },
    // 重新接受档案
    reciveCaseAgain(data) {
        return request({ url: '/cases/cases/retryAcceptCase', method: 'post', data })
    },
    // 13-18年度案件列表
    casesShouliBefore2019GetByPage(data) {
        return request({ url: '/casesShouliBefore2019GetByPage', method: 'post', data })
    },
    // 18年度后案件列表
    casesShouliAfter2019GetByPage(data) {
        return request({ url: '/casesShouliAfter2019GetByPage', method: 'post', data })
    },
    // 获取未办结案件列表(点击按钮)
    getFromShouliBanJieNoInCases(data) {
        return request({ url: '/getFromShouliBanJieNoInCases', method: 'post', data })
    },
    // 获取未办结案件列表(未点击按钮)
    getFromShouliWeiBanJieNoInCases(data) {
        return request({ url: '/getFromShouliWeiBanJieNoInCases', method: 'post', data })
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
        return request({ url: '/chart/area/getStockCountByAreaLaDao', method: 'post', data })
    },
    caseJaugeAll(data){
        return request({ url: '/chart/city/getStockPersentByCityLaDao', method: 'post', data })
    },
    caseJaugeSlrq(data){
        return request({ url: '/chart/area/getStockCountBySlrqAreaLaDao', method: 'post', data })
    },
    caseJaugeAllSlrq(data){
        return request({ url: '/chart/city/getStockPersentBySlrqCityLaDao', method: 'post', data })
    },
    // 案件预入库
    yrExhibitGetByPage(data){
        return request({ url: '/yrExhibitGetByPage', method: 'post', data })
    },
    // 案件预新增案件入库
    yrExhibitAdd(data){
        return request({ url: '/exhibit/exhibit/addYrExhibit', method: 'post', data })
    },
    // 获取个人受理案件列表
    casesShouliGetByPage(data){
        return request({ url: '/casesShouliGetByPage', method: 'post', data })
    },
    // 获取不规范结案列表
    casesShouliBuGuiFanJieAnGetByPage(data){
        return request({ url: '/casesShouliBuGuiFanJieAnGetByPage', method: 'post', data })
    },
    // 获取多案并卷拆卷
    getDismantleList(data){
        return request({ url: '/cases/cases/getByPage', method: 'post', data })
    },
    // 拆卷
    dismantleCase(data){
        return request({ url: '/exhibit/exhibit/isReduceCase', method: 'post', data })
    },
    //时效评价  补打条码
    printAgains(data){
        return request({ url: '/exhibit/exhibit/printAgain', method: 'post', data })
    },
    //时效评价  条码打印事件
    printClicks(data){
        return request({ url: '/exhibit/exhibit/add', method: 'post', data })
    },
    //时效评价 关键字模糊查询提示2020
    updateForInss(data){
        return request({ url: '/cases/cases/confirmNone', method: 'post', data })
    },
    updateForCheckss(data){
        return request({ url: '/cases/cases/confirmPingCha', method: 'post', data })
    },
    getNameList2s(data){
        return request({ url: '/user/getByPage', method: 'post', data })
    },
    getNameLists(data){
        return request({ url: '/cases/cases/getCasesName', method: 'post', data })
    },
    getNumBages(data){
        return request({ url: '/cases/cases/getCountForType', method: 'post', data })
    },
    zuofeiClicks(data){
        return request({ url: '/exhibit/exhibit/update', method: 'post', data })
    },
    getDataLists(case_take_user_name,pageNum,pageSize,case_name,case_bh,timeYear,time_status,anguan_pingcha_chaoqi,case_type_id){
        return request({ url: '/cases/cases/getCaseJinDuByPage', method: 'post', data:{case_take_user_name,pageNum,pageSize,case_name,case_bh,timeYear,time_status,anguan_pingcha_chaoqi,case_type_id} })
    },
    //获取案件类型设置列表
    getcasetype(org_id){
        return request({ url: '/cases/case-type/getTypeTree', method: 'post',data:{org_id}})
    },
    //can_easy_pingcha 0  删除
    delcasetype(case_type_org_id){
        return request({ url: '/caseTypeOrgDel', method: 'post',data:{case_type_org_id}})
    },
    //can_easy_pingcha 1  改成一件评查
    addcasetype(case_type_ids,org_id){
        return request({ url: '/caseTypeOrgUpdateAllByOrgId', method: 'post',data:{case_type_ids,org_id}})
    },
    // // 多选多机构重置
    restcasetype(case_type_ids){
        return request({ url:'/caseTypeOrgUpdateAll', method: 'post',data:{case_type_ids}})
    },
    // //多选重置
    // restallcasetype(case_type_ids,org_id){
    //     return request({url:'/caseTypeOrgUpdateAllByOrgId',method:'post',data:{case_type_ids,org_id}})
    // }
    // 获取不能一键评查的案件类型
    caseTypeOrgGet(){
        return request({ url: '/caseTypeOrgGet', method: 'post'})
    },
    //延期胶卷按钮
    yanqitime(data){
        return request({ url: '/yanqiPingchaAdd', method: 'post',data})
    },
    //延期案件角标
    yanqijb(){
        return request({ url: '/cases/cases/getCountForType', method: 'post',data:{cout_for:'yanqi'}})
    },
    //延期中案件查询
    yanqilist(data){
        return request({ url: '/cases/cases/getYanQiByPage', method: 'post',data})
    },
    //延期记录
    yanqihistory(data){
        return request({ url: '/yanqiPingchaGetByPage', method: 'post',data})
    },
    //结束延期
    endyanqi(case_id){ 
        return request({ url: '/cases/cases/removeYanqi', method: 'post',data:{case_id}})
    },
    //导入历史
    gethistory(data){
        return request({url:'/caseExcelHeadGetByPage',method:'post',data})
    },
    //确定案件信息
    subcase(data){
        return request({url:'/caseExcelLineUpdateLines',method:'post',data})
    },
    //修改个人信息
    updateinfo(dept_id,password){
        return request({url:'/user/updatePass',method:'post',data:{dept_id,password}})
    },
    //获取修改部门列表
    bmlist(data){
        return request({url:'/dept/get',method:'post',data})
    },
    //示例模板下载
    dowonload(){
        return request({url:'/caseExcelUrlGet',method:'post'})
    },
    //导入信息修改
    updatedetal(data){
        return request({url:'/caseExcelLineUpdate',method:'post',data})
    },
    // 储存位置  更换储存位置
    updatecc(){
        return request({url:'/shale/shale/get',method:'post'})
    },
    // 档案-案卷接收-预收卷-接收案件
    receptionCase(data){
        return request({url:'/cases/cases/getFromCasesShouli',method:'post',data})
    },


}
export default cases