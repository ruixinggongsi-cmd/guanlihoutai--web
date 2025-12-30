import request from '../utils/request.js'

// 联系记录管理API
export const contactRecordAPI = {
  // 添加联系记录
  createContactRecord(data) {
    return request.post('/contact-records', data)
  },

  // 按客户ID查询联系记录（分页）
  getContactRecordsByCustomer(customerId, params = {}) {
    return request.get(`/contact-records/customer/${customerId}`, params)
  },

  // 获取单个联系记录详情
  getContactRecord(id) {
    return request.get(`/contact-records/${id}`)
  },

  // 获取联系记录列表（支持分页和权限）
  getContactRecordsList(params = {}) {
    return request.get('/contact-records/list', params)
  }
}

// 导出单独的方法，保持向后兼容性
export const createContactRecord = (data) => contactRecordAPI.createContactRecord(data)
export const getContactRecordsByCustomer = (customerId, params) => contactRecordAPI.getContactRecordsByCustomer(customerId, params)
export const getContactRecord = (id) => contactRecordAPI.getContactRecord(id)
export const getContactRecordsList = (params) => contactRecordAPI.getContactRecordsList(params)
export default contactRecordAPI