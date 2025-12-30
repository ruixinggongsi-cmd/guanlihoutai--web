import request from '../utils/request.js'

// 用户管理API
export const userAPI = {
  // 获取用户列表（分页）
  getUserList(params = {}) {
    return request.get('/users/list', params)
  },

  // 获取单个用户详情
  getUser(id) {
    return request.get(`/users/${id}`)
  },

  // 创建用户
  createUser(data) {
    return request.post('/users', data)
  },

  // 更新用户
  updateUser(id, data) {
    return request.put(`/users/${id}`, data)
  },

  // 删除用户
  deleteUser(id) {
    return request.delete(`/users/${id}`)
  },

  // 批量删除用户
  batchDeleteUsers(ids) {
    return request.post('/users/batch-delete', { ids })
  },

  // 更新用户状态
  updateUserStatus(id, status) {
    return request.put(`/users/${id}`, { status })
  },

  // 修改用户密码
  updateUserPassword(id, oldPassword, newPassword) {
    return request.put(`/users/${id}/password`, { oldPassword, newPassword })
  },

  // 重置用户密码
  resetUserPassword(id) {
    return request.post(`/users/${id}/reset-password`)
  },

  // 分配用户角色
  assignUserRoles(id, roles) {
    return request.post(`/users/${id}/roles`, { roles })
  },

  // 获取用户角色
  getUserRoles(id) {
    return request.get(`/users/${id}/roles`)
  },

  // 获取用户权限
  getUserPermissions(id) {
    return request.get(`/users/${id}/permissions`)
  },

  // 导出用户数据
  exportUsers(params = {}) {
    return request.get('/users/export', { ...params, responseType: 'blob' })
  },

  // 导入用户数据
  importUsers(file) {
    const formData = new FormData()
    formData.append('file', file)
    
    return request.post('/users/import', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  },

  // 获取用户统计信息
  getUserStats() {
    return request.get('/users/stats')
  },

  // 获取在线用户列表
  getOnlineUsers() {
    return request.get('/users/online')
  },

  // 强制用户下线
  forceLogoutUser(id) {
    return request.post(`/users/${id}/force-logout`)
  }
}

// 导出单独的方法，保持向后兼容性
export const getUserList = (params) => userAPI.getUserList(params)
export const getUser = (id) => userAPI.getUser(id)
export const createUser = (data) => userAPI.createUser(data)
export const updateUser = (id, data) => userAPI.updateUser(id, data)
export const deleteUser = (id) => userAPI.deleteUser(id)
export const batchDeleteUsers = (ids) => userAPI.batchDeleteUsers(ids)
export const updateUserStatus = (id, status) => userAPI.updateUserStatus(id, status)
export const resetUserPassword = (id) => userAPI.resetUserPassword(id)
export const assignUserRoles = (id, roles) => userAPI.assignUserRoles(id, roles)
export const getUserRoles = (id) => userAPI.getUserRoles(id)
export const getUserPermissions = (id) => userAPI.getUserPermissions(id)
export const exportUsers = (params) => userAPI.exportUsers(params)
export const importUsers = (file) => userAPI.importUsers(file)
export const getUserStats = () => userAPI.getUserStats()
export const getOnlineUsers = () => userAPI.getOnlineUsers()
export const forceLogoutUser = (id) => userAPI.forceLogoutUser(id)

export default userAPI