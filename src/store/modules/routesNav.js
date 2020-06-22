    
import Page404 from '@/views/error-page/404'  
// 设置
import AddRole from '@/views/setting/addRole'
import Unit from '@/views/setting/unit'
import Department from '@/views/setting/department'
import Position from '@/views/setting/position'
import Role from '@/views/setting/role'
import StorageLocation from '@/views/setting/storageLocation'

// 案管
import FilingCondition from '@/views/caseManage/filingCondition/index'
import CompletedCase from '@/views/caseManage/filingCondition/completed'
import UncompletedCase from '@/views/caseManage/filingCondition/uncompleted'
import WaitAssessment from '@/views/caseManage/waitAssessment'
import Progress from '@/views/caseManage/progress'
import AddPermission from '@/views/permission/add'
import RolePermission from '@/views/permission/role'

// 档案Routes
import ShallCompleted from '@/views/archivesManage/shallCompleted/index'
import UncompletedArchives from '@/views/archivesManage/shallCompleted/uncompleted'
import CompletedArchives from '@/views/archivesManage/shallCompleted/completed'
import CheckArchives from '@/views/archivesManage/checkArchives/index'
import ReceiveItem from '@/views/archivesManage/checkArchives/receiveItem'
import CheckItem from '@/views/archivesManage/checkArchives/checkItem'
import ReadyItem from '@/views/archivesManage/checkArchives/readyItem'
import CheckHistory from '@/views/archivesManage/checkHistory/index'
import Agree from '@/views/archivesManage/checkHistory/agree'
import Disagree from '@/views/archivesManage/checkHistory/disagree'
import PutStorage from '@/views/archivesManage/putStorage/index'
import UncompletedPut from '@/views/archivesManage/putStorage/uncompleted'
import CompletedPut from '@/views/archivesManage/putStorage/completed'
import Temporary from '@/views/archivesManage/putStorage/temporary'
// 分析评估
import QualifiedType from '@/views/appraise/qualifiedType'
import CompletedType from '@/views/appraise/completedType'
import UncompletedType from '@/views/appraise/uncompletedType'
import QualifiedHandler from '@/views/appraise/qualifiedHandler'
import CompletedHandler from '@/views/appraise/completedHandler'
import UncompletedHandler from '@/views/appraise/uncompletedHandler'
// 个人相关 
import ArchivesSituation from '@/views/byPersonal/archivesSituation/index'
import CaseNum from '@/views/byPersonal/archivesSituation/caseNum'
import CaseShallCompleted from '@/views/byPersonal/archivesSituation/caseShallCompleted'
import WaitAssessmentArchives from '@/views/byPersonal/archivesSituation/waitAssessment'
import UnTransfer from '@/views/byPersonal/archivesSituation/unTransfer'
import GiveBack from '@/views/byPersonal/archivesSituation/giveBack'
import NotInWarehouse from '@/views/byPersonal/archivesSituation/notInWarehouse'
import InWarehouseArchives from '@/views/byPersonal/archivesSituation/inWarehouse'

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
    StorageLocation:StorageLocation,
    
    // 案管
    FilingCondition: FilingCondition,
    CompletedCase: CompletedCase,
    UncompletedCase: UncompletedCase,
    WaitAssessment: WaitAssessment,
    Progress: Progress,
    AddPermission: AddPermission, 
    RolePermission: RolePermission,
    
    // 档案Routes
    ShallCompleted: ShallCompleted,
    UncompletedArchives: UncompletedArchives,
    CompletedArchives: CompletedArchives,
    CheckArchives: CheckArchives,
    ReceiveItem: ReceiveItem,
    CheckItem: CheckItem,
    CheckHistory: CheckHistory,
    Agree: Agree,
    Disagree: Disagree,
    PutStorage: PutStorage,
    UncompletedPut: UncompletedPut,
    CompletedPut: CompletedPut,
    Temporary: Temporary,
    ReadyItem: ReadyItem,
    
    // 分析评估
    QualifiedType: QualifiedType,
    CompletedType: CompletedType,
    UncompletedType: UncompletedType,
    QualifiedHandler: QualifiedHandler,
    CompletedHandler: CompletedHandler,
    UncompletedHandler: UncompletedHandler,
    
    // 个人相关 
    ArchivesSituation: ArchivesSituation,
    CaseNum: CaseNum,
    CaseShallCompleted: CaseShallCompleted,
    WaitAssessmentArchives: WaitAssessmentArchives,
    UnTransfer: UnTransfer,
    GiveBack: GiveBack,
    NotInWarehouse: NotInWarehouse,
    InWarehouseArchives: InWarehouseArchives,

    // 历史案卷
    HistoryCaseItem: HistoryCaseItem,
    BySelfMatch: BySelfMatch,
    NotBindCheck: NotBindCheck,
    MatchingHistory: MatchingHistory,
    HistoricalCases: HistoricalCases,
}
export default routesNav