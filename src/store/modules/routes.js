const asyncDataRoutes = [
    {
        component: 'layout',
        meta: {title: "案管部门", icon: "lock"},
        name: "CaseManage", 
        path: "/caseManage",
        redirect: "/caseManage/progress",
        children: [
            {path: "/progress", component: 'views/caseManage/progress', name: "Progress", meta:{ title:'案件进度查询' }},
            {path: "/waitAssessment", component: 'views/caseManage/waitAssessment', name: "WaitAssessment", meta:{ title:'等待质量评查' }},
            {   path: "/filingCondition", component: 'views/caseManage/filingCondition/uncompleted', 
                name: "FilingCondition", meta:{ title:'符合归档条件案件' },
                children: [
                    {path: "/uncompleted", component: 'views/caseManage/uncompleted', name: "Uncompleted_Case", meta:{ title:'未归档案件' }},
                    {path: "/completed", component: 'views/caseManage/completed', name: "Completed_Case", meta:{ title:'已归档案件' }},
                ]
            },
        ],
    },
    {
        component: 'layout',
        meta: {title: "档案管理", icon: "lock"},
        name: "ArchivesManage", 
        path: "/archivesManage",
        redirect: "/archivesManage/uncompleted",
        children: [
            {   path: "shallCompleted", component: 'views/archivesManage/shallCompleted/uncompleted', 
                name: "ShallCompleted", meta:{ title:'应归档案件' },
                children: [
                    {path: "uncompleted", component: 'views/archivesManage/shallCompleted/uncompleted', name: "Uncompleted_Archives", meta:{ title:'未归档案件' }},
                    {path: "completed", component: 'views/archivesManage/shallCompleted/completed', name: "Completed_Archives", meta:{ title:'已归档案件' }},
                ]
            },
            {path: "checkArchives", component: 'views/archivesManage/checkArchives', name: "CheckArchives", meta:{ title:'档案审查' }},
            {   path: "checkHistory", component: 'views/archivesManage/checkHistory/agree', 
                name: "CheckHistory", meta:{ title:'审查记录' },
                children: [
                    {path: "agree", component: 'views/archivesManage/checkHistory/agree', name: "Agree", meta:{ title:'通过审查' }},
                    {path: "disagree", component: 'views/archivesManage/checkHistory/disagree', name: "Disagree", meta:{ title:'未通过审查' }},
                ]
            },
            {   path: "putStorage", component: 'views/archivesManage/putStorage/uncompleted', 
                name: "PutStorage", meta:{ title:'入库上架' },
                children: [
                    {path: "uncompleted", component: 'views/archivesManage/putStorage/uncompleted', name: "Uncompleted_Put", meta:{ title:'待入库上架' }},
                    {path: "completed", component: 'views/archivesManage/putStorage/completed', name: "Completed_Put", meta:{ title:'已入库上架' }},
                    {path: "temporary", component: 'views/archivesManage/putStorage/temporary', name: "Temporary", meta:{ title:'卷宗暂存' }},
                ]
            },
        ],
    },
    {
        component: 'layout',
        meta: {title: "档案利用", icon: "lock"},
        name: "UtilizeArchives", 
        path: "/utilizeArchives",
        redirect: "/utilizeArchives/outWarehouse",
        children: [
            {path: "outWarehouse", component: 'views/utilizeArchives/outWarehouse', name: "OutWarehouse", meta:{ title:'档案借阅（出库）' }},
            {path: "inWarehouse", component: 'views/utilizeArchives/inWarehouse', name: "InWarehouse", meta:{ title:'档案归还（入库）' }},
            {path: "historyWarehouse", component: 'views/utilizeArchives/historyWarehouse', name: "HistoryWarehouse", meta:{ title:'出入库记录' }},
        ],
    },
    {
        component: 'layout',
        meta: {title: "历史卷宗", icon: "lock"},
        name: "HistoryCase_F", 
        path: "historyCase_F",
        redirect: "/historyCase",
        children: [
            {path: "historyCase", component: 'views/historyCase/index', name: "HistoryCase", meta:{ title:'历史卷宗' }},
        ],
    },
    {
        component: 'layout',
        meta: {title: "档案绩效评价", icon: "lock"},
        name: "PerformanceEvaluation_F", 
        path: "performanceEvaluation_F",
        redirect: "/performanceEvaluation",
        children: [
            {path: "performanceEvaluation", component: 'views/performanceEvaluation/index', name: "PerformanceEvaluation", meta:{ title:'档案绩效评价' }},
        ],
    },
    {
        component: 'layout',
        meta: {title: "个人相关", icon: "lock"},
        name: "ByPersonal_F", 
        path: "byPersonal_F",
        redirect: "/byPersonal",
        children: [
            {path: "byPersonal", component: 'views/byPersonal/index', name: "ByPersonal", meta:{ title:'个人相关' }},
        ],
    },
    {
        component: 'layout',
        meta: {title: "案件归档情况", icon: "lock"},
        name: "ArchivesSituation", 
        path: "/archivesSituation",
        redirect: "/archivesSituation/caseNum",
        children: [
            {path: "caseNum", component: 'views/archivesSituation/caseNum', name: "CaseNum", meta:{ title:'受理案件数量' }},
            {path: "caseShallCompleted", component: 'views/archivesSituation/caseShallCompleted', name: "CaseShallCompleted", meta:{ title:'应归档案件' }},
            {path: "waitAssessment", component: 'views/archivesSituation/waitAssessment', name: "WaitAssessmentArchives", meta:{ title:'等待质量评查' }},
            {path: "unTransfer", component: 'views/archivesSituation/unTransfer', name: "UnTransfer", meta:{ title:'未移交归档案件' }},
            {path: "giveBack", component: 'views/archivesSituation/giveBack', name: "GiveBack", meta:{ title:'退回整改案件' }},
            {path: "notInWarehouse", component: 'views/archivesSituation/notInWarehouse', name: "NotInWarehouse", meta:{ title:'未上架案件' }},
            {path: "inWarehouse", component: 'views/archivesSituation/inWarehouse', name: "InWarehouseArchives", meta:{ title:'已归档上架案件' }},
        ],
    },
]

export default asyncDataRoutes
