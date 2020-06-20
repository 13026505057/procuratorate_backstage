import user from './user'
import roles from './role'
import cases from './cases'
import exhibit from './exhibit'
import setting from './setting'


export default {
    ...user,
    ...roles,
    ...cases,
    ...exhibit,
    ...setting,
}