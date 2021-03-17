    
import Page404 from '@/views/error-page/404'  
// 设置
import AddRole from '@/views/setting/addRole'
import Unit from '@/views/setting/unit'
import Department from '@/views/setting/department'
import Position from '@/views/setting/position'
import PermissionGroup from '@/views/setting/permissionGroup'
import Role from '@/views/setting/role'
import Personnel from '@/views/setting/personnel'
import StorageLocation from '@/views/setting/storageLocation'
import PrintSetting from '@/views/setting/printSetting'
import Casetype from '@/views/setting/casetype'

// 案管
import FilingCondition from '@/views/caseManage/filingCondition/index'
import CompletedCase from '@/views/caseManage/filingCondition/completed'
import UncompletedCase from '@/views/caseManage/filingCondition/uncompleted'
import CasePding from '@/views/caseManage/casePding/index'
import Casehistory from '@/views/caseManage/casePding/casehistory'
import Casetime from '@/views/caseManage/casePding/casetime'
import WaitAssessment from '@/views/caseManage/waitAssessment'
import Progress from '@/views/caseManage/progress'
import ShallCompletedAllCase from '@/views/caseManage/shallCompletedAll'

// 档案Routes
import ShallCompletedAll from '@/views/archivesManage/shallCompletedAll'
import ShallCompleted from '@/views/archivesManage/shallCompleted/index'
import UncompletedArchives from '@/views/archivesManage/shallCompleted/uncompleted'
import CompletedArchives from '@/views/archivesManage/shallCompleted/completed'
import CheckArchives from '@/views/archivesManage/checkArchives/index'
import ReceiveItem from '@/views/archivesManage/checkArchives/receiveItem'
import ReceiveItemYear from '@/views/archivesManage/checkArchives/receiveItemYear'
import AllCaseMaterials from '@/views/archivesManage/checkArchives/allCaseMaterials'

import CheckItem from '@/views/archivesManage/checkItem'
import ReadyItem from '@/views/archivesManage/checkArchives/readyItem'
// import BeforehandItem from '@/views/archivesManage/checkArchives/beforehandItem'
import BindReadyItem from '@/views/archivesManage/checkArchives/bindReadyItem'
import MergeRequestCheck from '@/views/archivesManage/exhibitDoubt/mergeRequest' 
import CheckHistory from '@/views/archivesManage/checkHistory/index'
import Agree from '@/views/archivesManage/checkHistory/agree'
import History from '@/views/archivesManage/checkHistory/history'
import PutStorage from '@/views/archivesManage/putStorage/index'
import UncompletedPut from '@/views/archivesManage/putStorage/uncompleted'
import CompletedPut from '@/views/archivesManage/putStorage/completed'
import ExhibitDoubt from '@/views/archivesManage/exhibitDoubt/index'
import FinishStatus from '@/views/archivesManage/exhibitDoubt/finishStatus'
import UnStandard from '@/views/archivesManage/exhibitDoubt/unStandard'
import WasDeleteExhibite from '@/views/archivesManage/exhibitDoubt/wasDeleteExhibite'
import MergeRequest from '@/views/archivesManage/exhibitDoubt/mergeRequest' 
import MergeRequestDismantle from '@/views/archivesManage/exhibitDoubt/mergeRequestDismantle' 
import CaseHandling from '@/views/archivesManage/exhibitDoubt/caseHandling'
import Searchcase from '@/views/archivesManage/exhibitDoubt/searchcase' 
import MatterExhibit from '@/views/archivesManage/exhibitDoubt/matterExhibit'
import BySelfMatchDoubt from '@/views/historyCase/bySelfMatch'
import UnCompletedPutExhibit from '@/views/archivesManage/putStorage/uncompletedExhibit'
import CompletedPutExhibit from '@/views/archivesManage/putStorage/completedExhibit'

// 档案利用
import OutWarehouse from '@/views/utilizeArchives/outWarehouse'
import InWarehouse from '@/views/utilizeArchives/inWarehouse'

//档案绩效评价 
import PerformanceEvaluationItem from '@/views/performanceEvaluation/index'

