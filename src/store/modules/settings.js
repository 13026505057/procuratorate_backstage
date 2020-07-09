import variables from '@/styles/element-variables.scss'
import defaultSettings from '@/settings'
import api from '@/api'
import userInfo from './user'

const { showSettings, tagsView, fixedHeader, sidebarLogo } = defaultSettings

const state = {
  theme: variables.theme,
  showSettings: showSettings,
  tagsView: tagsView,
  fixedHeader: fixedHeader,
  sidebarLogo: sidebarLogo,

  caseTimeStatus: [],
  exhibit_type: [],
  exhibit_time_bg: [],
  case_type: [],
  case_type_origin: [],
  stock_status: [],
  temporary_nd: '',
  print_id:'',
  chart_iframe: []
}

const mutations = {
  CHANGE_SETTING: (state, { key, value }) => {
    if (state.hasOwnProperty(key)) {
      state[key] = value
    }
  },
  SET_Time_Status(state,caseTimeStatus){
    state.caseTimeStatus = caseTimeStatus
  },
  SET_Exhibit_Type(state,exhibit_type){
    state.exhibit_type = exhibit_type
  },
  SET_Exhibit_Time(state,exhibit_time_bg){
    state.exhibit_time_bg = exhibit_time_bg
  },
  SET_CASE_TYPE(state,case_type){
    state.case_type = case_type.case_type
    state.case_type_origin = case_type.case_type_origin
  },
  SET_STOCK_STATUS(state,stock_status){
    state.stock_status = stock_status
  },
  SET_TEMPORARY_ND(state,temporary_nd){
    state.temporary_nd = temporary_nd
  }, 
  SET_PRINT_ID(state,print_id){
    state.print_id = print_id
  },
  SET_CHART_IFRAME(state,chart_iframe){
    state.chart_iframe = chart_iframe
  },
}

const actions = {
  changeSetting({ commit }, data) {
    commit('CHANGE_SETTING', data)
  },
  setTemporaryNd({ commit }, data) {
    commit('SET_TEMPORARY_ND', data)
  },
  caseTimeStatusGet({ commit }){
    return new Promise((resolve, reject) => {
      api.caseTimeStatus().then(response => {
        const { data } = response

        commit('SET_Time_Status', data)
        resolve(data)
      }).catch(error => reject(error) )
    })
  },
  exhibitTypeGet({ commit }){
    return new Promise((resolve, reject) => {
      api.getExhibitType().then(response => {
        const { data } = response
        let exhibit_type = [];
        data.map(item=>{
          exhibit_type.push({ value: item.exhibit_type_code, label: item.exhibit_type_name })
        })
        commit('SET_Exhibit_Type', exhibit_type)
        resolve(exhibit_type)
      }).catch(error => reject(error) )
    })
  },
  exhibitTimeBGGet({ commit }){
    return new Promise((resolve, reject) => {
      api.getExhibitTimeStatus().then(response => {
        const { data } = response
        let bgqx = [];
        data.map(item=>{
            bgqx.push({ value: item.exhibit_bgqx_code, label: item.exhibit_bgqx_name })
        })
        commit('SET_Exhibit_Time', bgqx)
        resolve(bgqx)
      }).catch(error => reject(error) )
    })
  },
  getCaseType({ commit }){
    return new Promise((resolve, reject) => {
      api.getCaseType().then(response => {
        const { data } = response
        let selectOption = []
        data.list.map(item=>{
          selectOption.push({ value: item.case_type_id, label: item.case_type_name })
        })
        let dataInfo = { case_type: selectOption, case_type_origin: data.list }
        commit('SET_CASE_TYPE', dataInfo)
        resolve(selectOption)
      }).catch(error => reject(error) )
    })
  },
  getCaseStatus({ commit }){
    return new Promise((resolve, reject) => {
      api.getStockStatus().then(response => {
        const { data } = response
        let stock_status = []
        data.map(item=>{
          stock_status.push({ value: item.exhibit_stock_status_code, label: item.exhibit_stock_status_name })
        })
        commit('SET_STOCK_STATUS', stock_status)
        resolve(stock_status)
      }).catch(error => reject(error) )
    })
  },
  getPrintId({ commit }){
    return new Promise((resolve, reject) => {
      const sendData = {};
      sendData ['pageNum'] = '1';
      sendData ['pageSize'] = '10';
      api.getPrintList(sendData).then(response => {
        const { data } = response;
        let print_id = '';
        if(data.list.length>0){
          if(localStorage.getItem('print_id')){
            print_id = localStorage.getItem('print_id');
            console.log(print_id)
          } else print_id = data.list[0].print_id 
        } else print_id = userInfo.state.org_id
        commit('SET_PRINT_ID', print_id)
        resolve(print_id)
      }).catch(error => reject(error) )
    })
  },
  changPrintId({commit},data){
    commit('SET_PRINT_ID', data)
  },
  // 获取首页iframe列表
  sysIframeGet({ commit }){
    return new Promise((resolve, reject) => {
      api.sysIframeGet().then(response => {
        const { data } = response
        commit('SET_CHART_IFRAME', data)
        resolve(data)
      }).catch(error => reject(error) )
    })
  },
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

