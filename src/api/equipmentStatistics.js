import request from '../utils/request.js'

// 设备统计相关API
export const equipmentStatisticsAPI = {
  // 获取用户设备申请总量统计
  getUserEquipmentTotal(params) {
    return request.get('/equipment-statistics/user-equipment-total', params)
  },

  // 获取设备分类申请统计
  getEquipmentCategoryStats(params) {
    return request.get('/equipment-statistics/category-equipment-stats', params)
  },

  // 获取用户设备分类申请明细
  getUserEquipmentCategoryBreakdown(params) {
    return request.get('/equipment-statistics/user-equipment-category-breakdown', params)
  },

  // 获取设备申请概览统计
  getEquipmentOverview(params) {
    return request.get('/equipment-statistics/equipment-overview', params)
  },

  // 获取设备申请统计图表数据
  getEquipmentChartData(params) {
    return request.get('/equipment-statistics/equipment-chart-data', params)
  },

  // 获取设备申请趋势数据
  getEquipmentTrend(params) {
    return request.get('/equipment-statistics/equipment-trend', params)
  }
}

// 导出单独的方法
export const getUserEquipmentTotal = (params) => equipmentStatisticsAPI.getUserEquipmentTotal(params)
export const getEquipmentCategoryStats = (params) => equipmentStatisticsAPI.getEquipmentCategoryStats(params)
export const getUserEquipmentCategoryBreakdown = (params) => equipmentStatisticsAPI.getUserEquipmentCategoryBreakdown(params)
export const getEquipmentOverview = (params) => equipmentStatisticsAPI.getEquipmentOverview(params)
export const getEquipmentChartData = (params) => equipmentStatisticsAPI.getEquipmentChartData(params)
export const getEquipmentTrend = (params) => equipmentStatisticsAPI.getEquipmentTrend(params)

export default equipmentStatisticsAPI