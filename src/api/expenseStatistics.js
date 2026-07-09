import request from '../utils/request.js'

// 费用统计相关API
export const expenseStatisticsAPI = {
  // 获取用户费用总额统计
  getUserExpenseTotal(params) {
    return request.get('/expense-statistics/user-expense-total', params)
  },

  // 获取当前审批流中的费用申请，用于区分审批中和待付款
  getActiveApprovalApplications(params) {
    return request.get('/expense-statistics/active-approval-applications', params)
  },

  // 获取财务已付款费用申请，按财务审批完成时间统计
  getPaidExpenseApplications(params) {
    return request.get('/expense-statistics/paid-expense-applications', params)
  },

  // 获取费用卡片汇总
  getExpenseCardSummary(params) {
    return request.get('/expense-statistics/expense-card-summary', params)
  },

  // 获取分类费用统计
  getCategoryExpenseStats(params) {
    return request.get('/expense-statistics/category-expense-stats', params)
  },

  // 获取用户分类费用占比
  getUserCategoryBreakdown(params) {
    return request.get('/expense-statistics/user-category-breakdown', params)
  },

  // 获取费用概览统计
  getExpenseOverview(params) {
    return request.get('/expense-statistics/expense-overview', params)
  },

  // 费用概览用部门树
  getExpenseDepartmentTree() {
    return request.get('/expense-statistics/department-tree')
  },

  // 获取费用统计图表数据
  getExpenseChartData(params) {
    return request.get('/expense-statistics/expense-chart-data', params)
  },

  // 获取费用趋势数据
  getExpenseTrend(params) {
    return request.get('/expense-statistics/expense-trend', params)
  }
}

// 导出单独的方法
export const getUserExpenseTotal = (params) => expenseStatisticsAPI.getUserExpenseTotal(params)
export const getActiveApprovalApplications = (params) => expenseStatisticsAPI.getActiveApprovalApplications(params)
export const getPaidExpenseApplications = (params) => expenseStatisticsAPI.getPaidExpenseApplications(params)
export const getExpenseCardSummary = (params) => expenseStatisticsAPI.getExpenseCardSummary(params)
export const getCategoryExpenseStats = (params) => expenseStatisticsAPI.getCategoryExpenseStats(params)
export const getUserCategoryBreakdown = (params) => expenseStatisticsAPI.getUserCategoryBreakdown(params)
export const getExpenseOverview = (params) => expenseStatisticsAPI.getExpenseOverview(params)
export const getExpenseDepartmentTree = () => expenseStatisticsAPI.getExpenseDepartmentTree()
export const getExpenseChartData = (params) => expenseStatisticsAPI.getExpenseChartData(params)
export const getExpenseTrend = (params) => expenseStatisticsAPI.getExpenseTrend(params)

export default expenseStatisticsAPI