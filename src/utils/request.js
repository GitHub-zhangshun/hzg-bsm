import md5 from 'blueimp-md5'
import axios from 'axios'
// import Qs from 'qs'
import { Message, MessageBox } from 'element-ui'
import store from '../store'
import auth from '@/utils/auth'
import { isString, isArray, isNullOrUndefined } from 'util'
import { parseTime } from '../utils/index'
import { isObject } from 'util'

// 定义全局变量clearRequest，在route.js中要用到
const clearRequest = {
  source: { token: null, cancel: null }
}
const CancelToken = axios.CancelToken
const source = CancelToken.source()

// 创建axios实例
const request = axios.create({
  baseURL: process.env.BASE_API, // api的 base_url
  timeout: 3000 * 1000 * 1000000, // 请求超时时间
  headers: { 'Content-Type': 'application/json;charset=UTF-8' },
  cancelToken: source.token
})

/**
 * 参数加签
 * @param {*} privateKey
 * @param {*} timestamp
 * @param {*} data
 */
function getSign(privateKey, timestamp, data) {
  //
  privateKey = privateKey || process.env.PRIVATE_KEY
  // 非string 转换string
  if (!isString(data)) {
    data = JSON.stringify(data)
  }
  // 转换data为 string 去除\r \n 以及带长度空字符串
  data = data.replace(/[\r\n]/g, '').replace(/\s+/g, '')
  let dataStrByUrl = encodeURIComponent(data)
  dataStrByUrl = dataStrByUrl.replace(/\(/g, '%28')
  dataStrByUrl = dataStrByUrl.replace(/\)/g, '%29')
  dataStrByUrl = dataStrByUrl.replace(/\!/g, '%21')
  dataStrByUrl = dataStrByUrl.replace(/\'/g, '%27')
  dataStrByUrl = dataStrByUrl.replace(/\~/g, '%7E')
  // dataStrByUrl = dataStrByUrl.replace(/\*/g, '%2A')
  // 加签 私钥+时间戳+请求文本  以md5方式进行加密
  return md5(privateKey + timestamp + dataStrByUrl)
}

// request拦截器
request.interceptors.request.use(config => {
  config.cancelToken = clearRequest.source.token
  // config.method = 'post' // 默认请求post
  const method = config.method === 'cus_get' ? 'get' : 'post'
  config.method = method
  // 添加API header
  const timestamp = new Date().getTime().toString() // 当前时间戳
  config.headers['mid'] = process.env.MID // 开发者证书
  config.headers['timestamp'] = timestamp // 时间错
  // 如果为空data 加一个非空字符
  if (!config.data) {
    config.data = 'no data'
  }
  // 添加无保密模式 不为空并且是一个对象
  if (!isNullOrUndefined(config.data) && isObject(config.data)) {
    if (store.getters.baseRunFuncList['O_MODEL_CHANGE'] && localStorage.getItem('model') === 'platform_data_type_normal_no_secret') {
      config.data.closeSecrecy = true
    }
  }
  config.headers['sign'] = getSign('', timestamp, config.data || 'no data') // 签名
  if (auth.getToken()) {
    config.headers['token'] = auth.getToken() // 请求携带自定义token
  }
  // 添加模式
  if (store.getters.baseRunFuncList['O_MODEL_CHANGE']) {
    config.headers['dataType'] = localStorage.getItem('model') || 'platform_data_type_normal'
  }
  return config
}, error => {
  // Do something with request error
  console.log(error) // for debug
  Promise.reject(error)
})

// response拦截器
request.interceptors.response.use(
  response => {
    // console.log('resp-response=========>', response)
    const res = response.data
    if (res.code !== '0') {
      // 失败
      Message.error(`${res.code}:${res.message}`)
      return Promise.reject('error')
    } else {
      // // 成功
      // if (res.result === undefined || Object.keys(res.result).length === 0) {
      //   res.result = []
      // }
      // 添加格式化后的时间字段
      if (isArray(res.result) || isObject(res.result)) {
        Array.from(res.result).map(i => {
          if (i.createAt) {
            i.createTime = parseTime(i.createAt)
          }
          if (i.updateAt) {
            i.updateTime = parseTime(i.updateAt)
          }
        })
      }
      return Promise.resolve(res)
    }
  },
  error => {
    console.log('resp-error========>')
    console.dir(error)
    const response = error.response
    // 存在响应
    if (response) {
      // token失效
      if (response.status === 403 && response.data.code === '10003') {
        MessageBox.confirm('你已被登出，可以取消继续留在该页面，或者重新登录', '确定登出', {
          confirmButtonText: '重新登录',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          auth.logOut()
          location.reload()
        })
      } else {
        Message.error('网络异常，请稍后重试或联系管理员')
      }
    } else {
      // 请求超时
      if (error.code === 'ECONNABORTED') {
        Message({
          message: '请求超时',
          type: 'error',
          duration: 7 * 1000
        })
      } else {
        // Message.error(error.message)
        console.log(error.toString())
        if (error.toString() !== 'Cancel') {
          Message.error('网络异常，请稍后重试或联系管理员')
        }
      }
    }
    return Promise.reject(error)
  }
)

export {
  request,
  axios,
  clearRequest
}
