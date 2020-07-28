
import axios from 'axios'
import qs from "qs"
import { Message } from 'element-ui'
import store from '@/store'
import { getToken } from '@/utils/auth'

// create an axios instance
const service = axios.create({
  // baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  baseURL: 'http://141.113.80.45/dossier_qd',
  // baseURL: 'http://106.12.68.167/dossier_qd',
  // baseURL: 'http://192.168.2.205:8081/dossier_qd',,
//   withCredentials: true, // send cookies when cross-domain requests
  timeout: 1000*60*10 // request timeout
})

// request interceptor
service.interceptors.request.use( config => {
  // do something before request is sent
  store.dispatch('app/setBaseUrl',config.baseURL)
  if (store.getters.token) {
    config.headers['kf-token'] = getToken()
  }
  config.method === 'post' 
    ? config.data = qs.stringify(config.data)
    : config.params = {...config.params};
  // config.headers['Content-Type'] = 'application/x-www-form-urlencoded';
  // config.headers['Content-Type'] = 'application/json;charset=utf-8';
  return config
}, error => {
  // do something with request error
  console.log(error) // for debug
  return Promise.reject(error)
})
service.interceptors.response.use(
  response => {
    const res = response.data
    if (res && res.code == '0') {
      return res;
    // if the custom code is not 0, it is judged as an error.
    }else if(res.code == '402'){
      //登录超时
      store.dispatch('user/resetToken').then(() => {
        setTimeout(()=>{ Message.info('登录超时, 请重新登录') },300)
        setTimeout(()=>{ location.reload() },1000)
      })
    }else if(res.code == '500'){
      Message.error('操作异常或信息填写错误，请重新再试一次');
    }else{
      Message.error({message: res.msg,duration:5000});
    }
  },
  error => {  //响应错误处理
    return Promise.reject(error)
  }
)

export default service
