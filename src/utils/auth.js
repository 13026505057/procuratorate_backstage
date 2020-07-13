import Cookies from 'js-cookie'

const TokenKey = 'kf-token'

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}
export function exportExcelFun(arr) {
  let _str = ""; 
  for(var o in arr) {
    if(arr[o] != -1) _str += o + "=" + arr[o] + "&"
  }
  return _str;
}
