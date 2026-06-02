import request from '../utils/request.js'

// 客户数据对比API
export const customerDataCompareAPI = {
  // 批量检查客户数据（仅通过电话号码对比，可指定对比范围）
  batchCheck(customerList, compareStatuses = null) {
    return request.post('/customer-data-compare/batch-check-optimized', {
      customerList,
      compareStatuses
    })
  },

  // 获取底料数据库统计信息
  getDatabaseStats() {
    return request.get('/customer-data-compare/database-stats')
  },
  
  // 批量保存新增客户数据到数据库
  saveNewCustomers(customerList, compareStatuses = null) {
    return request.post('/customer-data-compare/save-new-customers', {
      customerList,
      compareStatuses
    })
  }
}

export default customerDataCompareAPI

