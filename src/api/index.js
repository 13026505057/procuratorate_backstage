import user from './user'
import roles from './role'
import caseManagement from './caseManagement'

export default {
    ...user,
    ...roles,
    ...caseManagement,
}