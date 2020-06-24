const asyncDataRoutes = [
    {
        "component": "layout",
        "meta": {"title": "案管部门", "icon": "iconjinduchaxun"},
        "name": "CaseManage", 
        "path": "/caseManage",
        "redirect": "/caseManage/progress",
        "children": [
            {"path": "progress", "component": "views/caseManage/progress", "name": "Progress", "meta":{ "title":"案件进度查询" }},
            {"path": "waitAssessment", "component": "views/caseManage/waitAssessment", "name": "WaitAssessment", "meta":{ "title":"等待质量评查" }},
            {   "path": "filingCondition", "component": "views/caseManage/filingCondition/index",
                "name": "FilingCondition", "meta":{ "title":"符合归档条件案件" },
                "children": [
                    {"path": "uncompleted", "component": "views/caseManage/filingCondition/uncompleted", "name": "UncompletedCase", "meta":{ "title":"未归档案件" }},
                    {"path": "completed", "component": "views/caseManage/filingCondition/completed", "name": "CompletedCase", "meta":{ "title":"已归档案件" }}
                ]
            }
        ]
    },
    {
        "component": "layout",
        "meta": {"title": "档案部门", "icon": "lock"},
        "name": "ArchivesManage", 
        "path": "/archivesManage",
        "redirect": "/archivesManage/shallCompleted",
        "children": [
            {   "path": "shallCompleted", "component": "views/archivesManage/shallCompleted/index", 
                "redirect": "/archivesManage/shallCompleted/uncompleted",
                "name": "ShallCompleted", "meta":{ "title":"应归档案件" },
                "children": [
                    {"path": "uncompleted", "component": "views/archivesManage/shallCompleted/uncompleted", "name": "UncompletedArchives", "meta":{ "title":"未归档案件" }},
                    {"path": "completed", "component": "views/archivesManage/shallCompleted/completed", "name": "CompletedArchives", "meta":{ "title":"已归档案件" }}
                ]
            },
            {   "path": "checkArchives", "component": "views/archivesManage/checkArchives/index", 
                "redirect": "/archivesManage/CheckArchives/readyItem",
                "name": "CheckArchives", "meta":{ "title":"档案检查" },
                "children": [
                    {"path": "readyItem", "component": "views/archivesManage/checkArchives/readyItem", "name": "ReadyItem", "meta":{ "title":"档案预入库" }},
                    {"path": "receiveItem", "component": "views/archivesManage/checkArchives/receiveItem", "name": "ReceiveItem", "meta":{ "title":"档案接收" }},
                    {"path": "checkItem", "component": "views/archivesManage/checkArchives/checkItem", "name": "CheckItem", "meta":{ "title":"档案检查" }}
                ]
            },
            {   "path": "checkHistory", "component": "views/archivesManage/checkHistory/index", 
                "name": "CheckHistory", "meta":{ "title":"审查记录" },
                "redirect": "/archivesManage/checkHistory/agree",
                "children": [
                    {"path": "agree", "component": "views/archivesManage/checkHistory/agree", "name": "Agree", "meta":{ "title":"通过审查" }},
                    {"path": "disagree", "component": "views/archivesManage/checkHistory/disagree", "name": "Disagree", "meta":{ "title":"未通过审查" }}
                ]
            },
            {   "path": "putStorage", "component": "views/archivesManage/putStorage/index", 
                "name": "PutStorage", "meta":{ "title":"入库上架" },
                "redirect": "/archivesManage/PutStorage/uncompleted",
                "children": [
                    {"path": "uncompleted", "component": "views/archivesManage/putStorage/uncompleted", "name": "UncompletedPut", "meta":{ "title":"待入库上架" }},
                    {"path": "completed", "component": "views/archivesManage/putStorage/completed", "name": "CompletedPut", "meta":{ "title":"已入库上架" }},
                    // {"path": "temporary", "component": "views/archivesManage/putStorage/temporary", "name": "Temporary", "meta":{ "title":"卷宗暂存" }}
                ]
            }
        ]
    },
    {
        "component": "layout",
        "meta": {"title": "档案利用", "icon": "lock"},
        "name": "UtilizeArchives", 
        "path": "/utilizeArchives",
        "redirect": "/utilizeArchives/outWarehouse",
        "children": [
            {"path": "outWarehouse", "component": "views/utilizeArchives/outWarehouse", "name": "OutWarehouse", "meta":{ "title":"档案借阅" }},
            {"path": "inWarehouse", "component": "views/utilizeArchives/inWarehouse", "name": "InWarehouse", "meta":{ "title":"档案归还" }},
            // {"path": "historyWarehouse", "component": "views/utilizeArchives/historyWarehouse", "name": "HistoryWarehouse", "meta":{ "title":"出入库记录" }}
        ]
    },
    {
        "component": "layout",
        "meta": {"title": "历史卷宗", "icon": "lock"},
        "name": "HistoryCase",
        "path": "/historyCase",
        "redirect": "/historyCase/historyCase",
        "children": [
            {"path": "historyCase", "component": "views/historyCase/historyCase", "name": "HistoryCaseItem", "meta":{ "title":"历史卷宗" }},
            {"path": "historicalCases", "component": "views/historyCase/historyCase", "name": "HistoricalCases", "meta":{ "title":"历史案件" }},
            {"path": "bySelfMatch", "component": "views/historyCase/bySelfMatch", "name": "BySelfMatch", "meta":{ "title":"人工匹配" }},
            {"path": "notBindCheck", "component": "views/historyCase/notBindCheck", "name": "NotBindCheck", "meta":{ "title":"未绑查询" }},
            {"path": "matchingHistory", "component": "views/historyCase/matchingHistory", "name": "MatchingHistory", "meta":{ "title":"匹配历史" }}
        ]
    },
    {
        "component": "layout",
        "meta": {"title": "档案绩效评价", "icon": "lock"},
        "name": "PerformanceEvaluation", 
        "path": "/performanceEvaluation",
        "redirect": "/performanceEvaluation",
        "children": [
            {"path": "performanceEvaluation", "component": "views/performanceEvaluation/index", "name": "PerformanceEvaluationItem", "meta":{ "title":"档案绩效评价" }}
        ]
    },
    {
        "component": "layout",
        "meta": {"title": "个人相关", "icon": "lock"},
        "name": "ByPersonal",
        "path": "/byPersonal",
        "redirect": "/byPersonal/archivesSituation",
        "children": [
            {   "path": "archivesSituation", "component": "views/byPersonal/archivesSituation/index", 
                "name": "ArchivesSituation", "meta":{ "title":"案件归档情况" },
                "redirect": "/byPersonal/archivesSituation/caseShallCompleted",
                "children": [
                    // {"path": "caseNum", "component": "views/byPersonal/archivesSituation/caseNum", "name": "CaseNum", "meta":{ "title":"受理案件数量" }},
                    {"path": "caseShallCompleted", "component": "views/byPersonal/archivesSituation/caseShallCompleted", "name": "CaseShallCompleted", "meta":{ "title":"应归档案件" }},
                    {"path": "waitAssessment", "component": "views/byPersonal/archivesSituation/waitAssessment", "name": "WaitAssessmentArchives", "meta":{ "title":"等待质量评查" }},
                    {"path": "unTransfer", "component": "views/byPersonal/archivesSituation/unTransfer", "name": "UnTransfer", "meta":{ "title":"未移交归档案件" }},
                    {"path": "giveBack", "component": "views/byPersonal/archivesSituation/giveBack", "name": "GiveBack", "meta":{ "title":"退回整改案件" }},
                    {"path": "notInWarehouse", "component": "views/byPersonal/archivesSituation/notInWarehouse", "name": "NotInWarehouse", "meta":{ "title":"未上架案件" }},
                    {"path": "inWarehouse", "component": "views/byPersonal/archivesSituation/inWarehouse", "name": "InWarehouseArchives", "meta":{ "title":"已归档上架案件" }}
                ]
            }
        ]
    },
    {
        "component": "layout",
        "meta": {"title": "分析评估", "icon": "lock"},
        "name": "Appraise", 
        "path": "/appraise",
        "redirect": "/appraise/qualifiedType",
        "children": [
            {"path": "qualifiedType", "component": "views/appraise/qualifiedType", "name": "QualifiedType", "meta":{ "title":"各业务类型符合归档条件" }},
            {"path": "completedType", "component": "views/appraise/completedType", "name": "CompletedType", "meta":{ "title":"各业务类型已归档案件" }},
            {"path": "uncompletedType", "component": "views/appraise/uncompletedType", "name": "UncompletedType", "meta":{ "title":"各业务类型未归档案件" }},
            {"path": "qualifiedHandler", "component": "views/appraise/qualifiedHandler", "name": "QualifiedHandler", "meta":{ "title":"办案人符合归档条件" }},
            {"path": "completedHandler", "component": "views/appraise/completedHandler", "name": "CompletedHandler", "meta":{ "title":"办案人已归档案件" }},
            {"path": "uncompletedHandler", "component": "views/appraise/uncompletedHandler", "name": "UncompletedHandler", "meta":{ "title":"办案人未归档案件" }}
        ]
    },
    {
        "component": "layout",
        "meta": {"title": "通用设置", "icon": "lock"},
        "name": "Setting", 
        "path": "/setting",
        "redirect": "/setting/unit",
        "children": [
            {"path": "addRole", "component": "views/setting/addRole", "name": "AddRole", "meta":{ "title":"路由权限组设置" }},
            {"path": "unit", "component": "views/setting/unit", "name": "Unit", "meta":{ "title":"单位设置" }},
            {"path": "department", "component": "views/setting/department", "name": "Department", "meta":{ "title":"部门设置" }},
            {"path": "position", "component": "views/setting/position", "name": "Position", "meta":{ "title":"职位设置" }},
            {"path": "PermissionGroup", "component": "views/setting/permissionGroup", "name": "PermissionGroup", "meta":{ "title":"API权限组设置" }},
            {"path": "Role", "component": "views/setting/role", "name": "Role", "meta":{ "title":"角色设置" }},
            {"path": "personnel", "component": "views/setting/personnel", "name": "Personnel", "meta":{ "title":"人员设置" }},
            {"path": "storageLocation", "component": "views/setting/storageLocation", "name": "StorageLocation", "meta":{ "title":"存储位置设置" }}
        ]
    }
]
        
export default asyncDataRoutes
