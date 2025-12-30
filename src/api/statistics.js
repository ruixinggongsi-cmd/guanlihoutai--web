import request from '../utils/request.js'

// 统计数据API - 与manageapi路由保持一致
export const statisticsAPI = {
  // 获取当前用户的基本统计数据
  getCurrentUserStats() {
    return request.get('/statistics/user-stats')
  },

  // 获取所有用户统计数据（管理员用）
  getAllUsersStats(params = {}) {
    return request.get('/statistics/all-users', params)
  },

  // 获取用户统计数据摘要（简化版）
  getUsersStatsSummary(userId) {
    return request.get(`/statistics/user-summary/${userId}`)
  },

  // 获取系统整体统计数据（仪表盘用）
  getSystemStats() {
    return request.get('/statistics/dashboard')
  }
}

// 导出单独的方法，保持向后兼容性
export const getCurrentUserStats = () => statisticsAPI.getCurrentUserStats()
export const getAllUsersStats = (params) => statisticsAPI.getAllUsersStats(params)
export const getUsersStatsSummary = (userId) => statisticsAPI.getUsersStatsSummary(userId)
export const getSystemStats = () => statisticsAPI.getSystemStats()

export default statisticsAPI