import request from '../utils/request.js'

// 日志管理API
export const logsAPI = {
  // 获取登录日志列表
  getLoginLogs(params = {}) {
    return request.get('/logs/login/list', params)
  },

  // 获取登录日志详情
  getLoginLog(id) {
    return request.get(`/logs/login/${id}`)
  },

  // 获取操作日志列表
  getOperationLogs(params = {}) {
    return request.get('/logs/operation/list', params)
  },

  // 获取操作日志详情
  getOperationLog(id) {
    return request.get(`/logs/operation/${id}`)
  },

  // 导出登录日志
  exportLoginLogs(params = {}) {
    return request.get('/logs/login/export', { ...params, responseType: 'blob' })
  },

  // 导出操作日志
  exportOperationLogs(params = {}) {
    return request.get('/logs/operation/export', { ...params, responseType: 'blob' })
  },

  // 清理登录日志
  clearLoginLogs(beforeDate) {
    return request.post('/logs/login/clear', { beforeDate })
  },

  // 清理操作日志
  clearOperationLogs(beforeDate) {
    return request.post('/logs/operation/clear', { beforeDate })
  },

  // 获取日志统计信息
  getLogStats() {
    return request.get('/logs/stats')
  }
}

// 导出单独的方法，保持向后兼容性
export const getLoginLogs = (params) => logsAPI.getLoginLogs(params)
export const getLoginLog = (id) => logsAPI.getLoginLog(id)
export const getOperationLogs = (params) => logsAPI.getOperationLogs(params)
export const getOperationLog = (id) => logsAPI.getOperationLog(id)
export const exportLoginLogs = (params) => logsAPI.exportLoginLogs(params)
export const exportOperationLogs = (params) => logsAPI.exportOperationLogs(params)
export const clearLoginLogs = (beforeDate) => logsAPI.clearLoginLogs(beforeDate)
export const clearOperationLogs = (beforeDate) => logsAPI.clearOperationLogs(beforeDate)
export const getLogStats = () => logsAPI.getLogStats()

export default logsAPI