import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useUserStore = defineStore('user', () => {
  const userInfo = ref(null)
  const userToken = ref(null)
  const refreshToken = ref(null)
  const userMenus = ref([]) // 用户菜单
  const isLoggedIn = computed(() => !!userInfo.value)
  
  const setUserInfo = (info) => {
    userInfo.value = {
      ...info.user,
      roleInfo: info.user?.roleInfo || null // 添加角色信息
    }
    userToken.value = info.token
    if (info.refreshToken) {
      refreshToken.value = info.refreshToken
    }
  }

  // 设置用户菜单
  const setUserMenus = (menus) => {
    userMenus.value = menus || []
  }
  
  const logout = () => {
    userInfo.value = null
    userToken.value = null
    refreshToken.value = null
    userMenus.value = [] // 清除用户菜单
  }
  
  // 刷新访问令牌
  const refreshAccessToken = async () => {
    if (!refreshToken.value) {
      throw new Error('No refresh token available')
    }

    try {
      // 使用authAPI调用刷新token接口
      const { authAPI } = await import('../api/auth')
      const response = await authAPI.refreshToken({ refreshToken: refreshToken.value })
      
      if (response && response.success && response.data && response.data.token) {
        const newToken = response.data.token
        userToken.value = newToken
        return newToken
      }
      throw new Error('Failed to refresh token')
    } catch (error) {
      // 如果刷新失败，清除用户信息并跳转到登录页
      clearUser()
      router.push('/login')
    }
  }

  // 获取数据权限类型
  const getDataPermission = () => {
    if (!userInfo.value?.roleInfo) return 'all'
    return userInfo.value.roleInfo.data_permission || 'all'
  }
  
  // 检查是否有个人数据权限
  const hasPersonalDataPermission = () => {
    return getDataPermission() === 'personal'
  }
  
  // 检查是否有部门数据权限
  const hasDepartmentDataPermission = () => {
    return getDataPermission() === 'department'
  }
  
  // 检查是否有全部数据权限
  const hasAllDataPermission = () => {
    return getDataPermission() === 'all'
  }

  return {
    userInfo,
    userToken,
    refreshToken,
    userMenus,
    isLoggedIn,
    setUserInfo,
    setUserMenus,
    logout,
    refreshAccessToken,
    getDataPermission,
    hasPersonalDataPermission,
    hasDepartmentDataPermission,
    hasAllDataPermission
  }
}, {
  persist: {
    key: 'user-store',
    storage: localStorage,
    paths: ['userInfo', 'userToken', 'refreshToken', 'userMenus']
  }
})