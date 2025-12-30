import request from '../utils/request.js'

// 客户管理API
export const customerAPI = {
  // 获取客户列表（分页）
  getCustomerList(params = {}) {
    return request.get('/customers/list', params)
  },

  // 获取单个客户详情
  getCustomer(id) {
    return request.get(`/customers/${id}`)
  },

  // 创建客户
  createCustomer(data) {
    return request.post('/customers', data)
  },

  // 更新客户
  updateCustomer(id, data) {
    return request.put(`/customers/${id}`, data)
  },

  // 删除客户
  deleteCustomer(id) {
    return request.delete(`/customers/${id}`)
  },

  // 批量删除客户
  batchDeleteCustomers(ids) {
    return request.post('/customers/batch-delete', { ids })
  },

  // 更新客户状态
  updateCustomerStatus(id, status) {
    return request.put(`/customers/${id}`, { status })
  },

  // 修改客户创建人（分配客服）
  changeCustomerCreator(id, newCreatorId) {
    return request.put(`/customers/${id}/change-creator`, { newCreatorId })
  },


}

// 导出单独的方法，保持向后兼容性
export const getCustomerList = (params) => customerAPI.getCustomerList(params)
export const getCustomer = (id) => customerAPI.getCustomer(id)
export const createCustomer = (data) => customerAPI.createCustomer(data)
export const updateCustomer = (id, data) => customerAPI.updateCustomer(id, data)
export const deleteCustomer = (id) => customerAPI.deleteCustomer(id)
export const batchDeleteCustomers = (ids) => customerAPI.batchDeleteCustomers(ids)
export const updateCustomerStatus = (id, status) => customerAPI.updateCustomerStatus(id, status)
export const changeCustomerCreator = (id, newCreatorId) => customerAPI.changeCustomerCreator(id, newCreatorId)

export default customerAPI