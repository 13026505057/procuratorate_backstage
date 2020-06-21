const getters = {
  sidebar: state => state.app.sidebar,
  size: state => state.app.size,
  device: state => state.app.device,
  visitedViews: state => state.tagsView.visitedViews,
  cachedViews: state => state.tagsView.cachedViews,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  org_name: state => state.user.org_name,
  org_list: state => state.user.org_list,
  org_id: state => state.user.org_id,
  address_id: state => state.user.address_id,
  user_true_name: state => state.user.user_true_name,
  roles: state => state.user.roles,
  permission_routes: state => state.permission.routes,
  errorLogs: state => state.errorLog.logs,
  caseTimeStatus: state => state.settings.caseTimeStatus
}
export default getters
