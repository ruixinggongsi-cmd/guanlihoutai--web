import { useUserStore } from '../stores/user'

/**
 * 权限检查工具函数
 */
export const permissionUtils = {
  /**
   * 检查用户是否有指定权限
   * @param {string} permissionCode - 权限代码（菜单路径或功能代码）
   * @returns {boolean} 是否有权限
   */
  hasPermission(permissionCode) {
    const userStore = useUserStore()
    
    // 如果用户没有登录，返回false
    if (!userStore.isLoggedIn) {
      return false
    }
    
    // 获取用户菜单列表，只提取功能选项（type='function'的菜单项）
    const userMenus = userStore.userMenus || []
    
    // 从菜单中提取功能权限
    const functionPermissions = []
    
    // 递归遍历菜单，提取所有功能权限
    const extractFunctions = (menus) => {
      menus.forEach(menu => {
        // 如果当前菜单是功能类型，添加到权限列表
        if (menu.type === 'function' && menu.path) {
          functionPermissions.push(menu)
        }
        
        // 如果有子菜单，递归处理
        if (menu.children && Array.isArray(menu.children)) {
          extractFunctions(menu.children)
        }
      })
    }
    
    
    // 提取所有功能权限
    extractFunctions(userMenus)
    
    // 检查是否有指定权限
    return functionPermissions.some(permission => {
      // 支持多种匹配方式
      if (permission.path === permissionCode) return true
      if (permission.code === permissionCode) return true
      if (permission.name === permissionCode) return true
      
      return false
    })
  },

  /**
   * 检查用户是否有多个权限中的任意一个
   * @param {string[]} permissionCodes - 权限代码数组
   * @returns {boolean} 是否有任意权限
   */
  hasAnyPermission(permissionCodes) {
    if (!Array.isArray(permissionCodes)) {
      return false
    }
    
    return permissionCodes.some(code => this.hasPermission(code))
  },

  /**
   * 检查用户是否拥有所有指定权限
   * @param {string[]} permissionCodes - 权限代码数组
   * @returns {boolean} 是否拥有所有权限
   */
  hasAllPermissions(permissionCodes) {
    if (!Array.isArray(permissionCodes)) {
      return false
    }
    
    return permissionCodes.every(code => this.hasPermission(code))
  }
}

/**
 * 生成权限代码
 * @param {string} module - 模块名称
 * @param {string} action - 操作类型（add, edit, delete, view, approve等）
 * @returns {string} 权限代码
 */
export const generatePermissionCode = (module, action) => {
  const actionMap = {
    'add': 'add',
    'create': 'add',
    'edit': 'edit',
    'update': 'edit',
    'delete': 'delete',
    'remove': 'delete',
    'view': 'view',
    'query': 'view',
    'approve': 'approve',
    'audit': 'approve',
    'export': 'export',
    'import': 'import',
    'search': 'search',
    'reset': 'reset'
  }
  
  const normalizedAction = actionMap[action] || action
  return `${module}:${normalizedAction}`
}

/**
 * 从菜单路径生成权限代码
 * @param {string} path - 菜单路径
 * @param {string} action - 操作类型
 * @returns {string} 权限代码
 */
export const generatePermissionFromPath = (path, action) => {
  if (!path) return ''
  
  // 移除开头的斜杠
  const cleanPath = path.replace(/^\//, '')
  
  // 将路径转换为模块名
  const module = cleanPath.replace(/\//g, '_')
  
  return generatePermissionCode(module, action)
}

export default permissionUtils