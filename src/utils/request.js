import axios from 'axios'
import { useUserStore } from '../stores/user'
import router from '../router'
import crypto from 'crypto-js'

// 生产环境 Render 后端（构建未注入 VITE_ 变量时的兜底）
const PRODUCTION_API_BASE = 'https://guanlihoutai-api.onrender.com/api'

const resolveApiBaseUrl = () => {
  const fromEnv = import.meta.env.VITE_API_BASE_URL
  if (fromEnv) return fromEnv.replace(/\/$/, '')
  if (import.meta.env.PROD) return PRODUCTION_API_BASE
  return 'http://localhost:3001/api'
}

// API配置
const API_CONFIG = {
  appid: import.meta.env.VITE_API_APPID || 'default_appid',
  secret: import.meta.env.VITE_API_SECRET || 'default_secret'
}

// 创建axios实例
const service = axios.create({
  baseURL: resolveApiBaseUrl(),
  timeout: 300000, // 请求超时时间（5分钟，百万级数据对比需要更长时间）
  headers: {
    'Content-Type': 'application/json'
  },
  maxContentLength: 500 * 1024 * 1024, // 500MB
  maxBodyLength: 500 * 1024 * 1024 // 500MB
})

// 生成随机字符串
function generateRandomString(length = 16) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let result = ''
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

// 生成签名（与后端保持一致）
function generateSignature(data, randomStr, timestamp, appid, secret) {
  try {
    // 将数据对象按键排序后转为JSON字符串
    const sortedData = JSON.stringify(data,Object.keys(data).sort())
    // 拼接签名字符串：appid + secret + 数据 + 随机字符串 + 时间戳
    const signStr = `${appid}${secret}${sortedData}${randomStr}${timestamp}`
    // 使用MD5生成签名
    return crypto.MD5(signStr).toString()
  } catch (error) {
    throw error
  }
}

// 请求拦截器
service.interceptors.request.use(
  config => {
    const userStore = useUserStore()
    
    // 添加appid到请求头
    config.headers['X-App-ID'] = API_CONFIG.appid
    // 添加token到请求头
    if (userStore.userToken) {
      config.headers['Authorization'] = `Bearer ${userStore.userToken}`
    }
    
    // 生成时间戳和随机字符串
    const timestamp = Date.now()
    const randomStr = generateRandomString()
    
    // 添加时间戳和随机字符串到请求头
    config.headers['X-Timestamp'] = timestamp
    config.headers['X-Random-Str'] = randomStr
    
    // 获取请求数据（与后端保持一致）
    let requestData = {};
    
    // // 如果是FormData（文件上传），不处理数据用于签名
    // if (config.data && !(config.data instanceof FormData)) {
    //   requestData = config.data;
    // }
    
    // 生成签名（传递所有必要参数，与后端保持一致）
    const signature = generateSignature(requestData, randomStr, timestamp, API_CONFIG.appid, API_CONFIG.secret)
    
    if (!signature) {
      throw new Error('签名生成失败')
    }
    
    config.headers['X-Signature'] = signature
    
    
    return config
  },
  error => {
    // 对请求错误做些什么
    return Promise.reject(error)
  }
)

// 响应拦截器
service.interceptors.response.use(
  response => {
    const res = response.data
    
    // 如果响应数据中有code字段，根据code值进行处理
    if (res.code !== undefined) {
      if (res.code === 200 || res.code === 0) {
        // 请求成功
        return res
      } else if (res.code === 401) {
        // // 未授权，跳转到登录页
        // const userStore = useUserStore()
        // userStore.logout()
        // if (typeof window !== 'undefined') {
        //   router.push('/login')
        // }
        return Promise.reject(new Error(res.message || '未授权访问'))
      } else if (res.code === 403) {
        // 无权限
        return Promise.reject(new Error(res.message || '无权限访问'))
      } else if (res.code === 500) {
        // 服务器错误
        return Promise.reject(new Error(res.message || '服务器内部错误'))
      } else {
        // 其他错误
        return Promise.reject(new Error(res.message || '请求失败'))
      }
    }
    
    // 如果没有code字段，直接返回数据
    return res
  },
  async error => {
    // 对响应错误做些什么
    
    let message = '网络错误'
    
    if (error.response) {
      // 请求已发出，但服务器响应的状态码不在 2xx 范围内
      const status = error.response.status
      
      switch (status) {
       
        case 401:
          // 尝试刷新token
          const userStore = useUserStore()
          try {
            await userStore.refreshAccessToken()
            // token刷新成功，重新发送原请求
            const config = error.config
            return service(config)
          } catch (refreshError) {
            // token刷新失败，执行登出
            userStore.logout()
            if (typeof window !== 'undefined') {
              router.push('/login')
            }
            message = '登录已过期，请重新登录'
          }
          break
        case 403:
          message = '无权限访问'
          break
        case 404:
          message = '请求的资源不存在'
          break
        case 408:
          message = '请求超时'
          break
        case 502:
          message = '网关错误'
          break
        case 503:
          message = '服务不可用'
          break
        case 504:
          message = '网关超时'
          break
        case 500:
          // 服务器内部错误，尝试获取详细错误信息
          const errorData = error.response.data
          message = errorData?.error || errorData?.message || `服务器内部错误 (${status})`
          console.error('服务器500错误详情:', errorData)
          break
        default:
          message = error.response.data?.message || error.response.data?.error || `服务器错误 (${status})`
      }
    } else if (error.request) {
      // 请求已发出，但没有收到响应
      message = '网络连接失败，请检查网络设置'
    } else {
      // 发送请求时发生了一些事情
      message = error.message || '请求发送失败'
    }
    
    // 显示错误提示
    if (typeof window !== 'undefined' && window.$message) {
      window.$message.error(message)
    }
    
    return Promise.reject(new Error(message))
  }
)

// 封装请求方法
export default {
  // GET请求
  get(url, params = {}, config = {}) {
    return service.get(url, {
      params,
      ...config
    })
  },

  // POST请求
  post(url, data = {}, config = {}) {
    return service.post(url, data, config)
  },

  // PUT请求
  put(url, data = {}, config = {}) {
    return service.put(url, data, config)
  },

  // DELETE请求
  delete(url, config = {}) {
    // 如果config是对象且包含data属性，直接使用；否则将整个config作为data
    if (config.data) {
      console.log('[request.delete] 使用config.data:', config.data)
      return service.delete(url, config)
    } else if (Object.keys(config).length > 0 && !config.headers && !config.params) {
      // 如果config看起来像是数据对象，将其作为data传递
      console.log('[request.delete] 将config作为data传递:', config)
      return service.delete(url, { data: config })
    }
    console.log('[request.delete] 直接使用config:', config)
    return service.delete(url, config)
  },

  // PATCH请求
  patch(url, data = {}, config = {}) {
    return service.patch(url, data, config)
  },

  // 文件上传
  upload(url, file, config = {}) {
    const formData = new FormData()
    
    if (file instanceof File) {
      formData.append('file', file)
    } else if (typeof file === 'object' && file !== null) {
      // 如果是对象，遍历添加所有字段
      Object.keys(file).forEach(key => {
        formData.append(key, file[key])
      })
    }
    
    return service.post(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      ...config
    })
  },

  // 文件下载
  download(url, params = {}, config = {}) {
    return service.get(url, {
      params,
      responseType: 'blob',
      ...config
    })
  }
}