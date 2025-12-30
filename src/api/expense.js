// 费用管理API - 提供向后兼容的接口
import { 
  getUserExpenseTotal, 
  getCategoryExpenseStats, 
  getUserCategoryBreakdown, 
  getExpenseOverview, 
  getExpenseChartData, 
  getExpenseTrend 
} from './expenseStatistics'
import { getExpenseCategories } from './expenseCategory'
import request from '../utils/request.js'

// 向后兼容的函数
export const getExpenseStatistics = async (params) => {
  const { chartType, ...otherParams } = params
  
  try {
    let result = null
    
    switch (chartType) {
      case 'userTotal':
        result = await getUserExpenseTotal(otherParams)
        break
      case 'categoryStats':
        result = await getCategoryExpenseStats(otherParams)
        break
      case 'userBreakdown':
        result = await getUserCategoryBreakdown(otherParams)
        break
      case 'overview':
        result = await getExpenseOverview(otherParams)
        break
      case 'trend':
        result = await getExpenseTrend(otherParams)
        break
      default:
        result = await getUserExpenseTotal(otherParams)
    }
    
    return result
  } catch (error) {
    console.error('获取费用统计数据失败:', error)
    throw error
  }
}

export const getMainCategories = getExpenseCategories
export const getMainCategoriesList = getExpenseCategories

// 导出Excel功能
export const exportToExcel = async (params) => {
  try {
    return await request.post('/expense-statistics/export-excel', params, {
      responseType: 'blob'
    })
  } catch (error) {
    console.error('导出Excel失败:', error)
    throw error
  }
}

// 导出所有函数
export {
  getUserExpenseTotal,
  getCategoryExpenseStats,
  getUserCategoryBreakdown,
  getExpenseOverview,
  getExpenseChartData,
  getExpenseTrend,
  getExpenseCategories
}