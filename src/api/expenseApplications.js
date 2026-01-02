import request from '../utils/request'

// 费用申请管理API
export const expenseApplicationsAPI = {
  /**
   * 获取费用申请列表
   * @param {Object} params - 查询参数
   * @param {number} params.page - 页码，默认1
   * @param {number} params.pageSize - 每页条数，默认10
   * @param {string} params.keyword - 搜索关键词（费用名称、描述）
   * @param {string} params.status - 状态筛选：pending/approving/approved/rejected/cancelled
   * @param {string} params.applicant_id - 申请人ID筛选
   * @param {string} params.start_date - 开始日期（YYYY-MM-DD）
   * @param {string} params.end_date - 结束日期（YYYY-MM-DD）
   */
  getExpenseApplicationsList(params = {}) {
    return request.get('/expense-applications/list', params)
  },

  /**
   * 获取所有费用申请列表（仅超级管理员）
   * @param {Object} params - 查询参数
   * @param {number} params.page - 页码，默认1
   * @param {number} params.pageSize - 每页条数，默认10
   * @param {string} params.keyword - 搜索关键词（费用名称、描述）
   * @param {string} params.status - 状态筛选：pending/approving/approved/rejected/cancelled
   * @param {string} params.applicant_id - 申请人ID筛选
   * @param {string} params.start_date - 开始日期（YYYY-MM-DD）
   * @param {string} params.end_date - 结束日期（YYYY-MM-DD）
   * @param {string} params.mainCategoryId - 主分类ID
   * @param {string} params.subCategoryId - 子分类ID
   */
  getAllExpenseApplicationsList(params = {}) {
    return request.get('/expense-applications/list-all', params)
  },

  /**
   * 创建费用申请
   * @param {Object} data - 费用申请数据
   * @param {string} data.name - 费用名称（必填）
   * @param {string} data.main_category_id - 主分类ID（必填）
   * @param {string} data.sub_category_id - 子分类ID（必填）
   * @param {number} data.amount - 金额（必填）
   * @param {string} data.date - 费用日期（YYYY-MM-DD）（必填）
   * @param {string} data.description - 费用描述（可选）
   * @param {string} data.applicant_id - 申请人ID（可选，默认从token获取）
   * @param {string} data.applicant_name - 申请人姓名（可选，默认从token获取）
   * @param {string} data.applicant_department_id - 申请人部门ID（可选，默认从token获取）
   */
  createExpenseApplication(data) {
    return request.post('/expense-applications', data)
  },

  /**
   * 获取费用申请详情
   * @param {string} id - 费用申请ID
   */
  getExpenseApplicationDetail(id) {
    return request.get(`/expense-applications/${id}`)
  },

  /**
   * 获取费用申请审批节点信息
   * @param {string} id - 费用申请ID
   */
  getExpenseApplicationApprovalNodes(id) {
    return request.get(`/expense-applications/${id}/approval-nodes`)
  },

  /**
   * 取消费用申请
   * @param {string} id - 费用申请ID
   */
  cancelExpenseApplication(id) {
    return request.post(`/expense-applications/${id}/cancel`)
  },

  /**
   * 删除费用申请（仅超级管理员）
   * @param {string} id - 费用申请ID
   */
  deleteExpenseApplication(id) {
    return request.delete(`/expense-applications/${id}`)
  },

  /**
   * 获取待审批列表
   * @param {Object} params - 查询参数
   * @param {number} params.page - 页码，默认1
   * @param {number} params.pageSize - 每页条数，默认10
   * @param {string} params.status - 状态筛选：pending/approved/rejected
   * @param {string} params.start_date - 开始日期（YYYY-MM-DD）
   * @param {string} params.end_date - 结束日期（YYYY-MM-DD）
   */
  getPendingApprovals(params = {}) {
    return request.get('/expense-applications/pending-approvals', params)
  },

  /**
   * 审批费用申请
   * @param {string} id - 费用申请ID
   * @param {Object} data - 审批数据
   * @param {string} data.action - 审批动作：approve/reject
   * @param {string} data.comment - 审批意见（可选）
   * @param {Array} data.attachments - 附件列表（可选）
   * @param {string} data.attachments[].id - 附件ID
   * @param {string} data.attachments[].name - 附件名称
   * @param {string} data.attachments[].url - 附件URL
   * @param {string} data.attachments[].type - 附件类型
   * @param {number} data.attachments[].size - 附件大小
   */
  approveExpenseApplication(id, data) {
    return request.post(`/expense-applications/${id}/approve`, data)
  },

  /**
   * 获取审批统计信息
   */
  getApprovalStatistics() {
    return request.get('/expense-applications/approval-statistics')
  },

  /**
   * 获取我的审批记录
   * @param {Object} params - 查询参数
   * @param {number} params.page - 页码，默认1
   * @param {number} params.pageSize - 每页条数，默认10
   * @param {string} params.status - 状态筛选：approved/rejected
   * @param {string} params.start_date - 开始日期（YYYY-MM-DD）
   * @param {string} params.end_date - 结束日期（YYYY-MM-DD）
   */
  getMyApprovals(params = {}) {
    return request.get('/expense-applications/my-approvals', params)
  }
}

// 导出单独的方法，保持向后兼容性
export const getExpenseApplicationsList = (params = {}) => expenseApplicationsAPI.getExpenseApplicationsList(params)
export const createExpenseApplication = (data) => expenseApplicationsAPI.createExpenseApplication(data)
export const getExpenseApplicationDetail = (id) => expenseApplicationsAPI.getExpenseApplicationDetail(id)
export const getExpenseApplicationApprovalNodes = (id) => expenseApplicationsAPI.getExpenseApplicationApprovalNodes(id)
export const cancelExpenseApplication = (id) => expenseApplicationsAPI.cancelExpenseApplication(id)

export default expenseApplicationsAPI