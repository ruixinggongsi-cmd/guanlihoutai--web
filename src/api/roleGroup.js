import request from '../utils/request.js'

// 权限组管理API
export const roleGroupAPI = {
  // 获取权限组列表（分页）
  getRoleGroupList(params = {}) {
    return request.get('/role-groups/list', params)
  },

  // 获取权限组下拉选项（用于选择）
  getRoleGroupOptions() {
    return request.get('/role-groups/options')
  },

  // 获取单个权限组详情
  getRoleGroupDetail(id) {
    return request.get(`/role-groups/${id}`)
  },

  // 创建权限组
  createRoleGroup(data) {
    return request.post('/role-groups', data)
  },

  // 更新权限组
  updateRoleGroup(id, data) {
    return request.put(`/role-groups/${id}`, data)
  },

  // 删除权限组
  deleteRoleGroup(id) {
    return request.delete(`/role-groups/${id}`)
  },

  // 批量删除权限组
  batchDeleteRoleGroups(ids) {
    return request.post('/role-groups/batch-delete', { ids })
  },

  // 检查权限组代码是否已存在
  checkRoleGroupCodeExists(code, excludeId = null) {
    const params = { code }
    if (excludeId) {
      params.exclude_id = excludeId
    }
    return request.get('/role-groups/check-code', params)
  }
}

// 导出单独的方法，保持向后兼容性
export const getRoleGroupList = (params) => roleGroupAPI.getRoleGroupList(params)
export const getRoleGroupOptions = () => roleGroupAPI.getRoleGroupOptions()
export const getRoleGroupDetail = (id) => roleGroupAPI.getRoleGroupDetail(id)
export const createRoleGroup = (data) => roleGroupAPI.createRoleGroup(data)
export const updateRoleGroup = (id, data) => roleGroupAPI.updateRoleGroup(id, data)
export const deleteRoleGroup = (id) => roleGroupAPI.deleteRoleGroup(id)
export const batchDeleteRoleGroups = (ids) => roleGroupAPI.batchDeleteRoleGroups(ids)
export const checkRoleGroupCodeExists = (code, excludeId) => roleGroupAPI.checkRoleGroupCodeExists(code, excludeId)

export default roleGroupAPI