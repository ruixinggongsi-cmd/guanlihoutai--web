import request from '../utils/request.js'

// 审批流程配置API
export const approvalFlowConfigAPI = {
  /**
   * 获取审批流程列表
   * @param {Object} params - 查询参数
   * @param {number} params.page - 页码
   * @param {number} params.pageSize - 每页条数
   * @param {string} params.name - 流程名称
   * @param {string} params.status - 状态
   */
  getApprovalFlowList(params = {}) {
    return request.get('/approval-flow-config/list', params)
  },

  /**
   * 获取单个审批流程详情
   * @param {string} id - 流程ID
   */
  getApprovalFlowDetail(id) {
    return request.get(`/approval-flow-config/${id}`)
  },

  /**
   * 创建审批流程
   * @param {Object} data - 流程数据
   * @param {string} data.name - 流程名称
   * @param {string} data.code - 流程编码
   * @param {string} data.description - 流程描述
   * @param {string} data.type - 流程类型
   * @param {Array} data.steps - 审批步骤
   * @param {Object} data.conditions - 审批条件
   * @param {boolean} data.isActive - 是否启用
   */
  createApprovalFlow(data) {
    return request.post('/approval-flow-config', data)
  },

  /**
   * 更新审批流程
   * @param {string} id - 流程ID
   * @param {Object} data - 流程数据
   */
  updateApprovalFlow(id, data) {
    return request.put(`/approval-flow-config/${id}`, data)
  },

  /**
   * 删除审批流程
   * @param {string} id - 流程ID
   */
  deleteApprovalFlow(id) {
    return request.delete(`/approval-flow-config/${id}`)
  },

  /**
   * 批量删除审批流程
   * @param {Array} ids - 流程ID数组
   */
  batchDeleteApprovalFlows(ids) {
    return request.post('/approval-flow-config/batch-delete', { ids })
  },

  /**
   * 更新审批流程状态
   * @param {string} id - 流程ID
   * @param {string} status - 状态 ('active' | 'inactive')
   */
  updateApprovalFlowStatus(id, status) {
    return request.patch(`/approval-flow-config/${id}/status`, { status })
  },

  /**
   * 获取审批流程下拉选项
   */
  getApprovalFlowOptions() {
    return request.get('/approval-flow-config/options')
  },

  /**
   * 检查流程编码是否已存在
   * @param {string} code - 流程编码
   * @param {string} excludeId - 排除的ID（可选）
   */
  checkFlowCodeExists(code, excludeId = null) {
    const params = { code }
    if (excludeId) {
      params.exclude_id = excludeId
    }
    return request.get('/approval-flow-config/check-code', params)
  },

  /**
   * 获取审批流程统计信息
   */
  getApprovalFlowStats() {
    return request.get('/approval-flow-config/stats')
  },

  /**
   * 复制审批流程
   * @param {string} id - 原流程ID
   * @param {Object} data - 新流程数据
   */
  copyApprovalFlow(id, data) {
    return request.post(`/approval-flow-config/${id}/copy`, data)
  },

  /**
   * 导出审批流程配置
   * @param {Object} params - 导出参数
   */
  exportApprovalFlows(params = {}) {
    return request.get('/approval-flow-config/export', { ...params, responseType: 'blob' })
  },

  /**
   * 导入审批流程配置
   * @param {File} file - 导入文件
   */
  importApprovalFlows(file) {
    const formData = new FormData()
    formData.append('file', file)
    
    return request.post('/approval-flow-config/import', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  }
}

// 导出单独的方法，保持向后兼容性
export const getApprovalFlowList = (params) => approvalFlowConfigAPI.getApprovalFlowList(params)
export const getApprovalFlowDetail = (id) => approvalFlowConfigAPI.getApprovalFlowDetail(id)
export const createApprovalFlow = (data) => approvalFlowConfigAPI.createApprovalFlow(data)
export const updateApprovalFlow = (id, data) => approvalFlowConfigAPI.updateApprovalFlow(id, data)
export const deleteApprovalFlow = (id) => approvalFlowConfigAPI.deleteApprovalFlow(id)
export const batchDeleteApprovalFlows = (ids) => approvalFlowConfigAPI.batchDeleteApprovalFlows(ids)
export const updateApprovalFlowStatus = (id, status) => approvalFlowConfigAPI.updateApprovalFlowStatus(id, status)
export const getApprovalFlowOptions = () => approvalFlowConfigAPI.getApprovalFlowOptions()
export const checkFlowCodeExists = (code, excludeId) => approvalFlowConfigAPI.checkFlowCodeExists(code, excludeId)
export const getApprovalFlowStats = () => approvalFlowConfigAPI.getApprovalFlowStats()
export const copyApprovalFlow = (id, data) => approvalFlowConfigAPI.copyApprovalFlow(id, data)
export const exportApprovalFlows = (params) => approvalFlowConfigAPI.exportApprovalFlows(params)
export const importApprovalFlows = (file) => approvalFlowConfigAPI.importApprovalFlows(file)

export default approvalFlowConfigAPI