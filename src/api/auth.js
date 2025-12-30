import request from '../utils/request.js'

// 用户认证API
export const authAPI = {
  // 用户登录
  login(data) {
    return request.post('/auth/login', data)
  },

  // 用户登出
  logout() {
    return request.post('/auth/logout')
  },

  // 刷新token
  refreshToken() {
    return request.post('/auth/refresh')
  },

  // 获取用户信息
  getUserInfo() {
    return request.get('/auth/me')
  },

  // 修改密码
  changePassword(data) {
    return request.post('/auth/change-password', data)
  },

  // 重置密码
  resetPassword(data) {
    return request.post('/auth/reset-password', data)
  },

  // 发送验证码
  sendVerificationCode(data) {
    return request.post('/auth/send-code', data)
  },

  // 验证验证码
  verifyCode(data) {
    return request.post('/auth/verify-code', data)
  },

  // 检查用户名是否可用
  checkUsername(username) {
    return request.get('/auth/check-username', { username })
  },

  // 检查邮箱是否可用
  checkEmail(email) {
    return request.get('/auth/check-email', { email })
  },

  // 根据用户角色获取菜单
  getMenusByRole() {
    console.log('获取用户菜单');
    return request.get('/auth/menus/by-role')
  }
}

// 导出单独的方法，保持向后兼容性
export const login = (data) => authAPI.login(data)
export const logout = () => authAPI.logout()
export const refreshToken = () => authAPI.refreshToken()
export const getUserInfo = () => authAPI.getUserInfo()
export const changePassword = (data) => authAPI.changePassword(data)
export const resetPassword = (data) => authAPI.resetPassword(data)
export const sendVerificationCode = (data) => authAPI.sendVerificationCode(data)
export const verifyCode = (data) => authAPI.verifyCode(data)
export const checkUsername = (username) => authAPI.checkUsername(username)
export const checkEmail = (email) => authAPI.checkEmail(email)
export const getMenusByRole = () => authAPI.getMenusByRole()

export default authAPI