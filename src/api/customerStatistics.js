import request from '../utils/request.js'

// 客户统计相关API - 基于后端customerStatistics.js的4个核心接口
export const customerStatisticsAPI = {
  // 1. 客户增长趋势统计（按客户来源）
  getCustomerGrowthBySource(params) {
    return request.get('/customer-statistics/customer-growth-by-source', params)
  },

  // 2. 用户新增会员趋势函数（按创建者姓名）
  getUserCustomerGrowthTrend(params) {
    return request.get('/customer-statistics/user-customer-growth-trend', params)
  },

  // 3. 部门新增会员趋势函数（按部门名称）
  getDepartmentCustomerGrowthTrend(params) {
    return request.get('/customer-statistics/department-customer-growth-trend', params)
  },

  // 4. 客户维护趋势函数（基于contact_records、customers、users、department表的综合分析）
  getCustomerMaintenanceTrend(params) {
    return request.get('/customer-statistics/customer-maintenance-trend', params)
  }
}

// 导出单独的方法
export const getCustomerGrowthBySource = (params) => customerStatisticsAPI.getCustomerGrowthBySource(params)
export const getUserCustomerGrowthTrend = (params) => customerStatisticsAPI.getUserCustomerGrowthTrend(params)
export const getDepartmentCustomerGrowthTrend = (params) => customerStatisticsAPI.getDepartmentCustomerGrowthTrend(params)
export const getCustomerMaintenanceTrend = (params) => customerStatisticsAPI.getCustomerMaintenanceTrend(params)

export default customerStatisticsAPI