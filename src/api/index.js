import user from './user'
import roles from './role'
import cases from './cases'
import exhibit from './exhibit'
import caseManagement from './caseManagement'
import archivesManage from './archivesManage'

export default {
    ...user,
    ...roles,
    ...cases,
    ...exhibit,
    ...caseManagement,
    ...archivesManage,
}