// 分析评估
import QualifiedRank from '@/views/appraise/qualifiedRank'
import LitigationCase from '@/views/appraise/litigationCase'
import QualifiedType from '@/views/appraise/qualifiedType'
import CompletedType from '@/views/appraise/completedType'
import UncompletedType from '@/views/appraise/uncompletedType'
import QualifiedHandler from '@/views/appraise/qualifiedHandler'
import CompletedHandler from '@/views/appraise/completedHandler'
import UncompletedHandler from '@/views/appraise/uncompletedHandler'
import AgingEvaluate from '@/views/appraise/agingEvaluate'
// 个人相关 
import ArchivesSituation from '@/views/byPersonal/archivesSituation/index'
import CaseNum from '@/views/byPersonal/archivesSituation/caseNum'
import CaseShallCompleted from '@/views/byPersonal/archivesSituation/caseShallCompleted'
import WaitAssessmentArchives from '@/views/byPersonal/archivesSituation/waitAssessment'
import UnTransfer from '@/views/byPersonal/archivesSituation/unTransfer'
import GiveBack from '@/views/byPersonal/archivesSituation/giveBack'
import NotInWarehouse from '@/views/byPersonal/archivesSituation/notInWarehouse'
import InWarehouseArchives from '@/views/byPersonal/archivesSituation/inWarehouse'
import PersonalAcceptance from '@/views/byPersonal/personalAcceptance/index'
import UploadAcceptance from '@/views/byPersonal/uploadAcceptance/index'

// 历史案卷
import HistoryCaseItem from '@/views/historyCase/historyCase'
import BySelfMatch from '@/views/historyCase/bySelfMatch'
import NotBindCheck from '@/views/historyCase/notBindCheck'
import MatchingHistory from '@/views/historyCase/matchingHistory'
import HistoricalCases from '@/views/historyCase/historicalCases'

let routesNav = {
    Page404: Page404,
    // 设置
    Unit: Unit,
    AddRole: AddRole,
    Department:Department,
    Position:Position,
    Role:Role,
    Personnel:Personnel,
    PermissionGroup:PermissionGroup,
    StorageLocation:StorageLocation,
    PrintSetting:PrintSetting,
    Casetype:Casetype,
    
    // 案管
    FilingCondition: FilingCondition,
    CompletedCase: CompletedCase,
    UncompletedCase: UncompletedCase,
    WaitAssessment: WaitAssessment,
    Progress: Progress,
    ShallCompletedAllCase: ShallCompletedAllCase,
    CasePding:CasePding,
    Casehistory:Casehistory,
    Casetime:Casetime,

    
    // 档案Routes
    ShallCompletedAll: ShallCompletedAll,
    ShallCompleted: ShallCompleted,
    UncompletedArchives: UncompletedArchives,
    CompletedArchives: CompletedArchives,
    CheckArchives: CheckArchives,
    ReceiveItem: ReceiveItem,
    ReceiveItemYear: ReceiveItemYear,
    MergeRequestCheck: MergeRequestCheck,
    AllCaseMaterials: AllCaseMaterials,
    CheckItem: CheckItem,
    CheckHistory: CheckHistory,
    Agree: Agree,
    History: History,
    PutStorage: PutStorage,
    UncompletedPut: UncompletedPut,
    CompletedPut: CompletedPut,
    ReadyItem: ReadyItem,
    ExhibitDoubt: ExhibitDoubt,
    FinishStatus: FinishStatus,
    UnStandard: UnStandard,
    WasDeleteExhibite: WasDeleteExhibite,
    MergeRequest: MergeRequest,
    MergeRequestDismantle:MergeRequestDismantle,
    CaseHandling:CaseHandling,
    Searchcase:Searchcase,
    BindReadyItem: BindReadyItem,
    MatterExhibit: MatterExhibit,
    UnCompletedPutExhibit:UnCompletedPutExhibit,
    CompletedPutExhibit:CompletedPutExhibit,
    BySelfMatchDoubt: BySelfMatchDoubt,
    
    // 档案利用
    OutWarehouse:OutWarehouse,
    InWarehouse:InWarehouse,

    //档案绩效评价
    PerformanceEvaluationItem:PerformanceEvaluationItem,

    // 分析评估
    QualifiedRank: QualifiedRank,
    LitigationCase: LitigationCase,
    QualifiedType: QualifiedType,
    CompletedType: CompletedType,
    UncompletedType: UncompletedType,
    QualifiedHandler: QualifiedHandler,
    CompletedHandler: CompletedHandler,
    UncompletedHandler: UncompletedHandler,
    AgingEvaluate: AgingEvaluate,
    
    // 个人相关 
    ArchivesSituation: ArchivesSituation,
    CaseNum: CaseNum,
    CaseShallCompleted: CaseShallCompleted,
    WaitAssessmentArchives: WaitAssessmentArchives,
    UnTransfer: UnTransfer,
    GiveBack: GiveBack,
    NotInWarehouse: NotInWarehouse,
    InWarehouseArchives: InWarehouseArchives,
    PersonalAcceptance: PersonalAcceptance,
    UploadAcceptance: UploadAcceptance,

    // 历史案卷
    HistoryCaseItem: HistoryCaseItem,
    BySelfMatch: BySelfMatch,
    NotBindCheck: NotBindCheck,
    MatchingHistory: MatchingHistory,
    HistoricalCases: HistoricalCases,
}
export default routesNav