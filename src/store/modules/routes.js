const asyncDataRoutes = [
    {
        "component": "layout",
        "meta": {"title": "案管部门", "icon": "icon-danganhe"},
        "name": "案管部门 - CaseManage", 
        "path": "/caseManage",
        "redirect": "/caseManage/progress",
        "children": [
            {"path": "progress", "component": "views/caseManage/progress", "name": "案件进度查询 - Progress", "meta":{ "title":"案件进度查询","icon": "icon-jinduchaxun" }},
            {"path": "waitAssessment", "component": "views/caseManage/waitAssessment", "name": "等待质量评查 - WaitAssessment", "meta":{ "title":"等待质量评查","icon": "icon-zhiliangpingcha" }},
            {"path": "shallCompletedAllCase", "component": "views/caseManage/shallCompletedAllCase", "name": "所有应归档案件 - ShallCompletedAllCase", "meta":{ "title":"所有应归档案件","icon": "icon-zhiliangpingcha" }},
            {   "path": "filingCondition", "component": "views/caseManage/filingCondition/index",
                "name": "符合归档条件案件 - FilingCondition", "meta":{ "title":"符合归档条件案件","icon": "icon-jinduchaxun" },
                "children": [
                    {"path": "uncompleted", "component": "views/caseManage/filingCondition/uncompleted", "name": "未归档案件 - UncompletedCase", "meta":{ "title":"未归档案件","icon": "icon-jinduchaxun" }},
                    {"path": "completed", "component": "views/caseManage/filingCondition/completed", "name": "已归档案件 - CompletedCase", "meta":{ "title":"已归档案件","icon": "icon-zhiliangpingcha" }}
                ]
            }
        ]
    },
    {
        "component": "layout",
        "meta": {"title": "档案部门", "icon": "icon-danganhe"},
        "name": "档案部门 - ArchivesManage", 
        "path": "/archivesManage",
        "redirect": "/archivesManage/shallCompletedAll",
        "children": [
            {"path": "shallCompletedAll", "component": "views/archivesManage/shallCompletedAll", "name": "所有应归档案件 - ShallCompletedAll", "meta":{ "title":"所有应归档案件","icon": "icon-jinduchaxun" }},
            {   "path": "shallCompleted", "component": "views/archivesManage/shallCompleted/index", 
                "redirect": "/archivesManage/shallCompleted/uncompleted",
                "name": "应归档案件 - ShallCompleted", "meta":{ "title":"应归档案件","icon": "icon-zhiliangpingcha" },
                "children": [
                    {"path": "uncompleted", "component": "views/archivesManage/shallCompleted/uncompleted", "name": "未归档案件 - UncompletedArchives", "meta":{ "title":"未归档案件","icon": "icon-zhiliangpingcha" }},
                    {"path": "completed", "component": "views/archivesManage/shallCompleted/completed", "name": "已归档案件 - CompletedArchives", "meta":{ "title":"已归档案件","icon": "icon-zhiliangpingcha" }}
                ]
            },
            {   "path": "checkArchives", "component": "views/archivesManage/checkArchives/index", 
                "redirect": "/archivesManage/CheckArchives/readyItem",
                "name": "案卷接收 - CheckArchives", "meta":{ "title":"案卷接收","icon": "icon-zhiliangpingcha" },
                "children": [
                    {"path": "receiveItem", "component": "views/archivesManage/checkArchives/receiveItem", "name": "案卷接收（入库） - ReceiveItem", "meta":{ "title":"案卷接收（入库）","icon": "icon-zhiliangpingcha" }},
                    {"path": "readyItem", "component": "views/archivesManage/checkArchives/readyItem", "name": "案卷预入库 - ReadyItem", "meta":{ "title":"案卷预入库","icon": "icon-zhiliangpingcha" }},
                    {"path": "bindReadyItem", "component": "views/archivesManage/checkArchives/bindReadyItem", "name": "预入库绑定 - BindReadyItem", "meta":{ "title":"预入库绑定","icon": "icon-zhiliangpingcha" }},
                    {"path": "allCaseMaterials", "component": "views/archivesManage/checkArchives/allCaseMaterials", "name": "所有案卷 - AllCaseMaterials", "meta":{ "title":"所有案卷","icon": "icon-zhiliangpingcha" }}
                ]
            },
            {   "path": "exhibitDoubt", "component": "views/archivesManage/exhibitDoubt/index", 
                "redirect": "/archivesManage/exhibitDoubt/mergeRequest",
                "name": "问题处理 - ExhibitDoubt", "meta":{ "title":"问题处理","icon": "icon-zhiliangpingcha" },
                "children": [
                    {"path": "finishStatus", "component": "views/archivesManage/exhibitDoubt/finishStatus", "name": "案件办结情况查询 - FinishStatus", "meta":{ "title":"案件办结情况查询","icon": "icon-zhiliangpingcha" }},
                    {"path": "wasDeleteExhibite", "component": "views/archivesManage/exhibitDoubt/wasDeleteExhibite", "name": "已作废案卷查询 - WasDeleteExhibite", "meta":{ "title":"已作废案卷查询","icon": "icon-zhiliangpingcha" }},
                    {"path": "mergeRequest", "component": "views/archivesManage/exhibitDoubt/mergeRequest", "name": "多案并卷 - MergeRequest", "meta":{ "title":"多案并卷","icon": "icon-zhiliangpingcha" }},
                    {"path": "BySelfMatchDoubt", "component": "views/archivesManage/exhibitDoubt/bySelfMatchDoubt", "name": "人工匹配 - BySelfMatchDoubt", "meta":{ "title":"人工匹配","icon": "icon-zhiliangpingcha" }},
                ]
            },
            {"path": "checkItem", "component": "views/archivesManage/checkItem", "name": "档案审查 - CheckItem", "meta":{ "title":"档案审查","icon": "icon-jinduchaxun" }},
            {   "path": "checkHistory", "component": "views/archivesManage/checkHistory/index", 
                "name": "审查记录 - CheckHistory", "meta":{ "title":"审查记录","icon": "icon-zhiliangpingcha" },
                "redirect": "/archivesManage/checkHistory/agree",
                "children": [
                    {"path": "agree", "component": "views/archivesManage/checkHistory/agree", "name": "退查中案件 - Agree", "meta":{ "title":"退查中案件","icon": "icon-zhiliangpingcha" }},
                    {"path": "history", "component": "views/archivesManage/checkHistory/history", "name": "审查记录 - History", "meta":{ "title":"审查记录","icon": "icon-zhiliangpingcha" }}
                ]
            },
            {   "path": "putStorage", "component": "views/archivesManage/putStorage/index", 
                "name": "入库上架 - PutStorage", "meta":{ "title":"入库上架","icon": "icon-zhiliangpingcha" },
                "redirect": "/archivesManage/PutStorage/uncompleted",
                "children": [
                    {"path": "uncompleted", "component": "views/archivesManage/putStorage/uncompleted", "name": "进行入库上架 - UncompletedPut", "meta":{ "title":"进行入库上架","icon": "icon-zhiliangpingcha" }},
                    {"path": "uncompletedExhibit", "component": "views/archivesManage/putStorage/uncompletedExhibit", "name": "待入库上架案卷 - UnCompletedPutExhibit", "meta":{ "title":"待入库上架案卷","icon": "icon-zhiliangpingcha" }},
                    {"path": "completedExhibit", "component": "views/archivesManage/putStorage/completedExhibit", "name": "已入库上架案卷 - CompletedPutExhibit", "meta":{ "title":"已入库上架案卷","icon": "icon-zhiliangpingcha" }}
                ]
            }
        ]
    },
    {
        "component": "layout",
        "meta": {"title": "档案利用", "icon": "lock"},
        "name": "档案利用 - UtilizeArchives", 
        "path": "/utilizeArchives",
        "redirect": "/utilizeArchives/outWarehouse",
        "children": [
            {"path": "outWarehouse", "component": "views/utilizeArchives/outWarehouse", "name": "档案借阅 - OutWarehouse", "meta":{ "title":"档案借阅","icon": "icon-zhiliangpingcha" }},
            {"path": "inWarehouse", "component": "views/utilizeArchives/inWarehouse", "name": "档案归还 - InWarehouse", "meta":{ "title":"档案归还","icon": "icon-zhiliangpingcha" }}
        ]
    },
    {
        "component": "layout",
        "meta": {"title": "历史卷宗", "icon": "lock"},
        "name": "历史卷宗 - HistoryCase",
        "path": "/historyCase",
        "redirect": "/historyCase/historyCase",
        "children": [
            {"path": "historyCase", "component": "views/historyCase/historyCase", "name": "历史案卷导入 - HistoryCaseItem", "meta":{ "title":"历史案卷导入","icon": "icon-zhiliangpingcha" }},
            {"path": "historicalCases", "component": "views/historyCase/historyCase", "name": "新增历史案卷 - HistoricalCases", "meta":{ "title":"新增历史案卷","icon": "icon-zhiliangpingcha" }},
            {"path": "bySelfMatch", "component": "views/historyCase/bySelfMatch", "name": "人工匹配 - BySelfMatch", "meta":{ "title":"人工匹配","icon": "icon-zhiliangpingcha" }},
            {"path": "notBindCheck", "component": "views/historyCase/notBindCheck", "name": "未绑查询 - NotBindCheck", "meta":{ "title":"未绑查询","icon": "icon-zhiliangpingcha" }},
            {"path": "matchingHistory", "component": "views/historyCase/matchingHistory", "name": "匹配历史 - MatchingHistory", "meta":{ "title":"匹配历史","icon": "icon-zhiliangpingcha" }}
        ]
    },
    {
        "component": "layout",
        "meta": {"title": "档案绩效评价", "icon": "lock"},
        "name": "档案绩效评价 - PerformanceEvaluation", 
        "path": "/performanceEvaluation",
        "redirect": "/performanceEvaluation",
        "children": [
            {"path": "performanceEvaluation", "component": "views/performanceEvaluation/index", "name": "档案绩效评价 - PerformanceEvaluationItem", "meta":{ "title":"档案绩效评价","icon": "icon-zhiliangpingcha" }}
        ]
    },
    {
        "component": "layout",
        "meta": {"title": "个人相关", "icon": "lock"},
        "name": "个人相关 - ByPersonal",
        "path": "/byPersonal",
        "redirect": "/byPersonal/archivesSituation",
        "children": [
            {   "path": "personalAcceptance", "component": "views/byPersonal/personalAcceptance/index", "name": "个人受理案件 - PersonalAcceptance", "meta":{ "title":"个人受理案件","icon": "icon-zhiliangpingcha" } },
            {   "path": "uploadAcceptance", "component": "views/byPersonal/uploadAcceptance/index", "name": "受理案件上传 - UploadAcceptance", "meta":{ "title":"受理案件上传","icon": "icon-zhiliangpingcha" } },
            {   "path": "archivesSituation", "component": "views/byPersonal/archivesSituation/index", 
                "name": "案件归档情况 - ArchivesSituation", "meta":{ "title":"案件归档情况","icon": "icon-zhiliangpingcha" },
                "redirect": "/byPersonal/archivesSituation/caseShallCompleted",
                "children": [
                    {"path": "caseShallCompleted", "component": "views/byPersonal/archivesSituation/caseShallCompleted", "name": "应归档案件 - CaseShallCompleted", "meta":{ "title":"应归档案件","icon": "icon-zhiliangpingcha" }},
                    {"path": "waitAssessment", "component": "views/byPersonal/archivesSituation/waitAssessment", "name": "等待质量评查 - WaitAssessmentArchives", "meta":{ "title":"等待质量评查","icon": "icon-zhiliangpingcha" }},
                    {"path": "unTransfer", "component": "views/byPersonal/archivesSituation/unTransfer", "name": "未移交归档案件 - UnTransfer", "meta":{ "title":"未移交归档案件","icon": "icon-zhiliangpingcha" }},
                    {"path": "giveBack", "component": "views/byPersonal/archivesSituation/giveBack", "name": "退回整改案件 - GiveBack", "meta":{ "title":"退回整改案件","icon": "icon-zhiliangpingcha" }},
                    {"path": "notInWarehouse", "component": "views/byPersonal/archivesSituation/notInWarehouse", "name": "未上架案件 - NotInWarehouse", "meta":{ "title":"未上架案件","icon": "icon-zhiliangpingcha" }},
                    {"path": "inWarehouse", "component": "views/byPersonal/archivesSituation/inWarehouse", "name": "已归档上架案件 - InWarehouseArchives", "meta":{ "title":"已归档上架案件","icon": "icon-zhiliangpingcha" }}
                ]
            }
        ]
    },
    {
        "component": "layout",
        "meta": {"title": "分析评估", "icon": "lock"},
        "name": "分析评估 - Appraise", 
        "path": "/appraise",
        "redirect": "/appraise/qualifiedType",
        "children": [
            {"path": "qualifiedRank", "component": "views/appraise/qualifiedRank", "name": "归档率排名 - QualifiedRank", "meta":{ "title":"归档率排名","icon": "icon-zhiliangpingcha" }},
            {"path": "litigationCase", "component": "views/appraise/litigationCase", "name": "诉讼档案归档情况 - LitigationCase", "meta":{ "title":"诉讼档案归档情况","icon": "icon-zhiliangpingcha" }},
            {"path": "qualifiedType", "component": "views/appraise/qualifiedType", "name": "各业务类型符合归档条件 - QualifiedType", "meta":{ "title":"各业务类型符合归档条件","icon": "icon-zhiliangpingcha" }},
            {"path": "completedType", "component": "views/appraise/completedType", "name": "各业务类型已归档案件 - CompletedType", "meta":{ "title":"各业务类型已归档案件","icon": "icon-zhiliangpingcha" }},
            {"path": "uncompletedType", "component": "views/appraise/uncompletedType", "name": "各业务类型未归档案件 - UncompletedType", "meta":{ "title":"各业务类型未归档案件","icon": "icon-zhiliangpingcha" }},
            {"path": "qualifiedHandler", "component": "views/appraise/qualifiedHandler", "name": "办案人符合归档条件 - QualifiedHandler", "meta":{ "title":"办案人符合归档条件","icon": "icon-zhiliangpingcha" }},
            {"path": "completedHandler", "component": "views/appraise/completedHandler", "name": "办案人已归档案件 - CompletedHandler", "meta":{ "title":"办案人已归档案件","icon": "icon-zhiliangpingcha" }},
            {"path": "uncompletedHandler", "component": "views/appraise/uncompletedHandler", "name": "办案人未归档案件 - UncompletedHandler", "meta":{ "title":"办案人未归档案件","icon": "icon-zhiliangpingcha" }},
            {"path": "agingEvaluate", "component": "views/appraise/agingEvaluate", "name": "时效评价 - AgingEvaluate", "meta":{ "title":"时效评价","icon": "icon-zhiliangpingcha" }}
        ]
    },
    {
        "component": "layout",
        "meta": {"title": "通用设置", "icon": "lock"},
        "name": "通用设置 - Setting", 
        "path": "/setting",
        "redirect": "/setting/unit",
        "children": [
            {"path": "addRole", "component": "views/setting/addRole", "name": "路由权限组设置 - AddRole", "meta":{ "title":"路由权限组设置","icon": "icon-zhiliangpingcha" }},
            {"path": "unit", "component": "views/setting/unit", "name": "单位设置 - Unit", "meta":{ "title":"单位设置","icon": "icon-zhiliangpingcha" }},
            {"path": "department", "component": "views/setting/department", "name": "部门设置 - Department", "meta":{ "title":"部门设置","icon": "icon-zhiliangpingcha" }},
            {"path": "position", "component": "views/setting/position", "name": "职位设置 - Position", "meta":{ "title":"职位设置","icon": "icon-zhiliangpingcha" }},
            {"path": "PermissionGroup", "component": "views/setting/permissionGroup", "name": "API权限组设置 - PermissionGroup", "meta":{ "title":"API权限组设置","icon": "icon-zhiliangpingcha" }},
            {"path": "Role", "component": "views/setting/role", "name": "角色设置 - Role", "meta":{ "title":"角色设置","icon": "icon-zhiliangpingcha" }},
            {"path": "personnel", "component": "views/setting/personnel", "name": "人员设置 - Personnel", "meta":{ "title":"人员设置","icon": "icon-zhiliangpingcha" }},
            {"path": "storageLocation", "component": "views/setting/storageLocation", "name": "存储位置设置 - StorageLocation", "meta":{ "title":"存储位置设置","icon": "icon-zhiliangpingcha" }},
            {"path": "printSetting", "component": "views/setting/printSetting", "name": "打印机设置 - PrintSetting", "meta":{ "title":"打印机设置","icon": "icon-zhiliangpingcha" }}
        ]
    }
]
        
export default asyncDataRoutes
