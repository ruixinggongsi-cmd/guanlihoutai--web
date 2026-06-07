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

  getDatabaseList(params = {}) {
    return request.get('/customer-data-compare/database-list', params)
  },

  getUploaderSummary(params = {}) {
    return request.get('/customer-data-compare/uploader-summary', params)
  },

  backfillCreatedBy(data) {
    return request.post('/customer-data-compare/backfill-created-by', data)
  },

  recordUploadSession(data) {
    return request.post('/customer-data-compare/upload-sessions', data)
  },

  getUploadSessions(params = {}) {
    return request.get('/customer-data-compare/upload-sessions', params)
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

