import request from '../utils/request'

// 设备申请管理API
export const equipmentApplicationsAPI = {
  /**
   * 获取设备申请列表
   * @param {Object} params - 查询参数
   * @param {number} params.page - 页码
   * @param {number} params.pageSize - 每页条数
   * @param {string} params.keyword - 搜索关键词
   * @param {string} params.status - 状态筛选
   * @param {string} params.applicant_id - 申请人ID
   * @param {string} params.start_date - 开始日期
   * @param {string} params.end_date - 结束日期
   */
  getEquipmentApplicationsList(params = {}) {
    return request.get('/equipment-applications/list', params)
  },

  /**
   * 获取设备申请详情
   * @param {string} id - 设备申请ID
   */
  getEquipmentApplication(id) {
    return request.get(`/equipment-applications/${id}`)
  },

  /**
   * 创建设备申请
   * @param {Object} data - 设备申请数据
   * @param {string} data.name - 申请名称
   * @param {string} data.main_category_id - 主分类ID
   * @param {string} data.sub_category_id - 子分类ID
   * @param {number} data.quantity - 申请数量
   * @param {string} data.application_date - 申请日期
   * @param {string} data.description - 描述（可选）
   */
  createEquipmentApplication(data) {
    return request.post('/equipment-applications', data)
  },

  /**
   * 更新设备申请
   * @param {string} id - 设备申请ID
   * @param {Object} data - 设备申请数据
   */
  updateEquipmentApplication(id, data) {
    return request.put(`/equipment-applications/${id}`, data)
  },

  /**
   * 删除设备申请
   * @param {string} id - 设备申请ID
   */
  deleteEquipmentApplication(id) {
    return request.delete(`/equipment-applications/${id}`)
  },

  /**
   * 取消设备申请
   * @param {string} id - 设备申请ID
   */
  cancelEquipmentApplication(id) {
    return request.post(`/equipment-applications/${id}/cancel`)
  },

  /**
   * 获取待审批设备列表
   * @param {Object} params - 查询参数
   * @param {number} params.page - 页码
   * @param {number} params.pageSize - 每页条数
   */
  getPendingApprovals(params = {}) {
    return request.get('/equipment-applications/pending-approvals', params)
  },

  /**
   * 审批设备申请
   * @param {string} id - 设备申请ID
   * @param {Object} data - 审批数据
   * @param {string} data.action - 审批动作（approve/reject）
   * @param {string} data.comment - 审批意见（可选）
   * @param {Array} data.attachments - 附件列表（可选）
   * @param {string} data.attachments[].id - 附件ID
   * @param {string} data.attachments[].name - 附件名称
   * @param {string} data.attachments[].url - 附件URL
   * @param {string} data.attachments[].type - 附件类型
   * @param {number} data.attachments[].size - 附件大小
   */
  approveEquipmentApplication(id, data) {
    return request.post(`/equipment-applications/${id}/approve`, data)
  },

  /**
   * 获取设备申请审批节点信息
   * @param {string} id - 设备申请ID
   */
  getEquipmentApplicationApprovalNodes(id) {
    return request.get(`/equipment-applications/${id}/approval-nodes`)
  },

  /**
   * 获取设备审批统计信息
   */
  getApprovalStatistics() {
    return request.get('/equipment-applications/approval-statistics')
  },

  /**
   * 获取我的设备审批记录
   * @param {Object} params - 查询参数
   * @param {number} params.page - 页码
   * @param {number} params.pageSize - 每页条数
   * @param {string} params.status - 状态筛选
   * @param {string} params.start_date - 开始日期
   * @param {string} params.end_date - 结束日期
   */
  getMyApprovals(params = {}) {
    return request.get('/equipment-applications/my-approvals', params)
  }
}

// 导出单独的方法，保持向后兼容性
export const getEquipmentApplicationsList = (params) => equipmentApplicationsAPI.getEquipmentApplicationsList(params)
export const getEquipmentApplication = (id) => equipmentApplicationsAPI.getEquipmentApplication(id)
export const createEquipmentApplication = (data) => equipmentApplicationsAPI.createEquipmentApplication(data)
export const updateEquipmentApplication = (id, data) => equipmentApplicationsAPI.updateEquipmentApplication(id, data)
export const deleteEquipmentApplication = (id) => equipmentApplicationsAPI.deleteEquipmentApplication(id)
export const cancelEquipmentApplication = (id) => equipmentApplicationsAPI.cancelEquipmentApplication(id)
export const getPendingApprovals = (params) => equipmentApplicationsAPI.getPendingApprovals(params)
export const approveEquipmentApplication = (id, data) => equipmentApplicationsAPI.approveEquipmentApplication(id, data)
export const getEquipmentApplicationApprovalNodes = (id) => equipmentApplicationsAPI.getEquipmentApplicationApprovalNodes(id)
export const getApprovalStatistics = () => equipmentApplicationsAPI.getApprovalStatistics()
export const getMyApprovals = (params) => equipmentApplicationsAPI.getMyApprovals(params)

export default equipmentApplicationsAPI